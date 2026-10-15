import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getLocationScope, getProductFromSourceAri } from '../clients/block-service/ari';
import { JIRA_DESCRIPTION_FIELD_ID, parseJiraFieldLocation } from '../clients/jira/ari';
import type {
	SyncBlockLocationScope,
	SyncBlockProduct,
	SyncBlockSourceLocation,
} from '../common/types';

/**
 * The product check runs first so a Confluence-only document never reads the experiment.
 */
export const isFieldAwareJiraLocation = (productType: SyncBlockProduct | undefined): boolean =>
	productType === 'jira-work-item' &&
	isExperimentEnabled('editor_synced_blocks_jira_custom_rich_text');

/**
 * Spreadable `{ locationScope }` for a location that should carry one, `undefined` otherwise.
 * Without a host ARI there is nothing to compare against, so the experiment is not read.
 */
export const getFieldAwareLocationScope = ({
	documentAri,
	hostAri,
	productType,
}: {
	documentAri: string;
	hostAri: string | undefined;
	productType: SyncBlockProduct | undefined;
}): { locationScope: SyncBlockLocationScope } | undefined =>
	hostAri !== undefined && isFieldAwareJiraLocation(productType)
		? { locationScope: getLocationScope({ documentAri, hostAri }) }
		: undefined;

/**
 * Analytics `sourceLocation` for a source ARI: `undefined` for non-Jira sources and for the
 * control cohort, so events outside the experiment keep their current shape.
 *
 * The `platform_editor_blocks_patch_13` gate runs first: with it off this returns `undefined`
 * without the product check or the experiment read, so no new exposure is logged.
 */
export const getSourceLocation = (
	sourceAri: string | undefined,
): SyncBlockSourceLocation | undefined => {
	if (!fg('platform_editor_blocks_patch_13')) {
		return undefined;
	}

	if (!sourceAri || !isFieldAwareJiraLocation(getProductFromSourceAri(sourceAri))) {
		return undefined;
	}

	const location = parseJiraFieldLocation({ ari: sourceAri });
	if (!location) {
		return undefined;
	}

	return location.fieldId === JIRA_DESCRIPTION_FIELD_ID ? 'description' : 'custom-field';
};
