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
  // Array-Level Radiation Parameters
  eirp: z.number().optional().describe('EIRP in dBW'),
  gt: z.number().optional().describe('G/T in dB/K'),
  beamPointingAccuracy: z.number().optional().describe('Beam Pointing Accuracy in degrees'),
  sidelobeLevel: z.number().describe('Side lobe level in dB'),
  islr: z.number().optional().describe('Integrated Sidelobe Ratio in dB'),
  
  // SAR-Specific Signal Quality Parameters
  phaseStability: z.number().optional().describe('Phase Stability in degrees RMS'),
  amplitudeStability: z.number().optional().describe('Amplitude Stability in dB RMS'),
  chirpBandwidth: z.number().optional().describe('Chirp Bandwidth in MHz'),
  crossPolIsolation: z.number().optional().describe('Cross-Polarization Isolation in dB'),
  
  // TRM (Transmit/Receive Module) Level Parameters
  trmOutputPower: z.number().optional().describe('TRM Output Power in Watts'),
  pae: z.number().optional().describe('Power Added Efficiency as a percentage'),
  noiseFigure: z.number().optional().describe('Noise Figure in dB'),

  // Power and Thermal Parameters
  dcPowerConsumption: z.number().optional().describe('DC Power Consumption in kW'),

  // Core System Parameters
  antennaGain: z.number().describe('Antenna gain in dBi'),
  frequency: z.number().describe('Frequency in GHz'),
  inputPower: z.number().describe('Total Input Power in dBm'),
  dutyCycle: z.number().describe('Duty cycle as a percentage'),
  distance: z.number().describe('Distance from body in cm'),
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

const CalculationSchema = z.object({
    parameter: z.string().describe('The name of the calculated parameter (e.g., "Power Density at Distance").'),
    value: z.string().describe('The calculated value, including units (e.g., "5.3 W/m^2").'),
    formula: z.string().describe('The simplified formula used for the calculation (e.g., "EIRP / (4 * PI * r^2)").'),
});

const GenerateSarRecommendationsOutputSchema = z.object({
  calculations: z.array(CalculationSchema).describe('Array of key calculated values based on user inputs.'),
  analysisOverview: z.string().describe('High-level overview of the SAR performance analysis, including a pass/fail assessment.'),
  recommendations: z.array(RecommendationSchema).describe('Array of SAR performance improvement recommendations.'),
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
  prompt: `You are an expert SAR (Specific Absorption Rate) compliance analyst for wireless devices. Your task is to analyze a comprehensive set of AAAU (Active Antenna Array Unit) parameters for a Synthetic Aperture Radar system and provide a pre-certification assessment.

Your analysis must have three parts:
1.  **Calculations**: Based on the provided inputs, calculate key derived metrics. At a minimum, calculate the Power Density at the specified distance. You may calculate other relevant metrics if possible. For each calculation, provide the parameter name, the resulting value with units, and a simplified version of the formula used.
2.  **Analysis Overview**: Provide a high-level summary of your findings. Start with a clear "PASS" or "FAIL" assessment based on whether the calculated power density likely exceeds typical regulatory limits (e.g., 1.6 W/kg averaged over 1g of tissue, often correlated with power densities around 5-10 W/m^2, but use your expert judgment). Then, briefly explain the main factors contributing to this assessment.
3.  **Recommendations**: Provide a list of actionable recommendations to improve SAR performance or ensure compliance. For each recommendation, provide a clear rationale based on the input data.

Analyze the following input parameters:

**Core System Parameters:**
Antenna Gain: {{antennaGain}} dBi
Frequency: {{frequency}} GHz
Total Input Power: {{inputPower}} dBm
Duty Cycle: {{dutyCycle}}%
Distance from body: {{distance}} cm

**Array-Level Radiation Parameters:**
{{#if eirp}}EIRP: {{eirp}} dBW{{/if}}
{{#if gt}}G/T: {{gt}} dB/K{{/if}}
{{#if beamPointingAccuracy}}Beam Pointing Accuracy: {{beamPointingAccuracy}} deg{{/if}}
Sidelobe Level: {{sidelobeLevel}} dB
{{#if islr}}ISLR: {{islr}} dB{{/if}}

**SAR-Specific Signal Quality Parameters:**
{{#if phaseStability}}Phase Stability: {{phaseStability}} deg RMS{{/if}}
{{#if amplitudeStability}}Amplitude Stability: {{amplitudeStability}} dB RMS{{/if}}
{{#if chirpBandwidth}}Chirp Bandwidth: {{chirpBandwidth}} MHz{{/if}}
{{#if crossPolIsolation}}Cross-Pol Isolation: {{crossPolIsolation}} dB{{/if}}

**TRM Level Parameters:**
{{#if trmOutputPower}}TRM Output Power: {{trmOutputPower}} W{{/if}}
{{#if pae}}Power Added Efficiency: {{pae}}%{{/if}}
{{#if noiseFigure}}Noise Figure: {{noiseFigure}} dB{{/if}}

**Power and Thermal Parameters:**
{{#if dcPowerConsumption}}DC Power Consumption: {{dcPowerConsumption}} kW{{/if}}

Your response must be structured strictly according to the output schema.`,
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
