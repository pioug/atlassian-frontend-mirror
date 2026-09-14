import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const extractMetaTenantId = (meta: JsonLd.Meta.BaseMeta): string | undefined =>
	meta.tenantId;
