'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-sar-recommendations.ts';
import '@/ai/flows/analyze-spec-document.ts';
