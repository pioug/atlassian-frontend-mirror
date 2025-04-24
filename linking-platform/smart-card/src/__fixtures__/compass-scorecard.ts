export default {
	meta: {
		access: 'granted',
		visibility: 'restricted',
		product: 'COMPASS',
		resourceType: 'scorecard-v2',
		key: 'dragonfruit-object-provider',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@type': ['Object', 'atlassian:Project'],
		url: 'https://ben-just-jwm.jira-dev.com/compass/scorecard/a7c20891-8958-4360-bc5a-8d8a26d7cdfc',
		name: 'Component readiness',
		icon: {
			'@type': 'Image',
			url: 'https://compass-ui.prod-east.frontend.public.atl-paas.net/assets/scorecard-icon.svg',
		},
		preview: {
			'@type': 'Link',
			href: 'https://ben-just-jwm.jira-dev.com/compass/scorecard/a7c20891-8958-4360-bc5a-8d8a26d7cdfc?embedded=true',
			'atlassian:supportedPlatforms': ['web'],
		},
		generator: {
			'@type': 'Application',
			name: 'Compass',
			icon: {
				'@type': 'Image',
				url: 'https://compass-ui.prod-east.frontend.public.atl-paas.net/assets/compass.svg',
			},
		},
		'atlassian:ownedBy': {
			'@type': 'Person',
			name: 'Ben Krig',
			icon: 'https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/5ce5eb3e00d9750e45e260b7/bee2c06c-5a29-4c54-bae4-1b0599289492/128',
		},
		'atlassian:appliedToComponentsCount': 2,
		summary:
			'Ensure component details are ready for development teams to reference in the catalog.',
	},
};
