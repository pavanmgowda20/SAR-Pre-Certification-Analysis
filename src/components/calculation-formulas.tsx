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
    groupTitle: 'Core System Parameters',
    parameters: [
      { name: 'Antenna Gain', purpose: 'Measures how well the antenna converts input power into radio waves headed in a specific direction.\n\nEIRP = P_in + G_ant - L_line', limit: '20-40 dBi' },
      { name: 'Frequency', purpose: 'The operating frequency of the radar system.\n\nλ = c / f', limit: '1-100 GHz' },
      { name: 'Total Input Power', purpose: 'The total electrical power supplied to the transmitter.\n\nP_out = P_in * η', limit: '1-100 dBm' },
      { name: 'Duty Cycle', purpose: 'The fraction of time the radar is transmitting.\n\nDC = (Pulse Width / Pulse Interval) * 100%', limit: '1-50%' },
      { name: 'Distance from body', purpose: 'The separation distance between the antenna and the user\'s body.\n\nPD = P_t * G / (4 * π * r^2)', limit: '1-10 cm' },
    ],
  },
  {
    groupTitle: 'Airborne SAR Parameters',
    parameters: [
      {
        name: 'EIRP',
        purpose: 'Effective power radiated in main beam.\n\nEIRP = Pt * G or EIRP(dBW) = Pt(dBW) + G(dBi)',
        limit: '0-10 dBW (small) / 35-40 dBW (large)',
      },
      {
        name: 'G/T',
        purpose: 'Sensitivity of antenna + receiver.\n\nG/T = G(dBi) - 10 log10(Tsys)',
        limit: '-5 to +5 dB/K',
      },
      {
        name: 'Beam Pointing Accuracy',
        purpose: 'Accuracy of beam steering direction.\n\nError = Bdesired - Bactual',
        limit: '±0.1° to ±0.5°',
      },
      {
        name: 'Sidelobe Level (SLL)',
        purpose: 'Level of unwanted sidelobes.\n\nSLL = 20 log10(SL / ML)',
        limit: '-13 to -25 dB',
      },
      {
        name: 'ISLR',
        purpose: 'Total sidelobe energy vs main lobe.\n\nISLR = 10 log10(Esidelobe / Emain)',
        limit: '-20 to -30 dB',
      },
      {
        name: 'Phase Stability',
        purpose: 'How stable phase stays across pulses.\n\nΔφ = (2π / λ) * Δt',
        limit: '1-5° drift',
      },
      {
        name: 'Amplitude Stability',
        purpose: 'How constant amplitude remains.\n\nΔA = (Amax - Amin) / Aavg * 100%',
        limit: '<1% (~0.1 dB)',
      },
      {
        name: 'Chirp Bandwidth',
        purpose: 'Frequency sweep in one pulse.\n\nB = fmax - fmin',
        limit: '100-500 MHz',
      },
      {
        name: 'Cross-Pol Isolation',
        purpose: 'Ability to separate H/V polarizations.\n\nXPI = 20 log10(Eco / Ecross)',
        limit: '25-35 dB',
      },
      {
        name: 'TRM Calibration',
        purpose: 'Accuracy of TRM phase/amplitude matching.\n\nPhase Error = φset - φactual',
        limit: '<2° phase, <0.2 dB amp',
      },
      {
        name: 'Output Power',
        purpose: 'RF power produced by each TRM.\n\nPout = V²/R or Pt = Pin * GainPA',
        limit: '5-50 W/TRM, 1-3 kW total',
      },
      {
        name: 'PAE',
        purpose: 'Efficiency of DC-to-RF power conversion.\n\nPAE = (Pout - Pin) / PDC * 100%',
        limit: '30-60%',
      },
      {
        name: 'Noise Figure (NF)',
        purpose: 'Extra noise added by receiver.\n\nNF = SNRin / SNRout',
        limit: '1-3 dB',
      },
      {
        name: 'Phase / Amp Control Bits',
        purpose: 'Resolution of TRM tuning accuracy.\n\nPhase step = 360° / 2^n; Amp step = Amax / 2^n',
        limit: '6-7 bits phase (0.5-1°), 0.25-0.5 dB amp',
      },
      {
        name: 'DC Power & Thermal Stability',
        purpose: 'Power usage + phase drift vs temperature.\n\nPDC = V * I; Phase Drift = k * ΔT',
        limit: '200-2000 W, <1-2° drift, <0.1 dB amp drift',
      },
    ],
  }
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
