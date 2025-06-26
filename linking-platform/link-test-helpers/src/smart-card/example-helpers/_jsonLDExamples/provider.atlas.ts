import { avatar1, avatar3, iconAtlas } from '../../images';

// EDM-3603: These are an expected payload format after Atlas has completed
// the proposal of this ticket.

export const atlasProjectUrl = 'https://project-url';

export const AtlasProject = {
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
			icon: { '@type': 'Image', url: iconAtlas },
		},
		'@type': ['Object', 'atlassian:Project'],
		url: 'https://project-url',
		icon: {
			'@type': 'Image',
			url: 'data:image/png;base64,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',
		},
		name: 'Lorem ipsum dolor sit amet',
		summary:
			'Cras ut nisi vitae lectus sagittis mattis. Curabitur a urna feugiat, laoreet enim ac, lobortis diam.',
		'atlassian:state': {
			'@type': 'Object',
			name: 'On track',
			appearance: 'success',
		},
		preview: {
			'@type': 'Link',
			href: 'https://preview-url',
		},
		attributedTo: [{ '@type': 'Person', icon: avatar3, name: 'Aliza' }],
		updated: '2022-06-05T16:44:00.000+1000',
		endTime: '2022-07-31T00:00:00.000Z',
	},
};

export const AtlasProjectNoPreview = {
	...AtlasProject,
	data: {
		...AtlasProject.data,
		preview: undefined,
	},
};

export const AtlasGoal = {
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
			icon: { '@type': 'Image', url: iconAtlas },
		},
		'@type': ['Object', 'atlassian:Goal'],
		url: 'https://goal-url',
		icon: {
			'@type': 'Image',
			url: 'data:image/png;base64,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',
		},
		name: 'Etiam diam massa, pellentesque at tempus eget, sodales mattis dui',
		summary:
			'Morbi bibendum dapibus sapien id mollis. Vivamus venenatis viverra iaculis. Vestibulum et consectetur nunc. Proin vitae mollis turpis. Mauris vel lacus dolor.',
		'atlassian:state': {
			'@type': 'Object',
			name: 'Pending',
			appearance: 'default',
		},
		preview: {
			'@type': 'Link',
			href: 'https://preview-url',
		},
		attributedTo: [{ '@type': 'Person', icon: avatar1, name: 'Angie' }],
		updated: '2022-02-05T16:44:00.000+1000',
		endTime: '2022-07-31T00:00:00.000Z',
	},
};
