import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Environment Variables Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? `Loaded (${process.env.OPENAI_API_KEY.substring(0, 15)}...)` : '❌ NOT FOUND');
console.log('\nAll env keys:', Object.keys(process.env).filter(k => !k.startsWith('npm_') && !k.startsWith('_')).sort());
