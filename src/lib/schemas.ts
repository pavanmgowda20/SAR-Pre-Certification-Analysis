import { z } from 'zod';

export const SarAnalysisSchema = z.object({
  // Array-Level Radiation Parameters
  eirp: z.coerce.number().optional(),
  gt: z.coerce.number().optional(),
  beamPointingAccuracy: z.coerce.number().optional(),
  sidelobeLevel: z.coerce.number({ required_error: 'Side lobe level is required.', invalid_type_error: 'Must be a number' }),
  islr: z.coerce.number().optional(),
  
  // SAR-Specific Signal Quality Parameters
  phaseStability: z.coerce.number().optional(),
  amplitudeStability: z.coerce.number().optional(),
  chirpBandwidth: z.coerce.number().optional(),
  crossPolIsolation: z.coerce.number().optional(),
  
  // TRM (Transmit/Receive Module) Level Parameters
  trmOutputPower: z.coerce.number().optional(),
  pae: z.coerce.number().optional(),
  noiseFigure: z.coerce.number().optional(),

  // Power and Thermal Parameters
  dcPowerConsumption: z.coerce.number().optional(),

  // Core System Parameters
  antennaGain: z.coerce.number({ required_error: 'Antenna gain is required.', invalid_type_error: 'Must be a number' }),
  frequency: z.coerce.number({ required_error: 'Frequency is required.', invalid_type_error: 'Must be a number' }),
  inputPower: z.coerce.number({ required_error: 'Input power is required.', invalid_type_error: 'Must be a number' }),
  dutyCycle: z.coerce.number({ required_error: 'Duty cycle is required.', invalid_type_error: 'Must be a number' }),
  distance: z.coerce.number({ required_error: 'Distance is required.', invalid_type_error: 'Must be a number' }),
});

export type SarAnalysisInput = z.infer<typeof SarAnalysisSchema>;
