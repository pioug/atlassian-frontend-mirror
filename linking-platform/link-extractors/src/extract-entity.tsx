import type { EntityType } from '@atlaskit/linking-types/entity-types';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';

/*
 * ###########################################################################
 * Entity extraction
 * ###########################################################################
 *
 * Extractors for Smart Link entity data and entity-backed provider metadata.
 */
export const extractEntity = (response?: SmartLinkResponse): EntityType | undefined =>
	response?.entityData;
