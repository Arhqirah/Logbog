import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://blvkdehbqkipcfraenwo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdmtkZWhicWtpcGNmcmFlbndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNDQwMzcsImV4cCI6MjAzOTgyMDAzN30.HTst7EtUb6pKxq5aYc1SkSP13UJoS_6sCpRKbVTHkso';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
