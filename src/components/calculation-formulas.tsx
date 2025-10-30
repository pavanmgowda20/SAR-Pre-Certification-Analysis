import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FlaskConical } from 'lucide-react';

const formulas = [
  {
    title: 'Effective Isotropic Radiated Power (EIRP)',
    formula: 'EIRP = P_t + G_t',
    description: 'EIRP (in dBm or dBW) is the sum of the transmitter power (Pt) and the antenna gain (Gt). It represents the total power that would have to be radiated by a hypothetical isotropic antenna to give the same signal strength as the actual source antenna in the direction of its strongest beam.',
  },
  {
    title: 'Power Density (S)',
    formula: 'S = EIRP / (4 * π * R²)',
    description: 'Power density is the amount of power flowing through a unit area. It is calculated from the EIRP and the distance (R) from the antenna. This formula provides the power density in free space, a key factor in exposure assessment.',
  },
  {
    title: 'Specific Absorption Rate (SAR)',
    formula: 'SAR = σ * |E|² / ρ',
    description: 'SAR is a measure of the rate at which energy is absorbed by the human body when exposed to a radio frequency (RF) electromagnetic field. It is defined as the power absorbed per mass of tissue (ρ). (σ is electrical conductivity, E is the electric field).',
  },
];

export function CalculationFormulas() {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FlaskConical className="w-6 h-6 text-accent" />
          Underlying Formulas
        </CardTitle>
        <CardDescription>
          Review the key formulas used in SAR and RF exposure calculations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {formulas.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="font-semibold text-left">{item.title}</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="font-mono text-center p-3 bg-muted rounded-md text-foreground/80 text-sm">
                  {item.formula}
                </p>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
