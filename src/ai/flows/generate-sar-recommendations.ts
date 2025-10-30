'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating SAR performance recommendations based on inputted AAAU parameters.
 *
 * - generateSarRecommendations - A function that orchestrates the SAR recommendation generation process.
 * - GenerateSarRecommendationsInput - The input type for the generateSarRecommendations function.
 * - GenerateSarRecommendationsOutput - The return type for the generateSarRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSarRecommendationsInputSchema = z.object({
  antennaGain: z.number().describe('Antenna gain in dBi'),
  frequency: z.number().describe('Frequency in GHz'),
  sideLobeLevel: z.number().describe('Side lobe level in dB'),
  inputPower: z.number().describe('Input power in dBm'),
  dutyCycle: z.number().describe('Duty cycle as a percentage (e.g., 50 for 50%)'),
  distance: z.number().describe('Distance from antenna in cm'),
});

export type GenerateSarRecommendationsInput = z.infer<
  typeof GenerateSarRecommendationsInputSchema
>;

const RationaleSchema = z.object({
  evidence: z.string().describe('Supporting evidence for the recommendation.'),
});

const RecommendationSchema = z.object({
  recommendation: z.string().describe('Actionable recommendation for system configuration.'),
  rationale: RationaleSchema.describe('Rationale behind the recommendation.'),
});

const GenerateSarRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe('Array of SAR performance improvement recommendations.'),
  analysisOverview: z.string().describe('Overview of the SAR performance analysis.'),
});

export type GenerateSarRecommendationsOutput = z.infer<
  typeof GenerateSarRecommendationsOutputSchema
>;

export async function generateSarRecommendations(
  input: GenerateSarRecommendationsInput
): Promise<GenerateSarRecommendationsOutput> {
  return generateSarRecommendationsFlow(input);
}

const generateSarRecommendationsPrompt = ai.definePrompt({
  name: 'generateSarRecommendationsPrompt',
  input: {schema: GenerateSarRecommendationsInputSchema},
  output: {schema: GenerateSarRecommendationsOutputSchema},
  prompt: `You are an expert SAR performance analyst. Analyze the provided AAAU parameters and provide actionable recommendations for system configuration to improve SAR performance.

Input Parameters:
Antenna Gain: {{antennaGain}} dBi
Frequency: {{frequency}} GHz
Side Lobe Level: {{sideLobeLevel}} dB
Input Power: {{inputPower}} dBm
Duty Cycle: {{dutyCycle}}%
Distance: {{distance}} cm

Provide an analysis overview and a list of recommendations with detailed rationale and supporting evidence. Each recommendation should contain an action and a rationale section.

Ensure the recommendations are practical and directly address potential issues identified during the SAR performance analysis.`,
});

const generateSarRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateSarRecommendationsFlow',
    inputSchema: GenerateSarRecommendationsInputSchema,
    outputSchema: GenerateSarRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await generateSarRecommendationsPrompt(input);
    return output!;
  }
);
