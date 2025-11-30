'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing a specification document and extracting SAR parameters.
 *
 * - analyzeSpecDocument - A function that orchestrates the document analysis process.
 * - AnalyzeSpecDocumentInput - The input type for the analyzeSpecDocument function.
 * - AnalyzeSpecDocumentOutput - The return type for the analyzeSpecDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the schema for the input, which is the text content of the document.
const AnalyzeSpecDocumentInputSchema = z.object({
  documentText: z.string().describe('The full text content of the specification document.'),
});
export type AnalyzeSpecDocumentInput = z.infer<typeof AnalyzeSpecDocumentInputSchema>;

// Define the schema for the output. This should match the SarAnalysisInput schema from the main app,
// but all fields should be optional, as not all may be present in the document.
const AnalyzeSpecDocumentOutputSchema = z.object({
  antennaGain: z.number().optional().describe('Antenna Gain in dBi'),
  frequency: z.number().optional().describe('Frequency in GHz'),
  inputPower: z.number().optional().describe('Total Input Power in dBm'),
  dutyCycle: z.number().optional().describe('Duty Cycle as a percentage'),
  distance: z.number().optional().describe('Distance from body in cm'),
  gt: z.number().optional().describe('G/T in dB/K'),
  beamPointingAccuracy: z.number().optional().describe('Beam Pointing Accuracy in degrees'),
  sidelobeLevel: z.number().optional().describe('Sidelobe Level (SLL) in dB'),
  islr: z.number().optional().describe('Integrated Sidelobe Ratio (ISLR) in dB'),
  phaseStability: z.number().optional().describe('Phase Stability in degrees'),
  amplitudeStability: z.number().optional().describe('Amplitude Stability in dB'),
  crossPolIsolation: z.number().optional().describe('Cross-Polarization Isolation in dB'),
  pae: z.number().optional().describe('Power Added Efficiency (PAE) as a percentage'),
  noiseFigure: z.number().optional().describe('Noise Figure in dB'),
});

export type AnalyzeSpecDocumentOutput = z.infer<typeof AnalyzeSpecDocumentOutputSchema>;

// This is the main function that will be called from the server action.
export async function analyzeSpecDocument(
  input: AnalyzeSpecDocumentInput
): Promise<AnalyzeSpecDocumentOutput> {
  return analyzeDocumentFlow(input);
}

// Define the prompt for the AI model.
const analyzeDocumentPrompt = ai.definePrompt({
  name: 'analyzeDocumentPrompt',
  input: { schema: AnalyzeSpecDocumentInputSchema },
  output: { schema: AnalyzeSpecDocumentOutputSchema },
  prompt: `You are an expert at parsing technical specification documents for wireless communication systems. Your task is to meticulously read the following document text and extract the values for the specified AAAU (Active Antenna Array Unit) and SAR parameters.

- Extract only numeric values.
- If a value for a parameter is not found in the text, do not include it in the output.
- Pay close attention to units (e.g., dBi, GHz, dBm, %, cm) and ensure you are extracting the correct value for each parameter.
- The parameter names in your output must exactly match the keys in the output schema.

Document Text:
---
{{documentText}}
---
`,
});

// Define the Genkit flow.
const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeSpecDocumentInputSchema,
    outputSchema: AnalyzeSpecDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeDocumentPrompt(input);
    return output!;
  }
);
