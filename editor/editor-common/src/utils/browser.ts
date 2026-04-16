import memorizeOne from 'memoize-one';
import type { MemoizedFn } from 'memoize-one';

const getFirstMatch = (regexp: RegExp, ua: string) => {
	const match = ua.match(regexp);
	return (match && match.length > 0 && match[1]) || '';
};

const getSecondMatch = (regexp: RegExp, ua: string) => {
	const match = ua.match(regexp);
	return (match && match.length > 0 && match[2]) || '';
};

// Helper functions to safely access browser properties
const getSafeUserAgent = (): string | undefined => {
	if (typeof window === 'undefined') {
		return undefined;
	}

	// Check for SSR user agent first
	if (process.env.REACT_SSR) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const ssrUserAgent = (window as any).__SSR_USER_AGENT__;
		if (ssrUserAgent) {
			return ssrUserAgent;
		}
	}

	// Fallback to navigator.userAgent with proper null checking
	return window.navigator?.userAgent;
};

const getSafePlatform = (): string | undefined => {
	if (typeof window === 'undefined') {
		return undefined;
	}

	return window.navigator?.platform;
};

const hasIntersectionObserver = (): boolean => {
	return (
		typeof window !== 'undefined' &&
		'IntersectionObserver' in window &&
		'IntersectionObserverEntry' in window &&
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		'intersectionRatio' in (window as any).IntersectionObserverEntry.prototype
	);
};

const hasResizeObserver = (): boolean => {
	return (
		typeof window !== 'undefined' && 'ResizeObserver' in window && 'ResizeObserverEntry' in window
	);
};

// New API to get the browser info on demand
export const getBrowserInfo: MemoizedFn<
	() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	}
> = memorizeOne(
	(): {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	} => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: { [key: string]: any } = {
			mac: false,
			windows: false,
			ie: false,
			ie_version: 0,
			gecko: false,
			gecko_version: 0,
			chrome: false,
			chrome_version: 0,
			android: false,
			ios: false,
			webkit: false,
			safari: false,
			safari_version: 0,
			supportsIntersectionObserver: false,
			supportsResizeObserver: false,
		};

		const userAgent = getSafeUserAgent();
		const platform = getSafePlatform();

		if (userAgent) {
			// inspired from https://github.com/bowser-js/bowser/blob/master/src/parser-browsers.js
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			const ieEdge = /\sedg\//i.test(userAgent);
			// eslint-disable-next-line require-unicode-regexp
			const ieEdge2 = /edg([ea]|ios)/i.test(userAgent);
			// eslint-disable-next-line require-unicode-regexp
			const internetExplorer = /msie|trident/i.test(userAgent);

			// Ideally we should use userAgent instead of platform, but we have lots of keymap tests failure when we change it
			// So leave it as is for now.
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			result.mac = platform && /Mac/.test(platform);

			// Previously relied on navigator.userAgentData?.platform and userAgent, now used only userAgent
			result.windows =
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				/Windows|Win\d+/i.test(userAgent);

			// used userAgent rather than relying on documentMode
			const ie = ieEdge || ieEdge2 || internetExplorer;
			result.ie = ie;
			// inspired from https://github.com/bowser-js/bowser/blob/master/src/parser-browsers.js
			result.ie_version = ieEdge
				? // eslint-disable-next-line require-unicode-regexp
				  parseInt(getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, userAgent), 10)
				: // eslint-disable-next-line require-unicode-regexp
				ieEdge2
				? // eslint-disable-next-line require-unicode-regexp
				  parseInt(getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, userAgent), 10)
				: // eslint-disable-next-line require-unicode-regexp
				  parseInt(getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, userAgent), 10);

			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			result.gecko = !ie && /gecko\/\d/i.test(userAgent);
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			result.gecko_version = parseInt((userAgent.match(/Firefox\/(\d+)/) || [])[1], 10);

			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			result.chrome = !ie && /Chrome\//.test(userAgent);
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			result.chrome_version = parseInt((userAgent.match(/Chrome\/(\d+)/) || [])[1], 10);
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			result.android = /Android \d/.test(userAgent);
			result.ios =
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				!ie && /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent);

			// Previously relied on navigator.vendor, now used userAgent
			result.safari =
				!result.chrome &&
				!result.ie &&
				!result.gecko &&
				!result.android &&
				!userAgent.includes('CriOS') &&
				!userAgent.includes('FxiOS') &&
				// eslint-disable-next-line require-unicode-regexp
				/safari|applewebkit/i.test(userAgent);

			result.safari_version = parseInt(
				// eslint-disable-next-line require-unicode-regexp
				(userAgent.match(/Version\/([0-9\._]+).*Safari/) || [])[1],
				10,
			);

			// Previously we relied on documentElement.style.WebkitAppearance, now changed to userAgent
			// eslint-disable-next-line require-unicode-regexp
			result.webkit = /(apple)?webkit/i.test(userAgent);

			result.supportsIntersectionObserver = hasIntersectionObserver();
			result.supportsResizeObserver = hasResizeObserver();
		}
		return result;
	},
);
