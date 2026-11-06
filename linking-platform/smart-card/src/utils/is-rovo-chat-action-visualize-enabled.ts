import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { ProductType } from '@atlaskit/linking-common/types';
import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';
import { fg } from '@atlaskit/platform-feature-flags/fg';

type IsRovoChatActionVisualizeEnabledOptions = {
	extensionKey?: string;
	product?: ProductType;
	response?: JsonLd.Response;
};

/**
 * Rollout state only (kill switch, then experiment). Evaluating the experiment
 * fires exposure, so this must run after every business rule has passed.
 * Remove this function on experiment cleanup; the business rules stay.
 */
const isVisualizeExperimentEnabled = (): boolean =>
	fg('platform_sl_3p_auth_visualize_killswitch') &&
	expVal('platform_sl_3p_auth_visualize_exp', 'isEnabled', false);

/**
 * `@type` is a string or string array per JSON-LD, but it comes from the network, so guard
 * against any other shape rather than calling `.includes` on it directly.
 */
const isGoogleSheetsType = (response?: JsonLd.Response): boolean => {
	const type: unknown = response?.data?.['@type'];
	const types = Array.isArray(type) ? type : [type];
	return types.includes('schema:SpreadsheetDigitalDocument');
};

/**
 * Whether the Rovo chat "Visualize" action is offered for a resolved link.
 *
 * Business rules: Google Sheets links in Confluence.
 *
 * Callers must only call this once the Rovo chat action will be shown for the
 * link (resolved, Rovo chat enabled, opted in and not hidden), so experiment
 * exposure matches what the user sees.
 */
export const isRovoChatActionVisualizeEnabled = ({
	extensionKey,
	product,
	response,
}: IsRovoChatActionVisualizeEnabledOptions): boolean =>
	product === 'CONFLUENCE' &&
	extensionKey === 'google-object-provider' &&
	isGoogleSheetsType(response) &&
	isVisualizeExperimentEnabled();
