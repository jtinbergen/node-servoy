module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': ['ts-jest'],
    },
    modulePathIgnorePatterns: ['<rootDir>/dist'],
    testMatch: ['**/*steps.ts', '**/*test.ts'],
};
