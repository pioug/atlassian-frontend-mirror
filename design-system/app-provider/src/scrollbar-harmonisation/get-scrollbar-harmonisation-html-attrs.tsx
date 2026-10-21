import { fg } from '@atlaskit/platform-feature-flags/fg';

import {
	SCROLLBAR_HARMONISATION_ATTRIBUTE,
	SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE,
} from './constants';

/**
 * Server-side rendering utility. Generates the harmonised scrollbar HTML attributes so a
 * product's server can spread them onto the server-rendered `<html>` element. This avoids the
 * flash of un-harmonised scrollbars that would otherwise occur while waiting for
 * `useScrollbarHarmonisation`'s client-only effect to run.
 *
 * @param input - A boolean overrides the base appearance, while transparency still requires
 * both shared gates. When omitted, the shared gates control the appearance. An object supplies
 * both product-resolved gate results without evaluating shared gates; transparency requires
 * `isEnabled` and `isTransparentEnabled` to both be true.
 *
 * @returns {Object} Object of HTML attributes to be applied to the document root
 */
export function getScrollbarHarmonisationHtmlAttrs(
	input?: boolean | { isEnabled: boolean; isTransparentEnabled: boolean },
): Record<string, string> {
	const resolvedGates = typeof input === 'object' && input !== null ? input : undefined;
	const isGateEnabled = resolvedGates
		? resolvedGates.isEnabled
		: fg('platform_dst_scrollbar_harmonisation');
	const shouldEnable = typeof input === 'boolean' ? input : isGateEnabled;

	if (!shouldEnable) {
		return {};
	}

	const result: Record<string, string> = {
		[SCROLLBAR_HARMONISATION_ATTRIBUTE]: '',
	};

	const isTransparentTrackGateEnabled = resolvedGates
		? resolvedGates.isTransparentEnabled
		: fg('platform_dst_scrollbar_harmonisation_transparent');
	if (isGateEnabled && isTransparentTrackGateEnabled) {
		result[SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE] = '';
	}

	return result;
}

export default getScrollbarHarmonisationHtmlAttrs;
