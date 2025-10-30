'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FlaskConical } from 'lucide-react';

const parameterGroups = [
  {
    groupTitle: '1. Array-Level Radiation Parameters',
    parameters: [
      {
        name: 'EIRP (Effective Isotropic Radiated Power)',
        purpose:
          'Measures the total power-gain product in the main beam. Ensures the signal is strong enough to get a good SNR from the target. Formula: EIRP = Pt + Gt (in dB)',
        limit: 'Highly mission-dependent, but must meet the link budget (e.g., 60-80 dBW).',
      },
      {
        name: 'G/T (Gain-to-Noise-Temperature)',
        purpose:
          'The primary figure of merit for the receive chain. A high G/T means the antenna can detect very weak signals. Formula: G/T = Gr - 10log10(Tsys)',
        limit: 'Must be high enough to meet the Noise Equivalent Sigma Zero (NESZ) requirement (e.g., > 30 dB/K).',
      },
      {
        name: 'Beam Pointing Accuracy',
        purpose: 'Verifies that the beam can be steered to the commanded angle (in azimuth and elevation) with minimal error.',
        limit: '< 0.1 x Half-Power Beamwidth (HPBW)',
      },
      {
        name: 'Sidelobe Level (SLL) / Peak Sidelobe Ratio (PSLR)',
        purpose:
          'Measures the strength of the largest sidelobe relative to the main beam. Low sidelobes are critical for SAR to prevent ambiguous signals from bright targets from polluting the image.',
        limit: '< -20 dB (uniform illumination gives -13.2 dB). With tapering (weighting), < -25 dB to -35 dB is a common target.',
      },
      {
        name: 'Integrated Sidelobe Ratio (ISLR)',
        purpose: 'Measures the total energy in all sidelobes compared to the main beam. This is a key driver of image contrast.',
        limit: '< -15 dB is a typical requirement for high-quality imagery.',
      },
    ],
  },
  {
    groupTitle: '2. SAR-Specific Signal Quality Parameters',
    parameters: [
      {
        name: 'Phase & Amplitude Stability',
        purpose:
          'This is the most critical SAR parameter. It measures the drift in phase and amplitude across the array over the synthetic aperture time. Any drift causes image defocusing.',
        limit: '≤ 1° RMS phase error\n≤ 0.1 dB RMS amplitude error',
      },
      {
        name: 'Chirp Bandwidth (B)',
        purpose: 'The bandwidth of the transmitted "chirp" pulse directly sets the range resolution of the SAR. Formula: Range Resolution ρr = c / (2B)',
        limit: 'Must match the design spec (e.g., 100-500 MHz). Also verify in-band ripple/linearity. High ripple (> 0.5 dB) can create "paired echoes" or "time sidelobes" in the image.',
      },
      {
        name: 'Cross-Polarization Isolation',
        purpose: 'For polarimetric SAR (HH, HV, VV, VH). Measures how much "H" signal leaks into the "V" channel and vice-versa. High leakage ruins the polarimetric data.',
        limit: '> 30 dB isolation between co-pol and cross-pol channels.',
      },
      {
        name: 'TRM-to-TRM Calibration',
        purpose: 'Checks that all TRMs are set to the same reference phase and amplitude. This is the baseline for all beamforming.',
        limit: 'Very tight, e.g., ≤ 2° phase and ≤ 0.2 dB amplitude error relative to each other.',
      },
    ],
  },
  {
    groupTitle: '3. TRM (Transmit/Receive Module) Level Parameters',
    parameters: [
      {
        name: 'Output Power (Pout)',
        purpose: 'Power from each individual power amplifier (PA) in the TRM.',
        limit: '5 - 10 W (Typical for X-band GaN TRMs).',
      },
      {
        name: 'Power Added Efficiency (PAE)',
        purpose: 'Measures the efficiency of the PA. This is critical for the satellite/aircraft\'s overall power budget and thermal management. Formula: PAE = (PRF,out - PRF,in) / PDC',
        limit: '> 30 - 40%',
      },
      {
        name: 'Noise Figure (NF)',
        purpose: 'Measures the noise added by the Low Noise Amplifier (LNA) on the receive path. This is a primary driver of G/T.',
        limit: '< 3 dB (e.g., for an X-band system NF of ~4.3 dB).',
      },
      {
        name: 'Phase/Amplitude Control',
        purpose: 'Checks the resolution and accuracy of the phase shifters and attenuators.',
        limit: '6-bit (or higher) resolution for both phase (5.625° step) and amplitude (~0.5 dB step).',
      },
    ],
  },
  {
    groupTitle: '4. Power and Thermal Parameters',
    parameters: [
      {
        name: 'DC Power Consumption',
        purpose: 'Checks the total power draw of the entire array in all modes (standby, Rx-only, Tx) against the platform\'s power budget.',
        limit: 'Must be within specification (e.g., < 2 kW).',
      },
      {
        name: 'Thermal Stability',
        purpose: 'The array is "soaked" at its max and min operational temperatures and run at full power to ensure all TRMs stay within their safe junction temperature (Tj) and that performance (especially phase) remains stable.',
        limit: 'Tj of PAs must stay below max rating (e.g., < 175°C for GaN) with sufficient margin.',
      },
    ],
  },
];

export function CalculationFormulas() {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FlaskConical className="w-6 h-6 text-accent" />
          SAR Pre-Deployment Parameters
        </CardTitle>
        <CardDescription>
          Key parameters and typical limits for AAAU acceptance testing in SAR systems.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {parameterGroups.map((group, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-semibold text-left">{group.groupTitle}</AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/4 font-bold">Parameter</TableHead>
                        <TableHead className="w-1/2 font-bold">Formula / Purpose</TableHead>
                        <TableHead className="w-1/4 font-bold">Typical Limit / Check Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.parameters.map((param, pIndex) => (
                        <TableRow key={pIndex}>
                          <TableCell className="font-medium text-foreground">{param.name}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-pre-wrap">{param.purpose}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-pre-wrap">{param.limit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
