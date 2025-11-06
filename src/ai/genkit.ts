import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: 'AIzaSyAHbZgJMPOdFqsMzvnm9rnlDi4DstLHxvg', // Hardcoded key
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
