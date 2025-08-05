export function resetMatchMedia() {
	const mediaNoop: MediaQueryList = {
		media: '',
		addListener: () => {
			throw new Error('invariant: unsupported');
		},
		removeListener: () => {
			throw new Error('invariant: unsupported');
		},
		dispatchEvent: () => {
			throw new Error('invariant: unsupported');
		},
		onchange: () => {
			throw new Error('invariant: unsupported');
		},
		addEventListener: () => {},
		removeEventListener: () => {},
		matches: false,
	};

	Object.defineProperty(window, 'matchMedia', {
		value: jest.fn(() => mediaNoop),
		writable: true,
	});
}

type MatchMediaCallback = (this: MediaQueryList, ev: MediaQueryListEventMap['change']) => any;
type UpdateMediaQueryResult = (match: boolean) => void;

/**
 * Mocks the `window.matchMedia` function to simulate a media query match.
 * It returns a function that can be called to update whether the media query matches.
 *
 * __Note: this does not mock CSS `@media` queries.__
 *
 * Example usage:
 * ```tsx
 * // Media query initially matches
 * const matches = setMediaQuery('(min-width: 64rem)', { initial: true });
 *
 * // Change the media query result
 * act(() => matches(false));
 * ```
 */
export function setMediaQuery(
	query: string,
	opts: { initial: boolean } = { initial: true },
): UpdateMediaQueryResult {
	class MediaQueryListEvent extends Event {
		readonly media: string;

		readonly matches: boolean;

		constructor(
			type: 'change',
			options: {
				media?: string;
				matches?: boolean;
			} = {},
		) {
			super(type);
			this.media = options.media || '';
			this.matches = options.matches || false;
		}
	}

	const listeners: MatchMediaCallback[] = [];
	const media: MediaQueryList = {
		media: query,
		addListener: () => {
			throw new Error('invariant: unsupported');
		},
		removeListener: () => {
			throw new Error('invariant: unsupported');
		},
		dispatchEvent: () => {
			throw new Error('invariant: unsupported');
		},
		onchange: () => {
			throw new Error('invariant: unsupported');
		},
		addEventListener: (
			_type: 'change',
			cb: ((this: MediaQueryList, event: MediaQueryListEventMap['change']) => any) &
				EventListenerOrEventListenerObject,
			_options?: boolean | AddEventListenerOptions,
		): void => {
			listeners.push(cb);
		},
		removeEventListener: (
			_type: 'change',
			cb: ((this: MediaQueryList, event: MediaQueryListEventMap['change']) => any) &
				EventListenerOrEventListenerObject,
			_options?: boolean | AddEventListenerOptions,
		) => {
			listeners.splice(listeners.indexOf(cb), 1);
		},
		matches: opts.initial,
	};
	const mediaNoop: MediaQueryList = {
		media: query,
		addListener: () => {
			throw new Error('invariant: unsupported');
		},
		removeListener: () => {
			throw new Error('invariant: unsupported');
		},
		dispatchEvent: () => {
			throw new Error('invariant: unsupported');
		},
		onchange: () => {
			throw new Error('invariant: unsupported');
		},
		addEventListener: () => {
			throw new Error(`match media for "${query}" not set up`);
		},
		removeEventListener: () => {
			throw new Error(`match media for "${query}" not set up`);
		},
		matches: false,
	};

	Object.defineProperty(window, 'matchMedia', {
		value: jest.fn((q) => (query === q ? media : mediaNoop)),
		writable: true,
	});

	return (match: boolean) => {
		Object.defineProperty(media, 'matches', {
			value: match,
			writable: true,
		});

		listeners.forEach((cb) =>
			cb.call(media, new MediaQueryListEvent('change', { matches: media.matches, media: query })),
		);
	};
}

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
