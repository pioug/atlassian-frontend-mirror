// Some products set this variable to indicate it is running in SSR
let isServer = Boolean((globalThis as any)?.__SERVER__);

// Other products set this other variable to indicate it is running in SSR
let isReactSSR = typeof process !== 'undefined' && Boolean(process?.env?.REACT_SSR || false);

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function isEnvironmentSupported(): boolean {
	// SSR environment aren't supported
	if (isReactSSR || isServer) {
		return false;
	}

	// Legacy browsers that doesn't support WeakRef
	// aren't valid
	if (typeof globalThis?.WeakRef !== 'function') {
		return false;
	}

	if (
		typeof globalThis?.MutationObserver !== 'function' ||
		typeof globalThis?.IntersectionObserver !== 'function' ||
		typeof globalThis?.PerformanceObserver !== 'function'
	) {
		return false;
	}

	return true;
}
