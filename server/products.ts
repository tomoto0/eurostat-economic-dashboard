/**
 * Stripe Products and Prices Configuration
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  currency: string;
  features: string[];
}

export const PREMIUM_ANALYSIS_REPORT: Product = {
  id: "premium_analysis_report",
  name: "プレミアム分析レポート",
  description: "EU27カ国の詳細な経済分析レポート（PDF形式）",
  priceInCents: 2999,
  currency: "USD",
  features: [
    "詳細な経済分析レポート（PDF）",
    "全EU27カ国の経済指標データ",
    "AI生成による経済予測",
    "国別比較分析",
    "チャート・グラフの高解像度版",
    "3ヶ月間のデータ更新サポート",
  ],
};

export const PRODUCTS = [PREMIUM_ANALYSIS_REPORT];

export function getProductById(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId);
}
