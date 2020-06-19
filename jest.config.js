module.exports = {
	preset: 'ts-jest',
	setupFilesAfterEnv: ['<rootDir>/setupTestsAfterEnv.ts'],
	testPathIgnorePatterns: ['/node_modules/'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/index.tsx',
		'!**/*.test.{ts,tsx}',
		'!**/*.d.ts',
		'!**/types/**',
		'!**/node_modules/**'
	],
	coverageReporters: ['json'],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80
		}
	},
	reporters: ['default'],
	clearMocks: true
};
