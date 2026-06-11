import { functionWithFG } from '@atlaskit/platform-feature-flags-react';

import { getClickUrl } from '../../helpers';
import { useSmartCardState } from '../../store';
import { useSmartLinkCrossProductUrlWrapper } from '../use-smart-link-cross-product-url-wrapper';

/**
 * Returns the resolved destination URL for a Smart Link, with cross-product analytics
 * parameters appended when the `platform_smartlink_xpc_url_wrapping` feature gate is enabled.
 *
 * This is the same URL that SmartCard would navigate to when clicked. Use this as an `href`
 * wherever you render a link to a Smart Link URL outside of the SmartCard component itself
 * (e.g. toolbar buttons, overlays).
 *
 * Falls back to the raw `url` when:
 * - The link has not yet resolved
 * - The feature gate is disabled
 * - The link is not a first-party Atlassian link
 *
 * @example
 * const href = useSmartLinkDestinationUrl(url);
 *
 * Use as <a href={href} target="_blank">Open link</a>
 */
const useDestinationUrlImplementation = (url: string): string => {
	const state = useSmartCardState(url);
	const appendCrossProductAnalyticsParams = useSmartLinkCrossProductUrlWrapper({
		details: state.details,
	});

	const resolvedUrl = getClickUrl(url, state.details);

	return appendCrossProductAnalyticsParams(resolvedUrl);
};

export const useDestinationUrl: (url: string) => string = functionWithFG(
	'platform_smartlink_xpc_url_wrapping',
	useDestinationUrlImplementation,
	(url: string): string => url,
);
