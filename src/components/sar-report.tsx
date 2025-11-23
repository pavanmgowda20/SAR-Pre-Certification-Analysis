import type { GenerateSarRecommendationsOutput } from '@/ai/flows/generate-sar-recommendations';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileDown, Lightbulb, ShieldAlert, Sparkles, AlertTriangle, Calculator, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SarAnalysisInput } from '@/lib/schemas';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SarReportProps {
  data: GenerateSarRecommendationsOutput | null;
  isLoading: boolean;
  inputs: SarAnalysisInput | null;
}

const inputLabels: Record<keyof SarAnalysisInput, string> = {
  antennaGain: 'Antenna Gain (dBi)',
  frequency: 'Frequency (GHz)',
  inputPower: 'Total Input Power (dBm)',
  dutyCycle: 'Duty Cycle (%)',
  distance: 'Distance from body (cm)',
  sidelobeLevel: 'Sidelobe Level (dB)',
  eirp: 'EIRP (dBW)',
  gt: 'G/T (dB/K)',
  beamPointingAccuracy: 'Beam Pointing Accuracy (deg)',
  islr: 'ISLR (dB)',
  phaseStability: 'Phase Stability (deg RMS)',
  amplitudeStability: 'Amplitude Stability (dB RMS)',
  chirpBandwidth: 'Chirp Bandwidth (MHz)',
  crossPolIsolation: 'Cross-Polarization Isolation (dB)',
  trmOutputPower: 'TRM Output Power (W)',
  pae: 'Power Added Efficiency (%)',
  noiseFigure: 'Noise Figure (dB)',
  dcPowerConsumption: 'DC Power Consumption (kW)',
};


function ReportView({ data, inputs }: { data: GenerateSarRecommendationsOutput; inputs: SarAnalysisInput | null }) {
  const handleDownload = () => {
    window.print();
  };

  const isFail = data.analysisOverview.toLowerCase().startsWith('fail');

  const renderInputTable = () => {
    if (!inputs) return null;

    const filteredInputs = Object.entries(inputs).filter(([, value]) => value !== undefined && value !== null && value !== '' && value !== 0);

    if (filteredInputs.length === 0) return null;

    return (
      <div className="break-inside-avoid">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <List className="w-5 h-5 text-accent" />
          Input Parameters
        </h3>
        <Table className="mb-8">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Parameter</TableHead>
              <TableHead className="w-[40%] text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInputs.map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{inputLabels[key as keyof SarAnalysisInput]}</TableCell>
                <TableCell className="text-right">{String(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div id="sar-report-container">
      <div id="sar-report-content">
        <CardHeader>
          <CardTitle className="text-2xl">SAR Pre-Certification Report</CardTitle>
          <CardDescription>
            An automated analysis based on the provided parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {renderInputTable()}

          <div className="break-inside-avoid">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Analysis Overview
            </h3>
            <div className="flex justify-between items-start">
                <p className="text-muted-foreground pr-4">{data.analysisOverview}</p>
                <Badge variant={isFail ? 'destructive' : 'default'} className="text-lg flex-shrink-0">
                    {isFail ? (
                        <AlertTriangle className="mr-2 h-5 w-5" />
                    ) : (
                        <CheckCircle className="mr-2 h-5 w-5" />
                    )}
                    {data.analysisOverview.split(' ')[0]}
                </Badge>
            </div>
          </div>
          
          {data.calculations && data.calculations.length > 0 && (
            <div className="break-inside-avoid">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-accent" />
                Key Calculations
              </h3>
              <div className="space-y-4">
                {data.calculations.map((calc, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-background/50">
                    <p className="font-semibold">{calc.parameter}: <span className="font-mono text-primary">{calc.value}</span></p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-semibold">Formula:</span> {calc.formula}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="break-inside-avoid">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              Recommendations
            </h3>
            <div className="space-y-4">
              {data.recommendations.map((rec, index) => (
                <div key={index} className="p-4 border rounded-lg bg-background/50">
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
          Save Report
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
        Fill in the detailed AAAU parameters on the left to run the automated pre-certification analysis. The results and recommendations will appear here.
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

export function SarReport({ data, isLoading, inputs }: SarReportProps) {
  return (
    <Card className="w-full min-h-[500px] lg:min-h-full flex flex-col shadow-lg">
      {isLoading ? <LoadingView /> : data ? <ReportView data={data} inputs={inputs} /> : <WelcomeView />}
    </Card>
  );
}
