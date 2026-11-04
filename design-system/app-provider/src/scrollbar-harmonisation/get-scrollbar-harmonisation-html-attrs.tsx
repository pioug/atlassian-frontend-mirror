import { fg } from '@atlaskit/platform-feature-flags/fg';

import { SCROLLBAR_HARMONISATION_ATTRIBUTE } from './constants';

/**
 * Server-side rendering utility. Generates the harmonised scrollbar HTML attributes so a
 * product's server can spread them onto the server-rendered `<html>` element. This avoids the
 * flash of un-harmonised scrollbars that would otherwise occur while waiting for
 * `useScrollbarHarmonisation`'s client-only effect to run.
 *
 * @param input - A boolean overrides the appearance; an object supplies the product-resolved
 * `isEnabled` value without evaluating the shared gate. When omitted, the shared gate is used.
 *
 * @returns {Object} Object of HTML attributes to be applied to the document root
 */
export function getScrollbarHarmonisationHtmlAttrs(
	input?:
		| boolean
		| {
				isEnabled: boolean;
				/**
				 * Unused. Tracks are always transparent.
				 */
				isTransparentEnabled?: boolean;
		  },
): Record<string, string> {
	const resolvedGates = typeof input === 'object' && input !== null ? input : undefined;
	const isGateEnabled = resolvedGates
		? resolvedGates.isEnabled
		: fg('platform_dst_scrollbar_harmonisation');
	const shouldEnable = typeof input === 'boolean' ? input : isGateEnabled;

	if (!shouldEnable) {
		return {};
	}

	return {
		[SCROLLBAR_HARMONISATION_ATTRIBUTE]: '',
	};
}

export default getScrollbarHarmonisationHtmlAttrs;
