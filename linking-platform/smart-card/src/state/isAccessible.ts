import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const isAccessible = ({ meta: { access } }: JsonLd.Response): boolean =>
	access === 'granted';
