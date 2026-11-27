import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { LinkProviderRemixPlugin } from '@atlaskit/link-provider/types';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';
import { fg } from '@atlaskit/platform-feature-flags/fg';

type IsRemixActionEnabledOptions = {
	extensionKey?: string;
	/** The `remix` link provider plugin, from `usePlugins`.  */
	remix?: LinkProviderRemixPlugin;
	response?: JsonLd.Response;
};

/**
 * Check rollout without exposure: the action may never be rendered, e.g. in a hover preview.
 * Remove this function on experiment cleanup; the business rules stay.
 */
const isRemixExperimentEnabled = (): boolean =>
	fg('platform_sl_3p_auth_visualize_killswitch') &&
	UNSAFE_expValNoExposure('platform_sl_3p_auth_visualize_exp', 'isEnabled', false);

/**
 * `@type` is a string or string array per JSON-LD, but it comes from the network, so guard
 * against any other shape rather than calling `.includes` on it directly.
 */
const isGoogleSheetsType = (response?: JsonLd.Response): boolean => {
	const type: unknown = response?.data?.['@type'];
	const types = Array.isArray(type) ? type : [type];
	return types.includes('schema:SpreadsheetDigitalDocument');
};

// Capability callbacks are implemented outside smart-card. Treat a failure as
// unavailable instead of failing card extraction/rendering.
const isRemixAvailable = (remix?: LinkProviderRemixPlugin): boolean => {
	try {
		return Boolean(remix?.isAvailable());
	} catch {
		return false;
	}
};

/**
 * Whether the Remix action is offered for a resolved link.
 *
 * This check does not record exposure. The rendered Remix control owns exposure.
 */
export const isRemixActionEnabled = ({
	extensionKey,
	remix,
	response,
}: IsRemixActionEnabledOptions): boolean =>
	extensionKey === 'google-object-provider' &&
	isGoogleSheetsType(response) &&
	isRemixAvailable(remix) &&
	isRemixExperimentEnabled();
