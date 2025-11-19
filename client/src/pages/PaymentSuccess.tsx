import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function PaymentSuccess() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4">
      <Card className="border-2 border-green-200 bg-white shadow-lg max-w-md w-full">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl">決済完了</CardTitle>
          <CardDescription className="text-green-100">
            ご購入ありがとうございます
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>決済が正常に完了しました</strong>
            </p>
            <p className="text-sm text-gray-700">
              確認メールをご確認ください。プレミアム分析レポートがメールに添付されます。
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">次のステップ：</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="font-semibold text-green-600">1.</span>
                <span>確認メールをご確認ください</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-green-600">2.</span>
                <span>プレミアム分析レポートがメールに添付されます</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-green-600">3.</span>
                <span>3ヶ月間のデータ更新サポートが有効になります</span>
              </li>
            </ol>
          </div>

          <Button
            onClick={() => navigate("/")}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            ダッシュボードに戻る
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
