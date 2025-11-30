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
  Upload,
  FileText,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from './ui/separator';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { extractParametersFromFile } from '@/app/actions';

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
  
  const [isExtracting, setIsExtracting] = React.useState(false);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsExtracting(true);

    try {
      const text = await file.text();
      const result = await extractParametersFromFile(text);

      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Extraction Failed',
          description: result.error,
        });
      } else {
        // Reset form to clear previous values before setting new ones
        form.reset();
        for (const [key, value] of Object.entries(result)) {
            if (value !== undefined && value !== null) {
                form.setValue(key as keyof SarAnalysisInput, Number(value), { shouldValidate: true });
            }
        }
        toast({
          title: 'Extraction Successful',
          description: 'Parameters from your document have been filled into the form.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Reading File',
        description: 'Could not read the uploaded document. Please ensure it is a valid text-based file.',
      });
    } finally {
      setIsExtracting(false);
      // Reset file input to allow re-uploading the same file
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">AAAU Parameters</CardTitle>
        <CardDescription>Enter parameters manually or upload a spec sheet to auto-fill the form.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Analyze Specification Document
            </h3>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              id="spec-file-upload"
              accept=".txt,.csv,.md,.json"
              disabled={isExtracting || isSubmitting}
            />
            <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="outline" 
                className="w-full"
                disabled={isExtracting || isSubmitting}
            >
                {isExtracting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <FileText className="mr-2 h-5 w-5" />
                )}
                {isExtracting ? 'Analyzing Document...' : (fileName ? `Change File (${fileName})` : 'Upload Spec Sheet (.txt, .csv, .md)')}
            </Button>
             <p className="text-sm text-muted-foreground text-center">
                After uploading, review the extracted values below before running the final analysis.
            </p>
        </div>

        <Separator className="my-6" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAnalysisSubmit)} className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FileSearch className="w-5 h-5 text-primary" />
                Manual Parameter Entry
            </h3>
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
                                <Input type="number" step="any" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} disabled={isExtracting || isSubmitting} />
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

            <Button type="submit" disabled={isSubmitting || isExtracting} className="w-full text-lg py-6 mt-8" size="lg">
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
