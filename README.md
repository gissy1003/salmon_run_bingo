# random_weapon_bingo_NW

Splatoon3 のブキでビンゴを遊ぶツール。

## 必要なもの

- Node.js
- PHP (テンプレートの展開と開発サーバーに使用)

## コマンド

```sh
npm install
npm run dev        # TS/SCSS を監視ビルド + http://localhost:8080 で開発サーバー
npm run build      # 型チェック → JS/CSS 本番ビルド → docs/ に静的サイトを書き出し
npm run typecheck  # 型チェックのみ
```

## ディレクトリ構成

| パス | 内容 |
| --- | --- |
| `ts/` | TypeScript ソース (エントリ: `ts/index.ts`) |
| `template/` | サイトのソース。PHP テンプレート・SCSS・画像・フォント |
| `template/settings.php` | タイトル・バージョンなどのサイト設定 |
| `template/parts/` | HTML パーツ (PHP) |
| `template/css/src/` | SCSS ソース (エントリ: `template/css/style.scss`) |
| `html_template/make.php` | `template/` を `docs/` に書き出すスクリプト |
| `docs/` | 公開用の成果物 (GitHub Pages)。直接編集しない |

バージョンを上げるときは `template/settings.php` の `VERSION` を変更してから `npm run build` する (Service Worker のキャッシュが更新される)。
