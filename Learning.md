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
