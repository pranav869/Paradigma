// supabase-config.template.js
// This file is a template. DO NOT put your API keys here.
// Put your API keys in the .env file and run `node inject-env.js` to generate supabase-config.js

const supabaseUrl = '{{SUPABASE_URL}}';
const supabaseKey = '{{SUPABASE_ANON_KEY}}';

// Initialize Supabase client and make it available globally
window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
