import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const emptyData: JsonLd.Data.BaseData = {
	'@context': {
		'@vocab': 'https://www.w3.org/ns/activitystreams#',
		atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
		schema: 'http://schema.org/',
	},
	'@type': 'Object',
};
