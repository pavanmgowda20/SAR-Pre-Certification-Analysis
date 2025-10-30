'use server';

import { generateSarRecommendations, type GenerateSarRecommendationsOutput } from '@/ai/flows/generate-sar-recommendations';
import { SarAnalysisSchema, type SarAnalysisInput } from '@/lib/schemas';

interface AnalysisResult {
  data?: GenerateSarRecommendationsOutput;
  error?: string;
}

export async function runAnalysis(input: SarAnalysisInput): Promise<AnalysisResult> {
  try {
    const validatedFields = SarAnalysisSchema.safeParse(input);

    if (!validatedFields.success) {
      return { error: "Invalid input provided. Please check the form and try again." }; 
    }

    const result = await generateSarRecommendations(validatedFields.data);
    
    if (!result) {
      return { error: "The analysis failed to produce a result. Please adjust your parameters or try again later." };
    }

    return { data: result };
  } catch (e) {
    console.error("SAR Analysis Action Error:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `The analysis encountered an unexpected server error: ${errorMessage}` };
  }
}
