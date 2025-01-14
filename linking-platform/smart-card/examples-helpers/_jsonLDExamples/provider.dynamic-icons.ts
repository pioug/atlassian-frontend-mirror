export type GenerateContextProp = {
	type?: string[] | string;
	fileFormat?: string;
};
export const generateContext = ({ type = 'Document', fileFormat }: GenerateContextProp) => ({
	meta: {
		auth: [],
		definitionId: 'watermelon-object-provider',
		visibility: 'restricted',
		access: 'granted',
		key: 'watermelon-object-provider',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		generator: {
			'@type': 'Application',
			name: 'Atlas',
			icon: { '@type': 'Image', url: null },
		},
		'@type': type,
		url: 'https://project-url',
		name: 'Lorem ipsum dolor sit amet',
		summary:
			'Cras ut nisi vitae lectus sagittis mattis. Curabitur a urna feugiat, laoreet enim ac, lobortis diam.',
		preview: {
			'@type': 'Link',
			href: 'https://preview-url',
		},
		'schema:fileFormat': fileFormat,
		attributedTo: [{ '@type': 'Person', icon: null, name: 'Aliza' }],
		updated: '2022-06-05T16:44:00.000+1000',
		endTime: '2022-07-31T00:00:00.000Z',
	},
});
