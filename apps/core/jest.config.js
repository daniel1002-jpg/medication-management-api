export default {
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/app.ts",
    "!**/node_modules/**",
    "!src/domain/repositories/*.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  preset: "ts-jest",
  roots: ["<rootDir>/tests"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {},
};
