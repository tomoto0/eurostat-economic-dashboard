import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function PaymentCancel() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-12 px-4">
      <Card className="border-2 border-orange-200 bg-white shadow-lg max-w-md w-full">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl">決済がキャンセルされました</CardTitle>
          <CardDescription className="text-orange-100">
            購入プロセスが中断されました
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              決済がキャンセルされたため、プレミアム分析レポートは購入されていません。
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">何か問題がありましたか？</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span>•</span>
                <span>クレジットカード情報が正しいか確認してください</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>ブラウザのキャッシュをクリアして再度お試しください</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>別のお支払い方法をお試しください</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => navigate("/premium-report")}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              もう一度試す
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
            >
              ダッシュボードに戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
