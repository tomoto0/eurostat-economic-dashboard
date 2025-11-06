import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Globe, BarChart3 } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useEffect, useState } from "react";

interface AnalysisResult {
  title: string;
  summary: string;
  keyFindings: string[];
  methodology: string;
  dataQuality: string;
  europeanEconomicSummary: string;
  countries: Record<string, any>;
  indicators: Record<string, any>;
  statistics: any;
  generatedAt: string;
}

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("EU27_2020");
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load analysis data from public JSON file
  useEffect(() => {
    const loadAnalysisData = async () => {
      try {
        setIsLoadingData(true);
        const response = await fetch("/ai-analysis.json");
        if (!response.ok) {
          throw new Error("Failed to load analysis data");
        }
        const data = await response.json();
        setAnalysisData(data);
      } catch (error) {
        console.error("Failed to load analysis data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAnalysisData();
  }, []);

  const getCountryName = (code: string): string => {
    const countryNames: Record<string, string> = {
      "EU27_2020": "EU27",
      "EA20": "ユーロ圏20",
      "DE": "ドイツ",
      "FR": "フランス",
      "IT": "イタリア",
      "ES": "スペイン",
      "NL": "オランダ",
      "PL": "ポーランド",
      "BE": "ベルギー",
      "AT": "オーストリア",
      "SE": "スウェーデン",
      "DK": "デンマーク",
      "FI": "フィンランド",
      "IE": "アイルランド",
      "PT": "ポルトガル",
      "CZ": "チェコ",
      "HU": "ハンガリー",
      "GR": "ギリシャ",
    };
    return countryNames[code] || code;
  };

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Eurostat Economic Dashboard</h1>
              <p className="text-sm text-gray-600">EU加盟国の経済指標分析 - AI powered by Manus LLM</p>
            </div>
          </div>
          {isAuthenticated ? (
            <div className="text-right">
              <p className="text-sm text-gray-600">ログイン中: {user?.name || "User"}</p>
            </div>
          ) : (
            <Button onClick={() => (window.location.href = getLoginUrl())}>ログイン</Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Section */}
        {analysisData && (
          <section className="mb-8">
            <Card className="border-blue-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  {analysisData.title}
                </CardTitle>
                <CardDescription>最終更新: {new Date(analysisData.generatedAt).toLocaleString("ja-JP")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">概要</h3>
                  <p className="text-gray-700">{analysisData.summary}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">主要な発見</h3>
                  <ul className="space-y-2">
                    {analysisData.keyFindings && analysisData.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex gap-2 text-gray-700">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">分析方法論</h4>
                    <p className="text-sm text-gray-600">{analysisData.methodology}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">データ品質</h4>
                    <p className="text-sm text-gray-600">{analysisData.dataQuality}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* European Economic Summary */}
        {analysisData && (
          <section className="mb-8">
            <Card className="border-green-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  欧州経済全体の分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{analysisData.europeanEconomicSummary}</p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Country Selection and Data */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            国別経済分析
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">国を選択:</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="EU27_2020">EU27</option>
              <option value="EA20">ユーロ圏20</option>
              <option value="DE">ドイツ</option>
              <option value="FR">フランス</option>
              <option value="IT">イタリア</option>
              <option value="ES">スペイン</option>
              <option value="NL">オランダ</option>
              <option value="PL">ポーランド</option>
              <option value="BE">ベルギー</option>
              <option value="AT">オーストリア</option>
              <option value="SE">スウェーデン</option>
              <option value="DK">デンマーク</option>
              <option value="FI">フィンランド</option>
              <option value="IE">アイルランド</option>
              <option value="PT">ポルトガル</option>
              <option value="CZ">チェコ</option>
              <option value="HU">ハンガリー</option>
              <option value="GR">ギリシャ</option>
            </select>
          </div>

          {/* Country Analysis Card */}
          {analysisData && analysisData.countries && analysisData.countries[selectedCountry] && (
            <Card className="border-purple-200 bg-white">
              <CardHeader>
                <CardTitle>{getCountryName(selectedCountry)}の経済分析</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">経済概要</h4>
                  <p className="text-gray-700">{analysisData.countries[selectedCountry].economicOverview}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">強み</h4>
                    <ul className="space-y-1">
                      {analysisData.countries[selectedCountry].strengths && analysisData.countries[selectedCountry].strengths.map((strength: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">課題</h4>
                    <ul className="space-y-1">
                      {analysisData.countries[selectedCountry].challenges && analysisData.countries[selectedCountry].challenges.map((challenge: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700">• {challenge}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">経済トレンド</h4>
                  <div className="space-y-2 text-sm">
                    {analysisData.countries[selectedCountry].trends && (
                      <>
                        <div><span className="font-medium">GDP:</span> {analysisData.countries[selectedCountry].trends.gdp}</div>
                        <div><span className="font-medium">雇用:</span> {analysisData.countries[selectedCountry].trends.employment}</div>
                        <div><span className="font-medium">インフレ:</span> {analysisData.countries[selectedCountry].trends.inflation}</div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">今後の展望</h4>
                  <p className="text-gray-700">{analysisData.countries[selectedCountry].outlook}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Key Indicators */}
        {analysisData && analysisData.indicators && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">主要経済指標</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analysisData.indicators).map(([code, indicator]: [string, any]) => (
                <Card key={code} className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg">{indicator.indicator}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-700">{indicator.analysis}</p>
                    {indicator.insights && (
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">インサイト</h4>
                        <ul className="space-y-1">
                          {indicator.insights.map((insight: string, idx: number) => (
                            <li key={idx} className="text-xs text-gray-600">• {insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>Eurostat Economic Dashboard © 2025 | Powered by Manus LLM | Data from Eurostat</p>
        </div>
      </footer>
    </div>
  );
}
