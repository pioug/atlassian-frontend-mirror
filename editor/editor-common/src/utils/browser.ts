// Ignored via go/ees005
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

if (typeof navigator !== 'undefined') {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const ieEdge = /(?:Edge|Edg)\/(\d+)/.exec(navigator.userAgent);
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const ieUpTo10 = /MSIE \d/.test(navigator.userAgent);
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const ie11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);

	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	result.mac = /Mac/.test(navigator.platform);

	result.windows =
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(navigator as any).userAgentData?.platform === 'Windows' ||
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		/Windows|Win\d+/i.test(navigator.userAgent);

	let ie = (result.ie = !!(ieUpTo10 || ie11up || ieEdge));
	result.ie_version = ieUpTo10
		? // Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(document as any).documentMode || 6
		: ie11up
			? +ie11up[1]
			: ieEdge
				? +ieEdge[1]
				: null;
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	result.gecko = !ie && /gecko\/\d/i.test(navigator.userAgent);
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	result.gecko_version = parseInt((navigator.userAgent.match(/Firefox\/(\d+)/) || [])[1], 10);

	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	result.chrome = !ie && /Chrome\//.test(navigator.userAgent);
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	result.chrome_version = parseInt((navigator.userAgent.match(/Chrome\/(\d+)/) || [])[1], 10);
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	result.android = /Android \d/.test(navigator.userAgent);
	result.ios =
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		!ie && /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent);
	result.webkit =
		!ie && !!document.documentElement && 'WebkitAppearance' in document.documentElement.style;

	result.safari = Boolean(
		navigator.vendor &&
			navigator.vendor.indexOf('Apple') > -1 &&
			navigator.userAgent &&
			navigator.userAgent.indexOf('CriOS') === -1 &&
			navigator.userAgent.indexOf('FxiOS') === -1,
	);
	result.safari_version = parseInt(
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		(navigator.userAgent.match(/Version\/([0-9\._]+).*Safari/) || [])[1],
		10,
	);

	result.supportsIntersectionObserver =
		typeof window !== 'undefined' &&
		'IntersectionObserver' in window &&
		'IntersectionObserverEntry' in window &&
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		'intersectionRatio' in (window as any).IntersectionObserverEntry.prototype;

	result.supportsResizeObserver =
		typeof window !== 'undefined' && 'ResizeObserver' in window && 'ResizeObserverEntry' in window;
}

export { result as browser };
