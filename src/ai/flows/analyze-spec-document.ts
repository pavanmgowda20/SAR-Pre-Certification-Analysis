'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing a specification document and extracting SAR parameters.
 *
 * - analyzeSpecificationDocument - A function that takes document text and extracts SAR parameters.
 * - AnalyzeSpecDocumentOutput - The return type for the analyzeSpecificationDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeSpecDocumentOutputSchema = z.object({
  antennaGain: z.number().optional(),
  frequency: z.number().optional(),
  sidelobeLevel: z.number().optional(),
  inputPower: z.number().optional(),
  dutyCycle: z.number().optional(),
  distance: z.number().optional(),
  gt: z.number().optional(),
  beamPointingAccuracy: z.number().optional(),
  islr: z.number().optional(),
  phaseStability: z.number().optional(),
  amplitudeStability: z.number().optional(),
  crossPolIsolation: z.number().optional(),
  pae: z.number().optional(),
  noiseFigure: z.number().optional(),
});

export type AnalyzeSpecDocumentOutput = z.infer<typeof AnalyzeSpecDocumentOutputSchema>;

export async function analyzeSpecificationDocument(
  documentText: string
): Promise<AnalyzeSpecDocumentOutput> {
  return analyzeSpecDocumentFlow(documentText);
}

const analyzeDocumentPrompt = ai.definePrompt({
  name: 'analyzeDocumentPrompt',
  input: { schema: z.string() },
  output: { schema: AnalyzeSpecDocumentOutputSchema },
  prompt: `You are an expert at analyzing technical specification documents for wireless communication systems, specifically for SAR (Specific Absorption Rate) compliance.

Your task is to read the following document text and extract the values for the specified AAAU (Active Antenna Array Unit) parameters.

- Identify the value for each parameter in the output schema.
- The value MUST be a number. Do not include units.
- If a parameter is explicitly mentioned, extract its numerical value.
- If a parameter is not mentioned or its value cannot be determined from the text, leave it as undefined.

Analyze the following document content:

---
{{input}}
---
`,
});

const analyzeSpecDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeSpecDocumentFlow',
    inputSchema: z.string(),
    outputSchema: AnalyzeSpecDocumentOutputSchema,
  },
  async (documentText) => {
    const { output } = await analyzeDocumentPrompt(documentText);
    return output!;
  }
);
