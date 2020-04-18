module.exports = {
	preset: 'ts-jest',
	setupFilesAfterEnv: ['<rootDir>/setupTestsAfterEnv.ts'],
	testPathIgnorePatterns: ['/node_modules/'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	reporters: ['default'],
	clearMocks: true,
};
