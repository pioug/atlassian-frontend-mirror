import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const extractMetaResourceType = (meta: JsonLd.Meta.BaseMeta): string | undefined =>
	meta.resourceType;
