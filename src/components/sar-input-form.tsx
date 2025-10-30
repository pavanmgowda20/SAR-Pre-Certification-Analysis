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
  RadioTower,
  Waves,
  Zap,
  Percent,
  Ruler,
  Bot,
  Loader2,
} from 'lucide-react';

const formFields = [
  {
    name: 'antennaGain',
    label: 'Antenna Gain (dBi)',
    placeholder: 'e.g., 20',
    icon: Antenna,
  },
  {
    name: 'frequency',
    label: 'Frequency (GHz)',
    placeholder: 'e.g., 3.5',
    icon: RadioTower,
  },
  {
    name: 'sideLobeLevel',
    label: 'Side Lobe Level (dB)',
    placeholder: 'e.g., -25',
    icon: Waves,
  },
  {
    name: 'inputPower',
    label: 'Input Power (dBm)',
    placeholder: 'e.g., 43',
    icon: Zap,
  },
  {
    name: 'dutyCycle',
    label: 'Duty Cycle (%)',
    placeholder: 'e.g., 50',
    icon: Percent,
  },
  {
    name: 'distance',
    label: 'Distance (cm)',
    placeholder: 'e.g., 20',
    icon: Ruler,
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
      sideLobeLevel: undefined,
      inputPower: undefined,
      dutyCycle: undefined,
      distance: undefined,
    },
    mode: 'onTouched',
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">AAAU Parameters</CardTitle>
        <CardDescription>Enter the parameters to begin the SAR pre-certification analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAnalysisSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              {formFields.map((fieldInfo) => (
                <FormField
                  key={fieldInfo.name}
                  control={form.control}
                  name={fieldInfo.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-medium">
                        <fieldInfo.icon className="w-4 h-4 text-primary" />
                        {fieldInfo.label}
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
            <Button type="submit" disabled={isSubmitting} className="w-full text-lg py-6" size="lg">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Bot className="mr-2 h-5 w-5" />
              )}
              {isSubmitting ? 'Analyzing...' : 'Run AI Analysis'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
