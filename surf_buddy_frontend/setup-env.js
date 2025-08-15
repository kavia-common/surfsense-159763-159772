#!/usr/bin/env node

/**
 * Environment Setup Script for SurfBuddy
 * This script helps users set up their environment variables
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🏄‍♂️ SurfBuddy Environment Setup');
console.log('=====================================');
console.log('This script will help you set up your API keys and environment variables.\n');

const envTemplate = `# SurfBuddy Environment Variables
# Copy this file to .env and fill in your API keys

# Google Maps JavaScript API Key
# Get your key at: https://developers.google.com/maps/documentation/javascript/get-api-key
REACT_APP_GOOGLE_MAPS_API_KEY=

# Stormglass Marine Weather API Key  
# Get your key at: https://stormglass.io/
REACT_APP_STORMGLASS_API_KEY=

# Firebase Configuration
# Get your config at: https://console.firebase.google.com/
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=

# Site URL for Firebase redirects
REACT_APP_SITE_URL=http://localhost:3000
`;

function createEnvFile() {
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Skipping creation.');
    return;
  }
  
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env file');
  console.log('📝 Please edit the .env file and add your API keys.');
}

function showInstructions() {
  console.log('\n📋 Setup Instructions:');
  console.log('======================');
  console.log('1. Google Maps API:');
  console.log('   - Go to https://console.cloud.google.com/');
  console.log('   - Enable Maps JavaScript API');
  console.log('   - Create API key and restrict it to your domain');
  console.log('');
  console.log('2. Stormglass API:');
  console.log('   - Sign up at https://stormglass.io/');
  console.log('   - Get your free API key (1000 requests/month)');
  console.log('');
  console.log('3. Firebase:');
  console.log('   - Create project at https://console.firebase.google.com/');
  console.log('   - Enable Storage in your Firebase console');
  console.log('   - Copy config from Project Settings > General');
  console.log('');
  console.log('4. Edit your .env file with the API keys');
  console.log('5. Run: npm start');
  console.log('');
  console.log('🎉 Your SurfBuddy app will be ready to use!');
}

async function main() {
  try {
    createEnvFile();
    showInstructions();
    
    rl.question('\nWould you like to open the setup instructions in your browser? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        const { exec } = require('child_process');
        exec('open https://github.com/your-repo/surfbuddy#setup-instructions || xdg-open https://github.com/your-repo/surfbuddy#setup-instructions || start https://github.com/your-repo/surfbuddy#setup-instructions');
      }
      
      console.log('\n🏄‍♂️ Happy surfing!');
      rl.close();
    });
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    rl.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = { createEnvFile, showInstructions };
