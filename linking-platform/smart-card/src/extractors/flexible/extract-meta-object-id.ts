import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const extractMetaObjectId = (meta: JsonLd.Meta.BaseMeta): string | undefined =>
	meta.objectId;
