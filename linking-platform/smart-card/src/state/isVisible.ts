import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const isVisible = ({ meta: { visibility } }: JsonLd.Response): boolean =>
	visibility === 'restricted' || visibility === 'public';
