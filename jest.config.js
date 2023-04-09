/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/**/*.test.ts"],
    verbose: true,
    forceExit: true,
    globalSetup: "./jest-global-setup.ts",
    globalTeardown: "./jest-global-teardown.ts",
    //clearMocks: true
};
