import { getLocationScope, getProductFromSourceAri } from '../clients/block-service/ari';
import { JIRA_DESCRIPTION_FIELD_ID, parseJiraFieldLocation } from '../clients/jira/ari';
import type {
	SyncBlockLocationScope,
	SyncBlockProduct,
	SyncBlockSourceLocation,
} from '../common/types';

/**
 * Field-aware location support is now enabled for all Jira work items.
 */
export const isFieldAwareJiraLocation = (productType: SyncBlockProduct | undefined): boolean =>
	productType === 'jira-work-item';

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
 */
export const getSourceLocation = (
	sourceAri: string | undefined,
): SyncBlockSourceLocation | undefined => {
	if (!sourceAri || !isFieldAwareJiraLocation(getProductFromSourceAri(sourceAri))) {
		return undefined;
	}

	const location = parseJiraFieldLocation({ ari: sourceAri });
	if (!location) {
		return undefined;
	}

	return location.fieldId === JIRA_DESCRIPTION_FIELD_ID ? 'description' : 'custom-field';
};
