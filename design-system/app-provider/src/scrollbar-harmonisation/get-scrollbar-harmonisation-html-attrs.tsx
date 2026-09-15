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
 * @param {boolean} [isEnabled] - An explicit value overrides the shared rollout gate; when
 * omitted, the shared gate controls the appearance.
 *
 * @returns {Object} Object of HTML attributes to be applied to the document root
 */
export function getScrollbarHarmonisationHtmlAttrs(isEnabled?: boolean): Record<string, string> {
	const isGateEnabled = fg('platform_dst_scrollbar_harmonisation');
	const shouldEnable = isEnabled ?? isGateEnabled;

	if (!shouldEnable) {
		return {};
	}

	const result: Record<string, string> = {
		[SCROLLBAR_HARMONISATION_ATTRIBUTE]: '',
	};

	const isTransparentTrackGateEnabled = fg('platform_dst_scrollbar_harmonisation_transparent');
	if (isGateEnabled && isTransparentTrackGateEnabled) {
		result[SCROLLBAR_HARMONISATION_TRANSPARENT_ATTRIBUTE] = '';
	}

	return result;
}

export default getScrollbarHarmonisationHtmlAttrs;
