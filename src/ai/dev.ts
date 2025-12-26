import { config } from 'dotenv';
config();

import '@/ai/flows/explain-claim-decisions.ts';
import '@/ai/flows/detect-anomalous-bills.ts';
