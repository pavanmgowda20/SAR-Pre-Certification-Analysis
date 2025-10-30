import { z } from 'zod';

export const SarAnalysisSchema = z.object({
  antennaGain: z.coerce
    .number({ required_error: 'Antenna gain is required.', invalid_type_error: 'Must be a number' })
    .min(0, 'Must be non-negative')
    .max(60, 'Gain seems unusually high.'),
  frequency: z.coerce
    .number({ required_error: 'Frequency is required.', invalid_type_error: 'Must be a number' })
    .min(0.1, 'Frequency must be at least 0.1 GHz')
    .max(100, 'Frequency seems too high for this tool.'),
  sideLobeLevel: z.coerce
    .number({ required_error: 'Side lobe level is required.', invalid_type_error: 'Must be a number' })
    .min(-100, 'Side lobe level is unusually low.')
    .max(0, 'Side lobe level cannot be positive.'),
  inputPower: z.coerce
    .number({ required_error: 'Input power is required.', invalid_type_error: 'Must be a number' })
    .min(-30, 'Power seems too low.')
    .max(60, 'Power seems unusually high.'),
  dutyCycle: z.coerce
    .number({ required_error: 'Duty cycle is required.', invalid_type_error: 'Must be a number' })
    .min(0, 'Must be between 0 and 100')
    .max(100, 'Must be between 0 and 100.'),
  distance: z.coerce
    .number({ required_error: 'Distance is required.', invalid_type_error: 'Must be a number' })
    .min(0.1, 'Distance must be at least 0.1 cm')
    .max(100, 'Distance should be within 100cm for SAR.'),
});

export type SarAnalysisInput = z.infer<typeof SarAnalysisSchema>;
