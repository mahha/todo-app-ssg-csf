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
  　