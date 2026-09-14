/**
 * Detects Jest unit tests and automated browsers (Playwright and other WebDriver-based drivers).
 *
 * Used to opt out of module-level caching that outlives individual instances. Such a cache leaks
 * state between test cases that share an input, which makes tests order-dependent and forces every
 * consumer to reset shared internals from their own suites.
 */
export function isTestEnvironment(): boolean {
	try {
		return Boolean(
			(typeof process !== 'undefined' &&
				// NODE_ENV can be overridden by consumers, so also check for a Jest worker
				(process?.env?.NODE_ENV === 'test' || process?.env?.JEST_WORKER_ID !== undefined)) ||
			// Playwright serves examples with NODE_ENV=development, but sets navigator.webdriver
			(typeof navigator !== 'undefined' && navigator.webdriver),
		);
	} catch (e) {
		// Catch possible error that might occur and just return false
		return false;
	}
}
