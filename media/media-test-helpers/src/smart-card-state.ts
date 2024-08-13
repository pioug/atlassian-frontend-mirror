export const url = 'https://bitbucket.org/atlassian/incredible-monorepo/pull-requests/42';
export const atlassianProjectUrl = 'https://team.atlassian.com/project/CGFCFBKQ-45/about';

export const atlassianProjectCardState: any = {
	status: 'resolved',
	lastUpdatedAt: 1624877833614,
	details: {
		meta: {
			auth: [],
			definitionId: 'watermelon-object-provider',
			product: 'watermelon',
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
				'@id': 'https://www.atlassian.com/#TeamCentral',
				name: 'Atlas',
				icon: {
					'@type': 'Image',
					url: 'https://team.atlassian.com/favicon.ico',
				},
			},
			'@type': ['Object', 'atlassian:Project'],
			url: 'https://team.atlassian.com/project/CGFCFBKQ-45/about',
			icon: {
				'@type': 'Image',
				url: 'data:image/png;base64,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',
			},
			name: 'Testing',
			summary: '',
			'atlassian:state': {
				'@type': 'Object',
				name: 'Pending',
				appearance: 'default',
			},
			attributedTo: [
				{
					name: 'Tugba Turhan',
					icon: 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5e0c76b2c578120daca4ad75/36763c94-f79a-4cf1-9182-a216d31a21a1/128',
				},
			],
			'atlassian:updatedBy': [
				{
					name: 'Tugba Turhan',
					icon: 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5e0c76b2c578120daca4ad75/36763c94-f79a-4cf1-9182-a216d31a21a1/128',
				},
			],
			preview: {
				'@type': 'Link',
				href: 'https://team.atlassian.com/embeds/project/CGFCFBKQ-45/about',
			},
			'schema:commentCount': 0,
			'atlassian:subscriberCount': 1,
			endTime: '2024-07-18',
			updated: '2024-07-18T17:48:36.213141',
			'atlassian:serverAction': [
				{
					'@type': 'UpdateAction',
					name: 'UpdateAction',
					dataUpdateAction: {
						'@type': 'UpdateAction',
						name: 'FollowEntityAction',
					},
					resourceIdentifiers: {
						ari: 'ari:cloud:townsquare:9c6d06ea-9b84-4307-9e69-dc1e140aeacf:project/20821e19-a201-46f4-9845-9d79a84d7e23',
					},
					refField: 'button',
				},
			],
		},
	},
};

export const cardState: any = {
	status: 'resolved',
	lastUpdatedAt: 1624877833614,
	details: {
		meta: {
			access: 'granted',
			visibility: 'restricted',
			auth: [
				{
					key: 'bitbucket',
					displayName: 'Atlassian Links - Bitbucket',
					url: 'https://id.stg.internal.atlassian.com/outboundAuth/start?containerId=4d6a1ee9-20b3-492f-a0b6-3bab6c763a8e_3f823978-fbc9-4baa-95e2-1b4c89a73027&serviceKey=bitbucket',
				},
			],
			definitionId: 'a2d59c5a-952f-4996-8cf6-1d0ad318731a',
			key: 'bitbucket-object-provider',
			resourceType: 'pull',
			version: '2.0.2',
		},
		data: {
			'@id': url,
			'@context': {
				'@vocab': 'https://www.w3.org/ns/activitystreams#',
				atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
				schema: 'http://schema.org/',
			},
			'@type': ['Object', 'atlassian:SourceCodePullRequest'],
			url,
			attributedTo: {
				'@type': 'Person',
				name: 'Matt Turner',
				image:
					'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/MT-4.png',
			},
			'schema:dateCreated': '2019-12-12T03:20:14.858Z',
			generator: {
				'@type': 'Application',
				name: 'Bitbucket',
				icon: {
					'@type': 'Image',
					url: 'https://wac-cdn.atlassian.com/assets/img/favicons/bitbucket/favicon-32x32.png',
				},
			},
			icon: {
				'@type': 'Image',
				url: 'https://wac-cdn.atlassian.com/assets/img/favicons/bitbucket/favicon-32x32.png',
			},
			name: 'Normalise package config',
			summary: '',
			'atlassian:mergeSource': {
				'@type': 'Link',
				href: 'https://bitbucket.org/atlassian/incredible-monorepo/branch/normalise-package-config',
			},
			'atlassian:mergeDestination': {
				'@type': 'Link',
				href: 'https://bitbucket.org/atlassian/incredible-monorepo/branch/master',
			},
			updated: '2019-12-12T03:40:43.420Z',
			'atlassian:mergeCommit': {
				'@type': 'Link',
				href: 'https://bitbucket.org/atlassian/incredible-monorepo/commits/56139bbc3793',
			},
			'atlassian:internalId': '42',
			'atlassian:isMerged': true,
			'atlassian:state': 'MERGED',
			'atlassian:mergedBy': {
				'@type': 'Person',
				name: 'Matt Turner',
				image:
					'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/MT-4.png',
			},
			'atlassian:reviewer': [
				{
					'@type': 'Person',
					name: 'ᴄᴏsᴍᴏ',
					image:
						'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar-1.png',
				},
			],
			'atlassian:reviewedBy': [
				{
					'@type': 'Person',
					name: 'ᴄᴏsᴍᴏ',
					image:
						'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar-1.png',
				},
			],
			'atlassian:updatedBy': {
				'@type': 'Person',
				name: 'Matt Turner',
				image:
					'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/MT-4.png',
			},
			audience: [
				{
					'@type': 'Person',
					name: 'Matt Turner',
					image:
						'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/MT-4.png',
				},
				{
					'@type': 'Person',
					name: 'ᴄᴏsᴍᴏ',
					image:
						'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar-1.png',
				},
			],
			context: {
				'@type': 'atlassian:SourceCodeRepository',
				name: 'incredible-monorepo',
				url: 'https://bitbucket.org/atlassian/incredible-monorepo',
			},
		},
	},
};
