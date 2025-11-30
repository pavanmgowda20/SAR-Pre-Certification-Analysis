'use client';

import React, { useState } from 'react';
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
  Atom,
  UploadCloud,
  FileText,
  X,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from './ui/separator';
import { extractParametersFromFile } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';


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
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleFileExtract = async () => {
    if (!file) return;

    setIsExtracting(true);
    try {
      const fileText = await file.text();
      const result = await extractParametersFromFile(fileText);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Extraction Error',
          description: result.error,
        });
      } else if (result.data) {
        // We need to coerce to number for any of the fields that might be returned
        for (const [key, value] of Object.entries(result.data)) {
          if (value !== undefined && value !== null) {
            form.setValue(key as keyof SarAnalysisInput, Number(value), { shouldValidate: true });
          }
        }
        toast({
          title: 'Extraction Successful',
          description: 'Parameters have been populated in the form below.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: 'Could not read the uploaded file. Please ensure it is a plain text file.',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">AAAU Parameters</CardTitle>
        <CardDescription>Enter parameters manually, or upload a specification document to automatically extract them.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Card className="bg-background/50">
            <CardHeader>
              <CardTitle className="text-lg">Analyze Specification Document</CardTitle>
               <CardDescription>
                Upload a specification file to have the AI attempt to extract parameters. 
                <strong className="text-destructive-foreground/90"> Note: Only plain text (.txt) files can be reliably read. For .doc or .pdf, please copy the text into a .txt file before uploading.</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                    <UploadCloud className="w-5 h-5" />
                    <span>Choose File</span>
                  </label>
                </Button>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".txt,text/plain,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,application/pdf" />
                <Button onClick={handleFileExtract} disabled={!file || isExtracting || isSubmitting}>
                  {isExtracting ? <Loader2 className="animate-spin" /> : <FileSearch />}
                  <span>{isExtracting ? 'Extracting...' : 'Extract Parameters'}</span>
                </Button>
              </div>
              {file && (
                <div className="flex items-center justify-between rounded-md border bg-muted/50 p-2 px-3 text-sm">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{file.name}</span>
                    </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFile(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-sm text-muted-foreground">OR</span>
          </div>

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
                                  <Input type="number" step="any" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''} disabled={isSubmitting} />
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
        </div>
      </CardContent>
    </Card>
  );
}
