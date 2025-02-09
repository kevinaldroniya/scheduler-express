module.exports = {
    testEnvironment: 'node', // Use Node.js environment
    setupFilesAfterEnv: ['./src/test/setup.js'], // Setup file for tests
    coveragePathIgnorePatterns: ['/node/modules', '/src/test/'] // Ignore these paths in coverage reports
}