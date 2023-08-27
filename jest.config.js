/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    //testMatch: ["**/**/*.test.ts"],
    testMatch: ["**/__tests__/unit/**/*.test.ts"],
    verbose: true,
    forceExit: true,
    globalSetup: "./jest-global-setup.ts",
    globalTeardown: "./jest-global-teardown.ts",
    //clearMocks: true
    coveragePathIgnorePatterns: ["/node_modules/"],
    testPathIgnorePatterns: ["/node_modules/"],
    collectCoverage: true,
};
