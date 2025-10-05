- Case1: TailwindCSSが反映されない
  現象: classNameで指定したCSSが反映されない
  原因: 教材のglobals.cssの書き方が古かった(v3)
  解決: global.cssをv4形式の以下にする
  @import "tailwindcss";

- Case2: supabaseがインスタンスできない
  現象: SupabaseのKEYを要求するエラーメッセージが出る
  原因: .env.localで宣言していた環境変数名と教材の環境変数名が微妙に違った
  解決: SupabaseのサイトのNext.jsの案内にある環境変数に合わせた

- Case3: getStaticPropsの importが警告を受ける
　原因: getStaticPropsは関数の宣言だけで良い特殊な関数の為
  解決: importを削除する

- Case4: QUeryClientProviderの子要素が正しくないとビルドエラーになる
  セクション2/No17
  原因: react-queryのバージョンが古い
  対策: @transtack/react-queryに変更する
  npm uninstall react-query
  rm -rf node_modules package-lock.json
  npm install
  npm install @tanstack/react-query @tanstack/react-query-devtools
  ※react-queryを開発していた Tanner Linsley 氏が開発しているOSSらしい

- Case5: QueryClientのキャッシュがクリアできない
  セクション2/No21
  原因: 仕様が変更になっている
  対策: queryKey:を追加する
  旧
  ```tsx
    queryClient.removeQueries('notices')
    queryClient.removeQueries('todos')
  ```
  新
  ```tsx
    queryClient.removeQueries({ queryKey: ['notices'] })
    queryClient.removeQueries({ queryKey: ['todos'] })
    queryClient.clear()
  ```
- Case6: QueryClientのキャッシュがクリアできない その２
  セクション2/No21
  原因: removeQueriesのkeyを間違えて'tasks'にしていた
  対策: keyを'todos'に修正. LLMの推奨でclear()も付加. 
  　　　clear()だけでも良いらしい. keyを間違えても怒られない