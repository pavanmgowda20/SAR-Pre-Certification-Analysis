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
  Bot,
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
             { name: 'antennaGain', label: 'Antenna Gain (dBi)', placeholder: 'e.g., 35', icon: Antenna, required: true },
             { name: 'frequency', label: 'Frequency (GHz)', placeholder: 'e.g., 9.6', icon: Waves, required: true },
             { name: 'inputPower', label: 'Total Input Power (dBm)', placeholder: 'e.g., 43', icon: Zap, required: true },
             { name: 'dutyCycle', label: 'Duty Cycle (%)', placeholder: 'e.g., 20', icon: Percent, required: true },
             { name: 'distance', label: 'Distance from body (cm)', placeholder: 'e.g., 5', icon: Ruler, required: true },
        ]
    },
    {
        title: 'Array-Level Radiation Parameters',
        icon: Signal,
        fields: [
            { name: 'eirp', label: 'EIRP (dBW)', placeholder: 'e.g., 65', icon: Zap },
            { name: 'gt', label: 'G/T (dB/K)', placeholder: 'e.g., 32', icon: Thermometer },
            { name: 'beamPointingAccuracy', label: 'Beam Pointing Accuracy (deg)', placeholder: 'e.g., 0.02', icon: Target },
            { name: 'sidelobeLevel', label: 'Sidelobe Level (dB)', placeholder: 'e.g., -30', icon: Waves, required: true },
            { name: 'islr', label: 'ISLR (dB)', placeholder: 'e.g., -20', icon: Ratio },
        ]
    },
    {
        title: 'SAR-Specific Signal Quality Parameters',
        icon: Sigma,
        fields: [
            { name: 'phaseStability', label: 'Phase Stability (deg RMS)', placeholder: 'e.g., 0.8', icon: Gauge },
            { name: 'amplitudeStability', label: 'Amplitude Stability (dB RMS)', placeholder: 'e.g., 0.1', icon: Gauge },
            { name: 'chirpBandwidth', label: 'Chirp Bandwidth (MHz)', placeholder: 'e.g., 300', icon: Waves },
            { name: 'crossPolIsolation', label: 'Cross-Polarization Isolation (dB)', placeholder: 'e.g., 35', icon: Atom },
        ]
    },
    {
        title: 'TRM Level Parameters',
        icon: Power,
        fields: [
            { name: 'trmOutputPower', label: 'TRM Output Power (W)', placeholder: 'e.g., 8', icon: Zap },
            { name: 'pae', label: 'Power Added Efficiency (%)', placeholder: 'e.g., 35', icon: Percent },
            { name: 'noiseFigure', label: 'Noise Figure (dB)', placeholder: 'e.g., 2.5', icon: Signal },
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
      eirp: undefined,
      gt: undefined,
      beamPointingAccuracy: undefined,
      islr: undefined,
      phaseStability: undefined,
      amplitudeStability: undefined,
      chirpBandwidth: undefined,
      crossPolIsolation: undefined,
      trmOutputPower: undefined,
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
                                <Input type="number" step="any" placeholder={fieldInfo.placeholder} {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} />
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
                <Bot className="mr-2 h-5 w-5" />
              )}
              {isSubmitting ? 'Analyzing...' : 'Run Analysis'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
