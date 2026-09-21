import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

import { PROVIDER_KEYS_WITH_HOSTPRODUCT_CONTEXT } from '../../constants';

export const extractIsSupportProductContext = (meta?: JsonLd.Meta.BaseMeta): boolean => {
	return Boolean(meta?.key && PROVIDER_KEYS_WITH_HOSTPRODUCT_CONTEXT.includes(meta.key));
};
