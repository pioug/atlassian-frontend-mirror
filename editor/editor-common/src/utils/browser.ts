import memorizeOne from 'memoize-one';
import type { MemoizedFn } from 'memoize-one';

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const IE_EDGE_REGEX = /\sedg\//i;
// eslint-disable-next-line require-unicode-regexp
const IE_EDGE2_REGEX = /edg([ea]|ios)/i;
// eslint-disable-next-line require-unicode-regexp
const INTERNET_EXPLORER_REGEX = /msie|trident/i;
// eslint-disable-next-line require-unicode-regexp
const MAC_REGEX = /Mac/;
// eslint-disable-next-line require-unicode-regexp
const WINDOWS_REGEX = /Windows|Win\d+/i;
// eslint-disable-next-line require-unicode-regexp
const IE_EDGE_VERSION_REGEX = /\sedg\/(\d+(\.?_?\d+)+)/i;
// eslint-disable-next-line require-unicode-regexp
const IE_EDGE2_VERSION_REGEX = /edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i;
// eslint-disable-next-line require-unicode-regexp
const IE_VERSION_REGEX = /(?:msie |rv:)(\d+(\.?_?\d+)+)/i;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const GECKO_REGEX = /gecko\/\d/i;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const FIREFOX_VERSION_REGEX = /Firefox\/(\d+)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const CHROME_REGEX = /Chrome\//;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const CHROME_VERSION_REGEX = /Chrome\/(\d+)/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const ANDROID_REGEX = /Android \d/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const APPLE_WEBKIT_REGEX = /AppleWebKit/;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const MOBILE_REGEX = /Mobile\/\w+/;
// eslint-disable-next-line require-unicode-regexp
const SAFARI_REGEX = /safari|applewebkit/i;
// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const SAFARI_VERSION_REGEX = /Version\/([0-9\._]+).*Safari/;
// eslint-disable-next-line require-unicode-regexp
const WEBKIT_REGEX = /(apple)?webkit/i;

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
			const ieEdge = IE_EDGE_REGEX.test(userAgent);
			const ieEdge2 = IE_EDGE2_REGEX.test(userAgent);
			const internetExplorer = INTERNET_EXPLORER_REGEX.test(userAgent);

			// Ideally we should use userAgent instead of platform, but we have lots of keymap tests failure when we change it
			// So leave it as is for now.
			result.mac = platform && MAC_REGEX.test(platform);

			// Previously relied on navigator.userAgentData?.platform and userAgent, now used only userAgent
			result.windows = WINDOWS_REGEX.test(userAgent);

			// used userAgent rather than relying on documentMode
			const ie = ieEdge || ieEdge2 || internetExplorer;
			result.ie = ie;
			// inspired from https://github.com/bowser-js/bowser/blob/master/src/parser-browsers.js
			result.ie_version = ieEdge
				? parseInt(getFirstMatch(IE_EDGE_VERSION_REGEX, userAgent), 10)
				: ieEdge2
					? parseInt(getSecondMatch(IE_EDGE2_VERSION_REGEX, userAgent), 10)
					: parseInt(getFirstMatch(IE_VERSION_REGEX, userAgent), 10);

			result.gecko = !ie && GECKO_REGEX.test(userAgent);
			result.gecko_version = parseInt((userAgent.match(FIREFOX_VERSION_REGEX) || [])[1], 10);

			result.chrome = !ie && CHROME_REGEX.test(userAgent);
			result.chrome_version = parseInt((userAgent.match(CHROME_VERSION_REGEX) || [])[1], 10);
			result.android = ANDROID_REGEX.test(userAgent);
			result.ios = !ie && APPLE_WEBKIT_REGEX.test(userAgent) && MOBILE_REGEX.test(userAgent);

			// Previously relied on navigator.vendor, now used userAgent
			result.safari =
				!result.chrome &&
				!result.ie &&
				!result.gecko &&
				!result.android &&
				!userAgent.includes('CriOS') &&
				!userAgent.includes('FxiOS') &&
				SAFARI_REGEX.test(userAgent);

			result.safari_version = parseInt(
				(userAgent.match(SAFARI_VERSION_REGEX) || [])[1],
				10,
			);

			// Previously we relied on documentElement.style.WebkitAppearance, now changed to userAgent
			result.webkit = WEBKIT_REGEX.test(userAgent);

			result.supportsIntersectionObserver = hasIntersectionObserver();
			result.supportsResizeObserver = hasResizeObserver();
		}
		return result;
	},
);
