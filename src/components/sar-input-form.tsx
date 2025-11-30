'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SarAnalysisSchema, type SarAnalysisInput } from '@/lib/schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Antenna,
  FileSearch,
  Loader2,
  Waves,
  Zap,
  Percent,
  Ruler,
  Thermometer,
  Gauge,
  Target,
  Ratio,
  Signal,
  Sigma,
  Power,
  Atom,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const formGroups = [
    {
        title: 'Core System Parameters',
        icon: Antenna,
        fields: [
             { name: 'antennaGain', label: 'Antenna Gain (dBi)', icon: Antenna, required: true },
             { name: 'frequency', label: 'Frequency (GHz)', icon: Waves, required: true },
             { name: 'inputPower', label: 'Total Input Power (dBm)', icon: Zap, required: true },
             { name: 'dutyCycle', label: 'Duty Cycle (%)', icon: Percent, required: true },
             { name: 'distance', label: 'Distance from body (cm)', icon: Ruler, required: true },
        ]
    },
    {
        title: 'Airborne SAR Parameters',
        icon: Signal,
        fields: [
            { name: 'gt', label: 'G/T (dB/K)', icon: Thermometer },
            { name: 'beamPointingAccuracy', label: 'Beam Pointing Accuracy (deg)', icon: Target },
            { name: 'sidelobeLevel', label: 'Sidelobe Level (SLL) (dB)', icon: Waves, required: true },
            { name: 'islr', label: 'ISLR (dB)', icon: Ratio },
            { name: 'phaseStability', label: 'Phase Stability (deg)', icon: Gauge },
            { name: 'amplitudeStability', label: 'Amplitude Stability (dB)', icon: Gauge },
            { name: 'crossPolIsolation', label: 'Cross-Pol Isolation (dB)', icon: Atom },
            { name: 'pae', label: 'Power Added Efficiency (PAE) (%)', icon: Percent },
            { name: 'noiseFigure', label: 'Noise Figure (dB)', icon: Signal },
        ]
    },
] as const;


interface SarInputFormProps {
  onAnalysisSubmit: (data: SarAnalysisInput) => Promise<void>;
  isSubmitting: boolean;
}

export function SarInputForm({ onAnalysisSubmit, isSubmitting }: SarInputFormProps) {
  const form = useForm<SarAnalysisInput>({
    resolver: zodResolver(SarAnalysisSchema),
    defaultValues: {
      antennaGain: undefined,
      frequency: undefined,
      sidelobeLevel: undefined,
      inputPower: undefined,
      dutyCycle: undefined,
      distance: undefined,
      gt: undefined,
      beamPointingAccuracy: undefined,
      islr: undefined,
      phaseStability: undefined,
      amplitudeStability: undefined,
      crossPolIsolation: undefined,
      pae: undefined,
      noiseFigure: undefined,
    },
    mode: 'onTouched',
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">AAAU Parameters</CardTitle>
        <CardDescription>Enter the parameters to begin the SAR pre-certification analysis. Fields with * are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAnalysisSubmit)} className="space-y-6">
            <Accordion type="multiple" defaultValue={['item-0', 'item-1']} className="w-full">
              {formGroups.map((group, groupIndex) => (
                <AccordionItem value={`item-${groupIndex}`} key={group.title}>
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                        <group.icon className="w-5 h-5 text-primary" />
                        {group.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                      {group.fields.map((fieldInfo) => (
                        <FormField
                          key={fieldInfo.name}
                          control={form.control}
                          name={fieldInfo.name}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 font-medium">
                                <fieldInfo.icon className="w-4 h-4 text-primary" />
                                {fieldInfo.label} {fieldInfo.required && <span className="text-destructive">*</span>}
                              </FormLabel>
                              <FormControl>
                                <Input type="number" step="any" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Button type="submit" disabled={isSubmitting} className="w-full text-lg py-6 mt-8" size="lg">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <FileSearch className="mr-2 h-5 w-5" />
              )}
              {isSubmitting ? 'Analyzing...' : 'Run Analysis'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
