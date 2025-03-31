import { type JsonLd } from '@atlaskit/json-ld-types';

export const YouTubeVideoUrl = 'https://www.youtube.com/watch?v=9tpySewzRG0';
export const YouTubeVideo = {
	meta: {
		resourceType: 'video',
		visibility: 'public',
		access: 'granted',
		product: 'YouTube',
		follow: true,
		auth: [],
		definitionId: 'public-object-provider',
		key: 'public-object-provider',
	},
	data: {
		'@type': 'Object',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		url: YouTubeVideoUrl,
		name: 'Donut 4.2 tutorial result',
		updated: '2024-09-24T21:56:17.000Z',
		summary:
			"It's not the first time I am doing a donut tutorial. here is the result for this time",
		attributedTo: {
			'@type': 'Person',
			name: "Aleksandr 'Sasha' Motsjonov",
		},
		generator: {
			'@type': 'Object',
			name: 'YouTube',
			icon: {
				'@type': 'Image',
				url: 'https://www.youtube.com/s/desktop/72b8c307/img/favicon_32x32.png',
			},
		},
		icon: {
			'@type': 'Image',
			url: 'https://www.youtube.com/s/desktop/72b8c307/img/favicon_32x32.png',
		},
		image: {
			'@type': 'Image',
			url: 'https://i.ytimg.com/vi/9tpySewzRG0/maxresdefault.jpg',
		},
		preview: {
			'@type': 'Link',
			href: 'https://www.youtube.com/embed/9tpySewzRG0?rel=0',
			'atlassian:supportedPlatforms': ['web'],
			'atlassian:aspectRatio': 1.7778,
		},
	},
} as JsonLd.Response<JsonLd.Data.BaseData>;
