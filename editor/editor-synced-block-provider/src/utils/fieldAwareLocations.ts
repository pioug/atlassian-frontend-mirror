import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { getLocationScope } from '../clients/block-service/ari';
import type { SyncBlockLocationScope, SyncBlockProduct } from '../common/types';

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
