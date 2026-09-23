import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({ PORT: z.coerce.number().default(3000), SUPABASE_URL: z.string().url(), SUPABASE_ANON_KEY: z.string().min(1), SUPABASE_SERVICE_ROLE_KEY: z.string().min(1), JWT_SECRET: z.string().min(32), CORS_ORIGIN: z.string().default('*') });
export const env = schema.parse(process.env);