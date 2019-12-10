module.exports = {
	preset: 'ts-jest',
	setupFiles: [
		'<rootDir>/setupTests.ts'
	],
	testPathIgnorePatterns: ['/node_modules/'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	reporters: [
		'default'
	],
	clearMocks: true
};