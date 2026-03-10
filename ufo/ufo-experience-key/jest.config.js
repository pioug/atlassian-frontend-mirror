/** @type {import('jest').Config} */
module.exports = {
	testMatch: [`<rootDir>/**/__unit__/**/*.(mjs|js|tsx|ts)`],
	preset: 'ts-jest',
	testEnvironment: 'node',
};
