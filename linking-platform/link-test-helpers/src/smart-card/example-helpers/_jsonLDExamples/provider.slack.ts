import { avatar2, slackLogo } from '../../images';

const baseMetaData = {
	visibility: 'restricted',
	access: 'granted',
	version: '2509',
	key: 'slack-object-provider',
};

export const SlackMessage = {
	meta: {
		...baseMetaData,
		resourceType: 'message',
	},
	data: {
		'@id': 'https://atlassian.slack.com/archives/C05HTNQG62H/p1692925200195409',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@type': 'atlassian:Message',
		generator: {
			'@type': 'Application',
			name: 'Slack',
			icon: {
				'@type': 'Image',
				url: slackLogo,
			},
		},
		icon: {
			'@type': 'Image',
			url: slackLogo,
		},
		url: 'https://atlassian.slack.com/archives/C05HTNQG62H/p1692925200195409',
		name: 'Slack message from Nabin Thapa in #proj-smart-links-better-metadata',
		'schema:commentCount': 8,
		'atlassian:reactCount': 7,

		summary: 'We are ready to release changes',
		attributedTo: {
			'@type': 'Person',
			icon: avatar2,
			name: 'Test User',
		},
		dateSent: '2020-08-25T01:00:00.195Z',
	},
};

export const SlackChannel = {
	meta: {
		...baseMetaData,
		resourceType: 'channel',
	},
	data: {
		'@id': 'https://atlassian.slack.com/archives/C05HTNQG62H/p1692925200195409',
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@type': 'Document',
		generator: {
			'@type': 'Application',
			name: 'Slack',
			icon: {
				'@type': 'Image',
				url: slackLogo,
			},
		},
		icon: {
			'@type': 'Image',
			url: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
		},
		url: 'https://atlassian.slack.com/archives/C05HTNQG62H/p1692925200195409',
		name: 'proj-smart-links-better-metadata',
	},
};
