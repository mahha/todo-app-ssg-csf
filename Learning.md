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

