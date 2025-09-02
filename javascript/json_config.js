/*
$cat env.config.json
{
  "dev": {
    "SITE": "https://dev.example.com",
    "USERNAME": "devuser",
    "PASSWORD": "devpass"
  },
  "prod": {
    "SITE": "https://example.com",
    "USERNAME": "produser",
    "PASSWORD": "prodpass"
  }
}
*/

import fs from "fs";

// pick environment from NODE_ENV or default to development
const env = "dev";

// read JSON file
const config = JSON.parse(fs.readFileSync("env.config.json", "utf8"));

// apply chosen env values into process.env
if (config[env]) {
    Object.entries(config[env]).forEach(([key, value]) => {
        process.env[key] = value;
    }
);
} else {
    throw new Error(`Unknown environment: ${env}`);
}

// now you can use process.env like normal
console.log("SITE:", process.env.SITE);
console.log("USERNAME:", process.env.USERNAME);
