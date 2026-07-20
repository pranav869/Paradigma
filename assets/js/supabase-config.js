// supabase-config.template.js
// This file is a template. DO NOT put your API keys here.
// Put your API keys in the .env file and run `node inject-env.js` to generate supabase-config.js

const supabaseUrl = 'https://qljnaiirubwckruggymu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsam5haWlydWJ3Y2tydWdneW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NjgxNjMsImV4cCI6MjEwMDE0NDE2M30.8uTSxuv3fd2Z-6j7P4rgP8WBCcorMTE0CxFlC-UYLcQ';

// Initialize Supabase client and make it available globally
window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
