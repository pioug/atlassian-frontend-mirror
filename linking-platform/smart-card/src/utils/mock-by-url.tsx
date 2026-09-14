import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';

export const mockByUrl: any = (url: string) => {
	return {
		meta: {
			visibility: 'public',
			access: 'granted',
			auth: [],
			definitionId: 'd1',
			key: 'object-provider',
			resourceType: 'object-resource',
			subproduct: 'object-subproduct',
			product: 'object-product',
		},
		data: {
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': 'Object',
			name: url,
			summary: 'Here is your serving of cheese: 🧀',
			'schema:potentialAction': {
				'@id': 'comment',
				'@type': 'CommentAction',
				identifier: 'object-provider',
				name: 'Comment',
			},
			preview: {
				href: 'https://www.ilovecheese.com',
			},
			url: url,
		},
	} as JsonLd.Response;
};
