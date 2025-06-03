import { type JsonLd } from '@atlaskit/json-ld-types';

import type { EntityType } from './entity-types';

/**
 * This interface is part of the new metadata returned for noun entities for Smart Links.
 * It will be included in `meta` when we deprecate jsonLd as part of the response.
 */
export interface ProviderGenerator {
	id?: string;
	name?: string;
	image?: string;
	icon?: {
		url: string;
	};
}

export type SmartLinkResponse = JsonLd.Response & {
	/**
	 * @experimental
	 * Still under development. Use with caution.
	 */
	entityData?: EntityType;
};
