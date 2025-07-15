import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sqvdhaiywreawsxckmxm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxdmRoYWl5d3JlYXdzeGNrbXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMDc0NjcsImV4cCI6MjA2Njg4MzQ2N30.3FTm2lqdIm62_3O75dD0vCIRKyYHOjmDEbCJC6T2xl8';

// NOTE: It is generally recommended to use environment variables for keys, 
// but for local development as requested, they are hardcoded here.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
