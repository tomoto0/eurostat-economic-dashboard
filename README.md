# Eurostat Economic Dashboard

## 概要

**Eurostat Economic Dashboard** は、欧州統計局（Eurostat）のAPIを活用して、EU加盟国の経済指標をリアルタイムで表示・分析するAIパワード経済ダッシュボードです。失業率、GDP、GDP成長率、インフレ率などの主要経済指標を時系列グラフで可視化し、Manus LLM APIを使用した自動AI分析により、経済トレンドの深い洞察を提供します。

**最終デプロイURL:** https://eurodash-ygpctjpf.manus.space

## メイン画面

![Eurostat Economic Dashboard](https://files.manuscdn.com/user_upload_by_module/session_file/116693025/epyneoRWlajkEyPt.jpg)

ダッシュボードは以下の主要セクションで構成されています：

- **AI分析ダッシュボード**: 2025年の経済分析サマリー、主要な発見、データ品質情報
- **国別経済分析**: EU27、ユーロ圏、個別国の選択による詳細分析
- **経済指標グラフ**:
  - 失業率（2015-2019年）
  - GDP（現在価格）（2015-2025年）
  - GDP成長率（実質）（2015-2025年）
  - インフレ率（HICP年間変化率）（2015-2025年）

## 主な機能

### 1. リアルタイム経済データ取得
- **データソース**: Eurostat API
- **対象指標**:
  - 失業率（lfsa_urgan）
  - GDP（現在価格）（nama_10_gdp）
  - GDP成長率（実質）（namq_10_gdp）
  - インフレ率（prc_hicp_manr）
- **対象国**: EU27、ユーロ圏20、ドイツ、フランス、イタリア、スペイン、オランダ
- **データ期間**: 2015-2025年（指標により異なる）

### 2. AI分析機能
- **LLM統合**: Manus LLM API
- **分析内容**:
  - 経済トレンドの自動分析
  - 主要な経済指標の解釈
  - 国別経済比較
  - データ品質評価
- **更新タイミング**: アプリケーション起動時に自動実行（キャッシュ機構により重複実行を防止）

### 3. インタラクティブなグラフ表示
- **チャートライブラリ**: Recharts
- **機能**:
  - 複数年の時系列データ表示
  - ツールチップによる詳細情報表示
  - レスポンシブデザイン対応
  - 横軸ラベルの45度回転表示（複数年の可読性向上）

### 4. Stripe決済機能（統合済み）
- **プレミアム分析レポート**: $29.99（ワンタイム購入）
- **機能**:
  - Checkout Session統合
  - Webhook処理（決済完了イベント）
  - 購入履歴管理
  - メール通知機能

## 技術仕様

### フロントエンド
- **フレームワーク**: React 19
- **スタイリング**: Tailwind CSS 4
- **UI コンポーネント**: shadcn/ui
- **チャート**: Recharts
- **ルーティング**: wouter
- **HTTP クライアント**: tRPC (React Query)
- **認証**: Manus OAuth

### バックエンド
- **ランタイム**: Node.js 22
- **フレームワーク**: Express 4
- **API フレームワーク**: tRPC 11
- **データベース**: MySQL/TiDB
- **ORM**: Drizzle ORM
- **LLM 統合**: Manus LLM API
- **決済**: Stripe API
- **ファイルストレージ**: S3

### データベース
- **テーブル構成**:
  - `users`: ユーザー情報（Manus OAuth連携）
  - `economicData`: Eurostat APIから取得した経済指標データ
  - `aiAnalysisResults`: LLM生成の分析結果キャッシュ
  - `purchases`: Stripe決済の購入履歴

### API 統合
- **Eurostat API**: 経済指標データ取得
- **Manus LLM API**: 経済分析の自動生成
- **Stripe API**: 決済処理・Webhook
- **Manus OAuth**: ユーザー認証

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React 19)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Home.tsx (Dashboard)                                 │   │
│  │ - AI分析結果表示                                       │   │
│  │ - 国別選択ドロップダウン                               　　   │   │
│  │ - 複数年時系列グラフ表示                             　    │   │
│  │ - 経済指標サマリー                                  　    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ PremiumReport.tsx (決済ページ)                     　　   │   │
│  │ PaymentSuccess.tsx / PaymentCancel.tsx               │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ tRPC
┌──────────────────────▼──────────────────────────────────────┐
│                  Backend (Express + tRPC)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ routers.ts                                           │   │
│  │ - dashboard.getEconomicData()                        │   │
│  │ - dashboard.getCountryData()                         │   │
│  │ - dashboard.getAnalysisResults()                     │   │
│  │ - payment.createCheckoutSession()                    │   │
│  │ - payment.getPurchaseHistory()                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ db.ts (Database Helpers)                             │   │
│  │ - getAllEconomicData()                               │   │
│  │ - getEconomicDataByCountry()                         │   │
│  │ - getAIAnalysisResults()                             │   │
│  │ - createPurchase() / getPurchasesByUserId()          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ External API Integration                             │   │
│  │ - Eurostat API (経済データ取得)                  　　　　　　    │   │
│  │ - Manus LLM API (AI分析)                       　　      │   │
│  │ - Stripe API (決済処理)                          　　　    │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   Database (MySQL/TiDB)                     │
│  - users, economicData, aiAnalysisResults, purchases        │
└─────────────────────────────────────────────────────────────┘
```

## ファイル構成

```
eurostat-dashboard-manus/
├── client/                          # フロントエンド
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # メインダッシュボード
│   │   │   ├── PremiumReport.tsx   # 決済ページ
│   │   │   ├── PaymentSuccess.tsx  # 決済成功ページ
│   │   │   └── PaymentCancel.tsx   # 決済キャンセルページ
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx # ダッシュボードレイアウト
│   │   │   └── ui/                 # shadcn/ui コンポーネント
│   │   ├── lib/
│   │   │   └── trpc.ts            # tRPC クライアント設定
│   │   ├── App.tsx                # ルーティング定義
│   │   ├── main.tsx               # エントリーポイント
│   │   └── index.css              # グローバルスタイル
│   ├── public/                     # 静的アセット
│   └── index.html
├── server/                          # バックエンド
│   ├── routers.ts                 # tRPC ルーター定義
│   ├── db.ts                      # データベースクエリヘルパー
│   ├── products.ts                # Stripe 商品定義
│   ├── _core/
│   │   ├── index.ts               # Express サーバー設定
│   │   ├── context.ts             # tRPC コンテキスト
│   │   ├── oauth.ts               # OAuth 処理
│   │   ├── llm.ts                 # LLM API ラッパー
│   │   └── ...
│   └── __tests__/
│       └── payment.test.ts        # 決済機能テスト
├── drizzle/
│   ├── schema.ts                  # データベーススキーマ
│   └── migrations/                # マイグレーションファイル
├── shared/
│   └── const.ts                   # 共有定数
├── storage/
│   └── index.ts                   # S3 ストレージヘルパー
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## デプロイ方法

### Manusサーバーへの再デプロイ

#### 前提条件
- Node.js 22以上
- pnpm パッケージマネージャー
- MySQL/TiDB データベース
- Manus プラットフォームアカウント

#### 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```bash
# データベース
DATABASE_URL=mysql://user:password@host:port/database

# Manus OAuth
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
JWT_SECRET=your_jwt_secret

# Manus LLM API
BUILT_IN_FORGE_API_URL=https://api.manus.im/forge
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im/forge
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# アプリケーション設定
VITE_APP_TITLE=Eurostat Economic Dashboard
VITE_APP_LOGO=https://...
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=Your Name
```

#### デプロイ手順

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/tomoto0/eurostat-economic-dashboard.git
   cd eurostat-economic-dashboard
   ```

2. **依存パッケージをインストール**
   ```bash
   pnpm install
   ```

3. **データベースマイグレーションを実行**
   ```bash
   pnpm db:push
   ```

4. **開発サーバーを起動（テスト用）**
   ```bash
   pnpm dev
   ```
   ブラウザで `http://localhost:3000` にアクセスしてテストします。

5. **本番ビルド**
   ```bash
   pnpm build
   ```

6. **本番サーバーを起動**
   ```bash
   pnpm start
   ```

#### Manusプラットフォームへのデプロイ

Manusプラットフォームの管理画面から以下の手順でデプロイしてください：

1. 新しいプロジェクトを作成
2. テンプレートとして「Web App Template (tRPC + Manus Auth + Database)」を選択
3. このGitHubレポジトリをソースとして指定
4. 環境変数を設定
5. デプロイボタンをクリック

## AI分析の更新タイミング

### 自動更新
- **アプリケーション起動時**: ダッシュボードが読み込まれる際に、AI分析結果が自動的に生成・キャッシュされます
- **キャッシュ機構**: 同じ分析結果は24時間キャッシュされ、不要な重複実行を防止します

### 手動更新
- ユーザーがページをリロードすると、新しい分析結果が生成されます
- キャッシュをクリアして強制的に再分析することも可能です

### 分析内容
- EU全体の経済トレンド分析
- 国別経済指標の比較分析
- インフレ率、失業率、GDP成長率の相関分析
- 経済見通しと推奨事項

## データカバレッジ

| 指標 | 期間 | 対象国数 | データポイント数 |
|------|------|---------|-----------------|
| 失業率（lfsa_urgan） | 2015-2019 | 7 | 35 |
| GDP（現在価格） | 2015-2025 | 7 | 77 |
| GDP成長率（実質） | 2015-2025 | 7 | 44 |
| インフレ率（HICP） | 2015-2025 | 7 | 77 |
| **合計** | - | - | **191** |

**対象国**: EU27、ユーロ圏20、ドイツ、フランス、イタリア、スペイン、オランダ

## 既知の制限事項

1. **失業率データ**: Eurostat APIから2019年までのみ取得可能（2020年以降のデータは利用不可）
2. **詳細分析**: 一部の国に対しては詳細な経済分析が利用できない場合があります
3. **リアルタイム性**: Eurostats APIのデータ更新遅延により、最新データは数ヶ月遅れる場合があります

## 今後の拡張予定

- [ ] 複数国の経済指標を同時表示して比較する機能
- [ ] グラフやデータをPDF/CSV形式でダウンロード可能にする
- [ ] Manus LLMを活用した2025-2026年の経済予測セクション追加
- [ ] より多くの国の詳細分析データの追加
- [ ] 月次データの取得と表示（四半期ベースのデータ）
- [ ] プレミアム分析レポートのPDF自動生成・配信機能

## テスト

### ユニットテスト実行
```bash
pnpm test
```

### テストカバレッジ
- 決済機能テスト（6つのテスト）
  - Purchase レコード作成
  - ユーザー別購入履歴取得
  - Stripe Payment Intent ID による検索
  - 購入ステータス更新
  - Stripe 商品定義検証
  - メール通知設定検証

## トラブルシューティング

### データベース接続エラー
```
Error: Failed to connect to database
```
**解決方法**: `DATABASE_URL` 環境変数が正しく設定されているか確認してください。

### Stripe キー設定エラー
```
Error: Stripe secret key not found
```
**解決方法**: `STRIPE_SECRET_KEY` と `STRIPE_WEBHOOK_SECRET` が正しく設定されているか確認してください。

### LLM API エラー
```
Error: Failed to invoke LLM
```
**解決方法**: `BUILT_IN_FORGE_API_KEY` が有効で、API エンドポイントにアクセス可能か確認してください。

## ライセンス

MIT License

## サポート

問題が発生した場合は、GitHubの Issues セクションで報告してください。

## 作成者

Manus Platform - Eurostat Economic Dashboard Team

## 参考リンク

- [Eurostat API ドキュメント](https://ec.europa.eu/eurostat/web/main/data/api)
- [Manus Platform](https://manus.im)
- [Stripe ドキュメント](https://stripe.com/docs)
- [tRPC ドキュメント](https://trpc.io)
- [Drizzle ORM ドキュメント](https://orm.drizzle.team)
