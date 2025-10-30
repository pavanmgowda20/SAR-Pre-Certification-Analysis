'use client';

import { useState } from 'react';
import type { GenerateSarRecommendationsOutput } from '@/ai/flows/generate-sar-recommendations';
import { runAnalysis } from '@/app/actions';
import type { SarAnalysisInput } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { SarInputForm } from '@/components/sar-input-form';
import { SarReport } from '@/components/sar-report';
import { CalculationFormulas } from '@/components/calculation-formulas';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<GenerateSarRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysisSubmit = async (data: SarAnalysisInput) => {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await runAnalysis(data);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Error',
          description: result.error,
        });
      } else if (result.data) {
        setAnalysisResult(result.data);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Unexpected Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-4 md:p-8 container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-8 no-print">
          <SarInputForm
            onAnalysisSubmit={handleAnalysisSubmit}
            isSubmitting={isLoading}
          />
          <CalculationFormulas />
        </div>
        <div className="lg:col-span-2">
          <SarReport data={analysisResult} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
