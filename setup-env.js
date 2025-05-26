const fs = require("fs");
const path = require("path");

const environments = ["development", "staging", "production"];

environments.forEach((env) => {
  const envFile = path.join(__dirname, `.env.${env}`);
  const exampleFile = path.join(__dirname, `.env.${env}.example`);

  // Create example file if it doesn't exist
  if (!fs.existsSync(exampleFile)) {
    const exampleContent = `# ${env.toUpperCase()} Environment Configuration
REACT_APP_FIREBASE_API_KEY=your_${env}_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_${env}_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_${env}_project
REACT_APP_FIREBASE_STORAGE_BUCKET=your_${env}_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_${env}_sender_id
REACT_APP_FIREBASE_APP_ID=your_${env}_app_id
`;
    fs.writeFileSync(exampleFile, exampleContent);
    console.log(`Created ${exampleFile}`);
  }

  // Check if env file exists
  if (!fs.existsSync(envFile)) {
    console.log(`\nMissing ${envFile}`);
    console.log(`Please create ${envFile} with your Firebase configuration.`);
    console.log(`You can copy the values from ${exampleFile} as a template.\n`);
  }
});
