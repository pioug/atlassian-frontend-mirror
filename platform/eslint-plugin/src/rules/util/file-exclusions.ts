import type { Rule } from 'eslint';

/**
 * Common patterns for test files that should be excluded from rules
 */
const TEST_FILE_PATTERNS = ['__tests__', 'test', 'spec'] as const;

/**
 * Checks if a file should be excluded from rules based on test file patterns
 * @param filename The filename to check
 * @returns true if the file should be excluded, false otherwise
 */
const isTestFile = (filename: string): boolean => {
	return TEST_FILE_PATTERNS.some((pattern) => filename.includes(pattern));
};

/**
 * Helper function to skip rules for test files
 * @param context The ESLint rule context
 * @returns An empty RuleListener if the file is a test file, undefined otherwise
 */
export const skipForTestFiles = (context: Rule.RuleContext): Rule.RuleListener | undefined => {
	if (isTestFile(context.filename)) {
		return {};
	}
	return undefined;
};

/**
 * Helper function to skip rules for example files
 * @param context The ESLint rule context
 * @returns An empty RuleListener if the file is an example file, undefined otherwise
 */
export const skipForExampleFiles = (context: Rule.RuleContext): Rule.RuleListener | undefined => {
	if (context.filename.includes('example')) {
		return {};
	}
	return undefined;
};
