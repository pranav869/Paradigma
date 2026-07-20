const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const templatePath = path.join(__dirname, 'assets', 'js', 'supabase-config.template.js');
const outputPath = path.join(__dirname, 'assets', 'js', 'supabase-config.js');

if (!fs.existsSync(envPath)) {
    console.error('Error: .env file not found. Please create one based on .env.example');
    process.exit(1);
}

// Read .env file
const envData = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envData.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envVars[match[1].trim()] = match[2].trim();
    }
});

// Read template
if (!fs.existsSync(templatePath)) {
    console.error(`Error: Template file not found at ${templatePath}`);
    process.exit(1);
}
let templateData = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders
Object.keys(envVars).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    templateData = templateData.replace(regex, envVars[key]);
});

// Write output
fs.writeFileSync(outputPath, templateData, 'utf8');
console.log('Successfully injected environment variables into assets/js/supabase-config.js');
