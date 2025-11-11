import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Globe, BarChart3 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

interface EconomicData {
  country: string;
  countryCode: string;
  indicator: string;
  indicatorCode: string;
  year: number;
  value: number | string;
  unit?: string;
}

interface CountryData {
  name: string;
  data: EconomicData[];
}

interface EconomicDataFile {
  byCountry: Record<string, CountryData>;
  byIndicator: Record<string, any>;
  summary: any;
}

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
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [economicData, setEconomicData] = useState<EconomicDataFile | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("EU27_2020");
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load analysis and economic data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const [analysisRes, economicRes] = await Promise.all([
          fetch("/ai-analysis.json"),
          fetch("/economic-data.json"),
        ]);

        if (!analysisRes.ok || !economicRes.ok) {
          throw new Error("Failed to load data");
        }

        const analysis = await analysisRes.json();
        const economic = await economicRes.json();

        setAnalysisData(analysis);
        setEconomicData(economic);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
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

  // Get country data for selected country
  const countryData = useMemo(() => {
    if (!economicData || !economicData.byCountry[selectedCountry]) {
      return null;
    }
    return economicData.byCountry[selectedCountry];
  }, [economicData, selectedCountry]);

  // Prepare chart data for a specific indicator
  const getIndicatorChartData = (indicatorCode: string) => {
    if (!countryData) return [];

    const indicatorData = countryData.data
      .filter((d) => d.indicatorCode === indicatorCode)
      .sort((a, b) => a.year - b.year);

    // Get the last 10 years of data
    const currentYear = new Date().getFullYear();
    const tenYearsAgo = currentYear - 10;
    
    const filteredData = indicatorData.filter((d) => d.year >= tenYearsAgo);
    
    // If we have less than 10 years, return all available data
    const dataToUse = filteredData.length > 0 ? filteredData : indicatorData;

    return dataToUse.map((d) => ({
      year: d.year,
      value: typeof d.value === "string" ? parseFloat(d.value) : d.value,
      unit: d.unit,
      indicator: d.indicator,
    }));
  };

  // Get all indicators for the country
  const countryIndicators = useMemo(() => {
    if (!countryData) return [];
    const indicators = new Map<string, EconomicData>();
    countryData.data.forEach((d) => {
      if (!indicators.has(d.indicatorCode)) {
        indicators.set(d.indicatorCode, d);
      }
    });
    return Array.from(indicators.values());
  }, [countryData]);

  // Get latest values for key indicators
  const latestValues = useMemo(() => {
    if (!countryData) return {};

    const latestByIndicator: Record<string, any> = {};
    countryData.data.forEach((d) => {
      if (!latestByIndicator[d.indicatorCode] || d.year > latestByIndicator[d.indicatorCode].year) {
        latestByIndicator[d.indicatorCode] = d;
      }
    });
    return latestByIndicator;
  }, [countryData]);

  if (isLoadingData) {
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
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Eurostat Economic Dashboard</h1>
            <p className="text-sm text-gray-600">EU加盟国の経済指標分析 - AI powered by Manus LLM</p>
          </div>
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

                {/* Statistics Summary */}
                {analysisData.statistics && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">対象国数</p>
                      <p className="text-2xl font-bold text-blue-600">{Object.keys(analysisData.statistics).length}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">データレコード数</p>
                      <p className="text-2xl font-bold text-green-600">
                        {Object.values(analysisData.statistics).reduce((sum: number, country: any) => sum + (country.totalRecords || 0), 0)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">指標数</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {analysisData.statistics[Object.keys(analysisData.statistics)[0]]?.indicators ? Object.keys(analysisData.statistics[Object.keys(analysisData.statistics)[0]].indicators).length : 0}
                      </p>
                    </div>
                  </div>
                )}
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
{countryData && analysisData && analysisData.countries && (
            <Card className={analysisData.countries[selectedCountry] ? "border-purple-200 bg-white mb-8" : "border-yellow-200 bg-yellow-50 mb-8"}>
              {analysisData.countries[selectedCountry] ? (
                <>
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
                </>
              ) : (
                <CardContent className="pt-6">
                  <p className="text-gray-700">選択した国の詳細な経済分析は現在利用できません。利用可能な国：ドイツ、スペイン、フランス、イタリア、オランダ</p>
                </CardContent>
              )}
            </Card>
          )}

          {/* Economic Indicators Charts */}
          {countryData && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">経済指標の推移</h3>

              {/* Unemployment Rate */}
              {getIndicatorChartData("lfsa_urgan").length > 0 && (
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">失業率の推移</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getIndicatorChartData("lfsa_urgan")}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => `${value}%`}
                          labelFormatter={(label) => `年: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          dot={{ fill: "#3b82f6" }}
                          name="失業率 (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* GDP */}
              {getIndicatorChartData("nama_10_gdp").length > 0 && (
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">GDP（現在価格）の推移</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getIndicatorChartData("nama_10_gdp")}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => `€${(value as number).toLocaleString()}`}
                          labelFormatter={(label) => `年: ${label}`}
                        />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          fill="#10b981" 
                          name="GDP (€百万)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* GDP Growth Rate */}
              {getIndicatorChartData("tec00115").length > 0 && (
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">GDP成長率（実質）の推移</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={getIndicatorChartData("tec00115")}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => `${value}%`}
                          labelFormatter={(label) => `年: ${label}`}
                        />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          fill="#8b5cf6"
                          name="成長率 (%)"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Inflation Rate */}
              {getIndicatorChartData("prc_hicp_aind") && getIndicatorChartData("prc_hicp_aind").length > 0 && (
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">インフレ率（HICP）の推移</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getIndicatorChartData("prc_hicp_aind")}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => `${value}%`}
                          labelFormatter={(label) => `年: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#f59e0b" 
                          dot={{ fill: "#f59e0b" }}
                          name="インフレ率 (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Per Capita GDP */}
              {getIndicatorChartData("nama_10_pc_gdp").length > 0 && (
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg">一人当たりGDPの推移</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getIndicatorChartData("nama_10_pc_gdp")}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => `€${(value as number).toLocaleString()}`}
                          labelFormatter={(label) => `年: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#06b6d4" 
                          dot={{ fill: "#06b6d4" }}
                          name="一人当たりGDP (€)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Latest Values Summary */}
          {countryData && (
            <Card className="bg-white border-gray-200 mt-8">
              <CardHeader>
                <CardTitle>{getCountryName(selectedCountry)}の最新経済指標</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {countryIndicators.map((indicator) => {
                    const latest = latestValues[indicator.indicatorCode];
                    if (!latest) return null;
                    return (
                      <div key={indicator.indicatorCode} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">{indicator.indicator}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                          {typeof latest.value === "string" ? latest.value : latest.value.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{latest.unit} ({latest.year}年)</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </section>
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
