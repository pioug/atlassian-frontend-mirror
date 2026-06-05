import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

declare global {
	// eslint-disable-next-line no-var
	var __SSR_RENDERED__: boolean | undefined;
	// eslint-disable-next-line no-var
	var __SSR_REACT_STREAMING__: boolean | undefined;

	interface Window {
		__SSR_REACT_STREAMING__?: boolean;
		__SSR_RENDERED__?: boolean;
	}
}

/** Returns true if React SSR streaming is actually active at runtime. */
export function isSSRStreaming(): boolean {
	try {
		const isSSRRendered =
			// In most places there is no document when running on server-side
			// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
			typeof document === 'undefined' ||
			(typeof process !== 'undefined' && process.env?.REACT_SSR) ||
			(typeof window !== 'undefined' && window.__SSR_RENDERED__) ||
			globalThis.__SSR_RENDERED__;

		const isSSRReactStreaming =
			(typeof window !== 'undefined' && window.__SSR_REACT_STREAMING__) ||
			globalThis.__SSR_REACT_STREAMING__;

		return (
			Boolean(isSSRRendered) &&
			expValEquals('platform_editor_editor_ssr_streaming', 'isEnabled', true) &&
			Boolean(isSSRReactStreaming)
		);
	} catch {
		// Catch possible error that might occur and just return false
		return false;
	}
}
