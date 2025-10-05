* 環境構築

https://github.com/GomaGoma676/todo-app-supabase-nextjs/blob/main/README.md

** 1. パッケージのインストール
npx create-next-app@12.3.3 todo-app-ssg-csf --typescript
cd todo-app-ssg-csf
yarn add @heroicons/react@1.0.6 @supabase/supabase-js@1.33.3 react-query@3.34.19 zustand@3.7.1
yarn add -D tailwindcss postcss autoprefixer
yarn add -D prettier prettier-plugin-tailwindcss

** 2. tailwindの設定 \*** postcss.config.mjsを新規作成する

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

*** tailwind.config.jsを変更(新規作成)する

```js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

*** styles/globals.css を以下に変更する
@import 'tailwindcss';
/*
v3形式の場合は以下のコメントアウトを解除する
@tailwind base;
@tailwind components;
@tailwind utilities;
*/

** 3. SupabaseのAPI設定
https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
.env.localに以下を設定
NEXT_PUBLIC_SUPABASE_URL=<SUBSTITUTE_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<SUBSTITUTE_SUPABASE_PUBLISHABLE_KEY>

* Supabaseの利用方法 (SSG編)
** utils/supabase.tsを作成し、環境変数からURLとAPI-KEYを取得してsupabaseインスタンスを作る
```tsx
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string
)
```

** getStaticPropsの内部でsupabaseを非同期アクセスする
- ここではpagesの下にssg.tsxを作成することで URL: xx/ssg のページを直接記述している
- アクセスする戻り型は別途types/types.tsなどで定義しておく。SQLアクセスの結果をそのまま配列に渡す
- getStaticPropsがreturnしたデータは　NextPage<StaticProps> = ({ tasks, notices }) => {}で受け取れる
@pages/ssg.tsx
```tsx
export const getStaticProps = async () => {
    console.log('getStaticProps/ssg incoked')

    const { data: tasks } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true })

    const { data: notices } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: true })

    return {
        props: { tasks, notices },
    }
}

type StaticProps = {
    tasks: Task[]
    notices: Notice[]
}

// Static propsのreturnと同じデータが受け取れる.
// 配列なので mapなどでイタレーション処理できる
const Ssg: NextPage<StaticProps> = ({ tasks, notices }) => {
    return (
        <Layout title="SSG">
            <ul className="mb-3">
                {tasks.map((task) => (
                    <li key={task.id}>
                        <p className="text-lg font-extrabold">{task.title}</p>
                    </li>
                ))}
            </ul>
        </Layout>
    )
}
```

* Supabaseの利用方法 (SSR編)
@pages/ssr.tsx
- 基本的にSSGと同じ構造
getStaticPropsの代わりにgetServerSidePropsで作成すればOK

* Supabaseの利用方法 (CSR編)
@pages/csr.tsx
- Csr の定義の中で useEffectでTask[],Notice[]取得　
- usrStateで状態変数を定義してTasks[],Noticesを代入
- StaticPropsやServerSidePropsで返したのと同じ名前の状態変数に
　しておくとレンダリングの中はSSG/SSRと同じでOK

* Supabaseの利用方法 (ISR編)
@pages/isr.tsx
- 基本的にSSGと同じ. getStaticPropsが返すpropsにrevalidate属性を付ける. (再レンダリング最小間隔)
```tsx
    return {
        props: { tasks, notices }, revalidate: 5,
    }
```
** ISRのメリット.
- SSGでビルド時にレンダリングするが内容を変更することができない.
- ISRは以下の２つの時に再生成を行う。ISRが再レンダリングされた時
1. ISRのページにアクセスした時
2. next/link, next/routerでプリフェッチされた時
- 多ユーザアクセスに有利.最初のアクセスは古いHTMLになるが以降のアクセスは更新されたHTMLになる


* Networkのデバッグ
** やりたい事1: CSRではSupabaseのデータが含まれていないことを確認する
- 解決: 開発者ツールの "Network"のログで csrをクリックし Preview を見る
この時点では Task/Noticeがない
** やりたい事2: クライアント側からのデータベースアクセスを見る
- 解決: Filterで "Fetch/XHR"をクリックし、nameでクエリを指定して "Response"を
選択するとデータベースから取得したJSONが見れる

* GitHubへの登録とVercelデプロイ
** GitへPUSH
-  Github HPでCreate New repo
- 表示されるQuick setup の 以下の枠のコマンドをコピー
"push an existing repository from the command line"
- Cursorのコンソール上でコピーしたコマンドを実行
git remote add origin https://github.com/mahha/todo-app-ssg-csf.git
git branch -M main
git push -u origin main
1行目：ローカルと GitHub 上のリポジトリが接続されます
2行目: 現在のブランチの名前を main に変更する. -Mは強制
3行目: ローカルの main ブランチをリモートの origin（GitHub）へ送信（push）
-u オプションは「アップストリームを設定する」意味です。これにより次回以降は単に git push や git pull だけで origin main に対応してくれるようになります。
** Vercelへデプロイ
- vercelへGitHubアカウントでログイン
- Nee Project
- GitHubのプロジェクトを選択
- 必要に応じて環境変数の設定 (今回は.env_localのsupabase API URL/KEY)
- Deployボタンをクリック
- 成功したらDashboardに移動
- DomainsにURLがあるのでクリック or コピーして開く

* Supabaseの認証
** Sign-in / Sign-out 
- 以下の非同期関数を定義しておきボタンなどに紐づける
```tsx
    const signOut = async () => {
        await supabase.auth.signOut()
    }
```
** defaultオプション
- _app.tsxに以下の定義を入れておくとディフォルトオプション設定できる
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // エラーが発生した場合はリトライしない
      refetchOnWindowFocus: false, // ウィンドウがフォーカスされた時に再フェッチしない
    }
  }
})
```
** ログイン状態の認識 @_app.tsx
- supabase.auth.user()でユーザー情報の取得可能
- ログイン状態に応じてuseRouter()のpushでページ遷移できる
```tsx
  const validateSession = async () => {
    const user = supabase.auth.user()
    if (user && pathname === '/') {
      push('/dashboard')
    }
  }
```

** ログイン状態変更のフック @_app.tsx
- 以下の関数を定義しておくとログイン状態の変更に反応してページ遷移などが可能
```tsx
  supabase.auth.onAuthStateChange((event, _) => {
    if (event === 'SIGNED_IN' && pathname === '/') {
      push('/dashboard')
    } else if (event === 'SIGNED_OUT') {
      push('/')
    }
  })
```

** ログイン/ユーザ登録の実装 @hooks/useMutateAuth.ts
- useMutationの mutationFn: onError: onSuccess: など作法に従って
実際のアクセス(supabaseとか)を記述していく
- useQueryは読み出し用なのでキャッシュするが、useMutationは更新用なのでキャッシュしない
- 認証用のhookを作成し、supabaseへのsignin/signupを実装し、hookする関数としてreturnする
- その他、認証に必要なemail/password/registerMutationなどもセットしておく
```tsx
    // ログイン
    const loginMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase.auth.signIn({ email, password })
            if (error) throw new Error(error.message)
        },
        onError: (err: any) => {
            alert(err.message)
            reset()
        },
    })
    return {loginMutation}
```
- Tips : group css. 親要素にgroupを付けると、親要素のイベントに対して子要素の変化を定義できる
以下は親要素のボタンのhoverに対して子要素のsvgアイコンの透明度を変化させている
```tsx
<button class="group flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
  <span>保存</span>
  <!-- アイコンは通常は透明、親 hover 時に不透明 -->
  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" 
       fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
  </svg>
</button>
```

* データベースへの新規登録/更新 No.18
@store.ts
** GUIで編集・Submitしたデータを状態変数に保持する
- zustandを使用する
- RecoilやReduxのように状態変数を管理するための軽量ライブラリ
- 状態変数とcreate(),set(),get()を持つ
- 状態変数と操作関数をStateとして定義し、useXXXとしてexportすると他の場所で参照できる
```tsx
type State = {
    editedTask: EditedTask
    editedNotice: EditedNotice
    updateEditedTask: (editedTask: EditedTask) => void
    updateEditedNotice: (editedNotice: EditedNotice) => void
    resetEditedTask: () => void
    resetEditedNotice: () => void
}

const useStore = create<State>((set: any) => ({
    // 状態変数と更新関数の定義
}))

export default useStore
```

** データベース取得のカスタムhook
- EditedTask/EditedNotice型を作成する.データベースで書き換えるべきでない情報を Omit<>で削る
- DB参照は useQuery '@tanstack/react-query'
- 実装例 @hooks/useQueryTasks.ts
- カスタムhookであるuseQUeryTasks内でDBアクセス関数を定義してhookであるuseQueryを実行し、
useQueryが返してきたオブジェクト({Tasks[],Error,isLoading,...})をカスタムhookの結果としても
returnする. こうする事で呼び出し側から間接的にuseQueryを使う事ができる
- useQueryはreact内部でキャッシュを持っており、再レンダリング時に不要なデータベースアクセスを防止する
```tsx
export const useQueryTasks = () => {
    const getTasks = async () => {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: true })

        if (error) {
            throw new Error(error.message)
        }
        return data
    }

    // useQueryの実行結果オブジェクト{Tasks[],Error,isLoasing,...}を返す
    return useQuery<Task[], Error>({ // <Task[], Error>はuseQueryTasks戻り型のジェネリック
        queryKey: ['todos'],    // キャッシュのキー
        queryFn: getTasks,      // キャッシュのデータを取得する関数
        staleTime: Infinity,    // キャッシュの有効期限
    })
}
```

** データベース更新のカスタムhook
- DB更新は useQueryClient, useMutation '@tanstack/react-query'
- 実装例は hooks/useMutateTasks.ts
- useQueryClientはreact内部のキャッシュへのハンドル.
- mutationFnにDB(supabase)へのアクセスを定義する
- onSuccessではDBの更新結果に応じてキャッシュを更新する
- onSuccessにはmutationFnでreturnした値、つまり追加したデータが返る
```tsx
export const useMutateTask = () => {
    const queryClient = useQueryClient()
    const reset = useStore((state) => state.resetEditedTask)　// 必要な状態更新関数を取得

    const createTaskMutation = useMutation({
        mutationFn: async (task: Omit<Task, 'id' | 'created_at'>) => {
            const { data, error } = await supabase.from('todos').insert(task)
            if (error) throw new Error(error.message)
            return data
        },
        onSuccess: (res) => {
            const previousTodos = queryClient.getQueryData<Task[]>(['todos'])
            if (previousTodos) {
                queryClient.setQueryData(['todos'], [...previousTodos, res[0]])
            }
            reset()
        },
        onError: (err: any) => {
            alert(err.message)
            reset()
        },
    })
}
```

** Task/Notice画面の表示
- 以下のコンポーネントを作成
-- スピナー
-- 入力フォーム (EditedTaskの状態に応じて Input内容やButtonのラベルが変わる)
-- タスクアイテム (編集/ゴミ箱ボタン付き. mutationに紐づく)
- _app.tsx に <ReactQueryDevtools/>を追加しているので解析ツールボタンがある
-- Noticeも同様。但しNoticeItemはユーザー毎の編集権限という概念がある
--- @components/NoticeItem.tsx
useStateでログインしているidを設定.各アイテムのuser_idと等しい時だけ表示
```tsx
    const [userId, setUserId] = useState<string | undefined>('')

    useEffect(() => {
        setUserId(supabase.auth.user()?.id)
    }, [])

    {userId === user_id && (
        // ボタン表示
    )}
```

** RLS (Row Level Securiry) Section2:No.21
- supabaseのテーブル(todos/notices)のRLSをEnableにする⇒全拒否
- supabase上でCreate Policy でINSERT/DELETE/UPDATE/SELECTを設定する
-- UPDATEだけはCheckを付けるのに注意
- Noticeのようにログインしている全員に閲覧許可する場合は
updateテンプレートでselectに変更すると可能. 動画　6:56

** デプロイ
git pushするとvercelでデプロイされる

** Test用のID **
user1@test1.com / hogehoge1
user2@test.com / hogehoge2

