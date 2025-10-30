import type { GenerateSarRecommendationsOutput } from '@/ai/flows/generate-sar-recommendations';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileDown, Lightbulb, ShieldAlert, Sparkles, AlertTriangle, Calculator } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


interface SarReportProps {
  data: GenerateSarRecommendationsOutput | null;
  isLoading: boolean;
}

function ReportView({ data }: { data: GenerateSarRecommendationsOutput }) {
  const handleDownload = async () => {
    window.print();
  };

  const isFail = data.analysisOverview.toLowerCase().startsWith('fail');

  return (
    <div id="sar-report-container">
      <div id="sar-report-content">
        <CardHeader>
          <div className="flex justify-between items-start">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Analysis Overview
              </CardTitle>
              <Badge variant={isFail ? 'destructive' : 'default'} className="text-lg">
                  {isFail ? (
                      <AlertTriangle className="mr-2 h-5 w-5" />
                  ) : (
                      <CheckCircle className="mr-2 h-5 w-5" />
                  )}
                  {data.analysisOverview.split(' ')[0]}
              </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <p className="text-muted-foreground">{data.analysisOverview}</p>
          
          {data.calculations && data.calculations.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-accent" />
                Key Calculations
              </h3>
              <div className="space-y-4">
                {data.calculations.map((calc, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-background/50 break-inside-avoid">
                    <p className="font-semibold">{calc.parameter}: <span className="font-mono text-primary">{calc.value}</span></p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-semibold">Formula:</span> {calc.formula}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Recommendations
            </h3>
            <div className="space-y-4">
              {data.recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg bg-background/50 break-inside-avoid">
                  <p className="font-semibold flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{rec.recommendation}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 pl-7">
                    <strong>Rationale:</strong> {rec.rationale.evidence}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
       <CardFooter className="mt-auto pt-6 no-print">
        <Button onClick={handleDownload} className="w-full bg-accent hover:bg-accent/90" size="lg">
          <FileDown className="mr-2 h-5 w-5" />
          Save Report as PDF
        </Button>
      </CardFooter>
    </div>
  );
}

function WelcomeView() {
  return (
    <CardContent className="flex flex-col items-center justify-center text-center h-full gap-4 p-8">
      <div className="p-4 bg-primary/10 rounded-full">
        <ShieldAlert className="w-16 h-16 text-primary" />
      </div>
      <h2 className="text-2xl font-bold">Ready for Analysis</h2>
      <p className="text-muted-foreground max-w-sm">
        Fill in the detailed AAAU parameters on the left to run the automated SAR pre-certification analysis. The results and recommendations will appear here.
      </p>
    </CardContent>
  );
}

function LoadingView() {
  return (
    <CardContent className="flex flex-col items-center justify-center text-center h-full gap-4 p-8">
      <div className="p-4 bg-primary/10 rounded-full">
        <Sparkles className="w-16 h-16 text-primary animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold">Analyzing...</h2>
      <p className="text-muted-foreground max-w-sm">
        The system is processing the parameters. This may take a moment.
      </p>
    </CardContent>
  );
}

export function SarReport({ data, isLoading }: SarReportProps) {
  return (
    <Card className="w-full min-h-[500px] lg:min-h-full flex flex-col shadow-lg">
      {isLoading ? <LoadingView /> : data ? <ReportView data={data} /> : <WelcomeView />}
    </Card>
  );
}
