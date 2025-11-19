import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PremiumReport() {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const createCheckoutMutation = trpc.payment.createCheckoutSession.useMutation();

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error("ログインが必要です");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createCheckoutMutation.mutateAsync({
        productId: "premium_analysis_report",
      });

      if (result.checkoutUrl) {
        toast.success("決済ページへ移動します...");
        window.open(result.checkoutUrl, "_blank");
      }
    } catch (error: any) {
      toast.error(error.message || "決済セッションの作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            プレミアム分析レポート
          </h1>
          <p className="text-xl text-gray-600">
            EU27カ国の詳細な経済分析レポート（PDF形式）
          </p>
        </div>

        <Card className="border-2 border-blue-200 bg-white shadow-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-2xl">プレミアム分析レポート</CardTitle>
            <CardDescription className="text-blue-100">
              包括的な経済分析と予測データ
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">$29.99</span>
                <span className="text-gray-600">USD</span>
              </div>
              <p className="text-gray-600 mt-2">ワンタイム購入</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                このレポートに含まれるもの：
              </h3>
              <ul className="space-y-3">
                {[
                  "詳細な経済分析レポート（PDF形式）",
                  "全EU27カ国の経済指標データ",
                  "AI生成による経済予測",
                  "国別比較分析",
                  "チャート・グラフの高解像度版",
                  "3ヶ月間のデータ更新サポート",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900">
                    ログインが必要です
                  </p>
                  <p className="text-sm text-yellow-800">
                    購入するには、まずログインしてください。
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handlePurchase}
              disabled={isLoading || !isAuthenticated}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  処理中...
                </>
              ) : (
                "今すぐ購入"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Stripeで安全に処理されます。クレジットカード情報は保存されません。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
