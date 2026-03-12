import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Substituir com as credenciais reais do Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'YOUR_SUPABASE_PUBLISHABLE_KEY';

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key loaded:", !!supabaseKey && supabaseKey !== 'YOUR_SUPABASE_PUBLISHABLE_KEY');

export const supabase = createClient(supabaseUrl, supabaseKey);
