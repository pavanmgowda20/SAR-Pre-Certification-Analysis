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
        name: 'G/T',
        purpose: 'Sensitivity of antenna + receiver.',
        formula: 'G/T = Ga - 10log10(Tsys)',
        limit: '>30dB/K',
      },
      {
        name: 'Beam Pointing Accuracy',
        purpose: 'Accuracy of beam steering.',
        formula: 'Δθ = |θa - θd|',
        limit: '< 0.03°',
      },
      {
        name: 'SLL',
        purpose: 'Level of unwanted sidelobes.',
        formula: 'SLL = 10log10(Psll / Pmain)',
        limit: '-13 to -25 dB',
      },
      {
        name: 'ISLR',
        purpose: 'Total sidelobe energy vs main lobe.',
        formula: 'ISLR = 10log10(ΣPi_sll / Pmain)',
        limit: '-20 dB',
      },
      {
        name: 'Phase Stability',
        purpose: 'Phase stability across pulses.',
        formula: 'Δφ = (2π / λ) × Δt',
        limit: '1-5°',
      },
      {
        name: 'Amplitude Stability',
        purpose: 'Amplitude consistency.',
        formula: 'ΔA = (Amax - Amin) / Aavg × 100%',
        limit: '0.1 dB',
      },
      {
        name: 'Cross-Pol Isolation',
        purpose: 'Separation of H/V polarization.',
        formula: 'CPI = 10log10(Pco / Pcross)',
        limit: '>25dB',
      },
      {
        name: 'TRM Calibration',
        purpose: 'Matching TRM phase & amplitude.',
        formula: 'Phase Err = φset - φactual',
        limit: '<2° & <0.2 dB',
      },
      {
        name: 'PAE',
        purpose: 'PA efficiency.',
        formula: 'PAE = ((Pout - Pin) / P_DC) × 100%',
        limit: '60%',
      },
      {
        name: 'Noise Figure',
        purpose: 'Extra noise added.',
        formula: 'NF = 10log10(SNRin / SNRout)',
        limit: '3 dB',
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
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          {parameterGroups.map((group, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-semibold text-left">{group.groupTitle}</AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/4 font-bold">Parameter</TableHead>
                        <TableHead className="w-1/2 font-bold">{group.groupTitle === 'Core System Parameters' ? 'Purpose' : 'Formula / Purpose'}</TableHead>
                        <TableHead className="w-1/4 font-bold">Typical Limit / Check Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.parameters.map((param, pIndex) => (
                        <TableRow key={pIndex}>
                          <TableCell className="font-medium text-foreground">{param.name}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-pre-wrap">{(param as any).formula ? `${(param as any).purpose}\n\n${(param as any).formula}` : param.purpose}</TableCell>
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
