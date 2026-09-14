import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const extractIsTrusted = (meta?: JsonLd.Meta.BaseMeta): boolean => {
	return Boolean(meta?.key && meta.key !== 'iframely-object-provider');
};
