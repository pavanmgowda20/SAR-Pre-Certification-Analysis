'use server';

import { generateSarRecommendations, type GenerateSarRecommendationsOutput, type GenerateSarRecommendationsInput } from '@/ai/flows/generate-sar-recommendations';
import { analyzeSpecDocument } from '@/ai/flows/analyze-spec-document';
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

    const analysisInput: GenerateSarRecommendationsInput = {
      ...validatedFields.data,
      gt: validatedFields.data.gt ?? 0,
      beamPointingAccuracy: validatedFields.data.beamPointingAccuracy ?? 0,
      islr: validatedFields.data.islr ?? 0,
      phaseStability: validatedFields.data.phaseStability ?? 0,
      amplitudeStability: validatedFields.data.amplitudeStability ?? 0,
      crossPolIsolation: validatedFields.data.crossPolIsolation ?? 0,
      pae: validatedFields.data.pae ?? 0,
      noiseFigure: validatedFields.data.noiseFigure ?? 0,
    };

    const result = await generateSarRecommendations(analysisInput);
    
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

export async function extractParametersFromFile(fileContent: string): Promise<Partial<SarAnalysisInput> | { error: string }> {
  try {
    const result = await analyzeSpecDocument({ documentText: fileContent });
    // The result from the flow is already in the correct shape (or will have missing fields)
    // We can cast it directly to our partial input type.
    return result as Partial<SarAnalysisInput>;
  } catch (e) {
    console.error("File Analysis Action Error:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `The document analysis failed: ${errorMessage}` };
  }
}
