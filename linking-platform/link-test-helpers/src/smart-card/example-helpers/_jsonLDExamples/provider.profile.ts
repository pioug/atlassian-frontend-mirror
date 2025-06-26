import { type JsonLd } from '@atlaskit/json-ld-types';

import { avatarSquare, iconAtlas } from '../../images';

import { overrideEmbedContent } from './utils';

export const ProfileObject = {
	meta: {
		auth: [],
		visibility: 'restricted',
		access: 'granted',
		definitionId: 'people-object-provider',
		key: 'people-object-provider',
	},
	data: {
		url: 'https://pug.jira-dev.com/wiki/people/INVALID',
		icon: avatarSquare,
		name: 'John Doe',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		generator: {
			'@type': 'Application',
			'@id': 'https://www.atlassian.com/#Directory',
			name: 'Atlassian',
			icon: {
				'@type': 'Image',
				url: iconAtlas,
			},
		},
		'@type': ['Object', 'Profile'],
		preview: {
			'@type': 'Link',
			href: overrideEmbedContent,
		},
	},
} as JsonLd.Response<JsonLd.Data.BaseData>;
