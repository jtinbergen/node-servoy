module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': ['ts-jest'],
    },
    modulePathIgnorePatterns: ['<rootDir>/build'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: -100,
        },
    },
    collectCoverageFrom: ['**/*.ts', '!**/utils/**', '!**/__test__/**', '!**/services/**'],
    testMatch: ['**/*steps.ts', '**/*test.ts'],
};
