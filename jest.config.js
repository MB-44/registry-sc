// jest.config.js

const nextJest = require("next/jest");

// Providing the path to your Next.js app to load next.config.js and .env files
const createJestConfig = nextJest({
  dir: "./",
});

// Any custom config you want to pass to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "node",  // or "jsdom" if you test client components
  // If you want to ignore transformations in certain node_modules, adjust here:
  // transformIgnorePatterns: ["/node_modules/"],
};

module.exports = createJestConfig(customJestConfig);
