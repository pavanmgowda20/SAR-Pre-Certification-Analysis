'use server';

import { generateSarRecommendations, type GenerateSarRecommendationsOutput, type GenerateSarRecommendationsInput } from '@/ai/flows/generate-sar-recommendations';
import { analyzeSpecificationDocument, type AnalyzeSpecDocumentOutput } from '@/ai/flows/analyze-spec-document';
import { SarAnalysisSchema, type SarAnalysisInput } from '@/lib/schemas';

interface AnalysisResult {
  data?: GenerateSarRecommendationsOutput;
  error?: string;
}

interface ExtractionResult {
  data?: AnalyzeSpecDocumentOutput;
  error?: string;
}

export async function extractParametersFromFile(documentText: string): Promise<ExtractionResult> {
  try {
    if (!documentText) {
      return { error: 'The document appears to be empty.' };
    }
    const result = await analyzeSpecificationDocument(documentText);
    if (!result) {
      return { error: 'Failed to extract parameters from the document.' };
    }
    return { data: result };
  } catch (e) {
    console.error('File Analysis Action Error:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during file analysis.';
    return { error: `Server error: ${errorMessage}` };
  }
}

export async function runAnalysis(input: GenerateSarRecommendationsInput): Promise<AnalysisResult> {
  try {
    // We can't fully validate against SarAnalysisSchema as `input` can have extra fields
    const validatedFields = SarAnalysisSchema.safeParse(input);

    if (!validatedFields.success) {
      return { error: "Invalid input provided for core parameters. Please check the form and try again." }; 
    }

    // `input` already contains the merged data from the form and the extracted file data
    const result = await generateSarRecommendations(input);
    
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
