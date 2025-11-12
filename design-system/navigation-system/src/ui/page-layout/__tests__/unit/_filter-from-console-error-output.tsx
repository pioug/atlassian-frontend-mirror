/**
 * A function that resets the console error mock.
 */
export type ResetConsoleErrorFn = () => void;

/**
 * Mocks console.error to filter out error messages that match the provided regex.
 *
 * @returns A function that resets the console error mock.
 *
 * @example
 * ```tsx
 * let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
 * beforeAll(() => {
 *  resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
 * });
 *
 * afterAll(() => {
 *   resetConsoleErrorSpyFn();
 * });
 * ```
 */
export function filterFromConsoleErrorOutput(searchString: RegExp): ResetConsoleErrorFn {
	const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
		// Filter out messages that match the regex
		if (
			typeof args[0] === 'object' &&
			typeof args[0].message === 'string' &&
			args[0].message.match(searchString)
		) {
			return;
		}

		// Log other messages
		console.warn(...args);
	});

	// Restore the original console.error method
	return function resetSpy() {
		consoleErrorSpy.mockRestore();
	};
}

// Expected error due to jsdom not knowing how to parse the `@starting-style` at-rule.
// See: https://github.com/jsdom/jsdom/issues/3236
export const parseCssErrorRegex = /Could not parse CSS stylesheet/;
