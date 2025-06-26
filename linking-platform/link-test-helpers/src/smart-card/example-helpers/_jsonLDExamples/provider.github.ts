import { type JsonLd } from '@atlaskit/json-ld-types';

export const GithubFile = {
	meta: {
		visibility: 'restricted',
		access: 'granted',
		resourceType: 'file',
		key: 'github-object-provider',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@id': 'https://github.com/tuser/test-repo/blob/tuser-patch-1/test.txt',
		'@type': ['schema:DigitalDocument', 'Document'],
		url: 'https://github.com/tuser/test-repo/blob/tuser-patch-1/test.txt',
		'atlassian:fileSize': 10,
		'atlassian:isDeleted': false,
		context: {
			'@type': 'Collection',
			name: 'test-repo',
		},
		fileFormat: 'text/plain',
		generator: {
			'@type': 'Application',
			icon: {
				'@type': 'Image',
				url: 'https://git-scm.com/favicon.ico',
			},
			name: 'git',
		},
		name: 'test.txt',
	},
} as JsonLd.Response;

export const GithubPullRequestJson = {
	meta: {
		visibility: 'restricted',
		access: 'granted',
		resourceType: 'pullRequest',
		key: 'github-object-provider',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@id': 'https://github.com/testuser/test-repo/pull/3',
		'@type': ['Object', 'atlassian:SourceCodePullRequest'],
		url: 'https://github.com/testuser/test-repo/pull/3',
		'atlassian:isMerged': false,
		'atlassian:mergeCommit': {
			'@type': 'Link',
			href: 'https://github.com/testuser/test-repo/commit/bbadd311a1eb5154ab7f43445adfa67e0810bfec',
		},
		'atlassian:mergeDestination': {
			'@type': 'Link',
			href: 'https://github.com/testuser/test-repo/tree/master',
		},
		'atlassian:mergeSource': {
			'@type': 'Link',
			href: 'https://github.com/testuser/test-repo/tree/testuser-patch-1',
		},
		'atlassian:mergeable': true,
		'atlassian:mergedBy': undefined,
		'atlassian:reviewedBy': [
			{
				'@type': 'Person',
				icon: 'https://avatars1.githubusercontent.com/u/12615400?v=4',
				name: 'testuser',
			},
		],
		'atlassian:reviewer': [
			{
				'@type': 'Person',
				icon: 'https://avatars1.githubusercontent.com/u/12615400?v=4',
				name: 'testuser',
			},
		],
		'atlassian:state': 'open',
		'atlassian:updatedBy': {
			'@type': 'Person',
			icon: 'https://avatars1.githubusercontent.com/u/12615400?v=4',
			name: 'testuser',
		},
		attributedTo: {
			'@type': 'Person',
			icon: 'https://avatars0.githubusercontent.com/u/20928699?v=4',
			name: 'testuser',
		},
		audience: [
			{
				'@type': 'Person',
				icon: 'https://avatars0.githubusercontent.com/u/20928690?v=4',
				name: 'tuser',
			},
			{
				'@type': 'Person',
				icon: 'https://avatars1.githubusercontent.com/u/12615400?v=4',
				name: 'testuser',
			},
		],
		context: {
			'@type': 'atlassian:SourceCodeRepository',
			name: 'test-repo',
			url: 'https://github.com/testuser/test-repo',
		},
		generator: {
			'@type': 'Application',
			icon: {
				'@type': 'Image',
				url: 'https://git-scm.com/favicon.ico',
			},
			name: 'git',
		},
		icon: {
			'@type': 'Image',
			url: 'https://git-scm.com/favicon.ico',
		},
		name: 'qweqwe',
		'schema:dateCreated': '2018-05-23T14:43:57Z',
		'schema:potentialAction': undefined,
		'schema:programmingLanguage': 'JavaScript',
		summary: '@someuser',
		tags: [
			{
				'@type': '',
				id: 921541895,
				name: 'bug',
				url: 'https://github.com/testuser/test-repo/labels/bug',
			},
			{
				'@type': '',
				id: 921541896,
				name: 'duplicate',
				url: 'https://github.com/testuser/test-repo/labels/duplicate',
			},
			{
				'@type': '',
				id: 921541897,
				name: 'enhancement',
				url: 'https://github.com/testuser/test-repo/labels/enhancement',
			},
		],
		updated: '2018-08-08T12:17:47Z',
	},
};

export const GithubPullRequest = GithubPullRequestJson as JsonLd.Response;

export const GithubRepository = {
	meta: {
		visibility: 'restricted',
		access: 'granted',
		resourceType: 'repository',
		key: 'github-object-provider',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@id': 'https://github.com/User/blender.js',
		'@type': 'atlassian:SourceCodeRepository',
		url: 'https://github.com/User/cheeser.js',
		'atlassian:updatedBy': {
			'@type': 'Person',
			icon: 'https://avatars.githubusercontent.com/u/20928690?',
			name: 'tuser',
		},
		attributedTo: {
			'@type': 'Person',
			icon: 'https://avatars2.githubusercontent.com/u/15986691?v=4',
			name: 'User',
		},
		context: {
			'@type': 'Organization',
			name: 'NASA',
		},
		generator: {
			'@type': 'Application',
			icon: {
				'@type': 'Image',
				url: 'https://github.githubassets.com/favicon.ico',
			},
			name: 'Github',
		},
		icon: {
			'@type': 'Image',
			url: 'https://github.githubassets.com/favicon.ico',
		},
		name: 'cheeser.js',
		'schema:dateCreated': '2017-04-04T10:17:08Z',
		'schema:programmingLanguage': 'JavaScript',
		summary:
			'A JavaScript engine helping you develop real-time, blockchain-inspired, ML-invoked cheese models.',
		updated: '2018-07-30T16:21:19Z',
		'atlassian:subscribers': [],
		'atlassian:subscriberCount': '20488402',
	},
} as JsonLd.Response;

export const GithubSourceCodeReference = {
	meta: {
		visibility: 'restricted',
		access: 'granted',
		resourceType: 'branch',
		key: 'github-object-provider',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@id': 'https://github.com/tuser/test-repo/tree/new-branch',
		'@type': 'atlassian:SourceCodeReference',
		url: 'https://github.com/tuser/test-repo/tree/new-branch',
		'atlassian:commit': {
			'@id': '216bbb3ec969788969b95defcc995af2ebafef91',
			'@type': 'atlassian:SourceCodeCommit',
			url: 'https://github.com/tuser/test-repo/commit/216bbb3ec969788969b95defcc995af2ebafef91',
		},
		'atlassian:updatedBy': {
			'@type': 'Person',
			image: 'https://avatars3.githubusercontent.com/u/19864447?v=4',
			name: 'web-flow',
		},
		attributedTo: {
			'@type': 'Person',
			icon: 'https://avatars0.githubusercontent.com/u/20928690?v=4',
			name: 'tuser',
		},
		context: {
			'@type': 'atlassian:SourceCodeRepository',
			name: 'repo-name',
			url: 'https://github.com/User/repo-name',
		},
		generator: {
			'@type': 'Application',
			icon: {
				'@type': 'Image',
				url: 'https://git-scm.com/favicon.ico',
			},
			name: 'git',
		},
		icon: {
			'@type': 'Image',
			url: 'https://git-scm.com/favicon.ico',
		},
		name: 'tuser-patch-1',
		'schema:dateCreated': '2018-05-23T14:43:41Z',
		'schema:programmingLanguage': 'JavaScript',
		summary: 'qweqwe',
		updated: '2018-05-23T14:43:41Z',
	},
} as JsonLd.Response;

export const GitHubIssue = {
	meta: {
		visibility: 'restricted',
		access: 'granted',
		resourceType: 'issue',
		key: 'github-object-provider',
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@id': 'https://github.com/User/repo-name/issues/8',
		'@type': ['Object', 'atlassian:Task'],
		'atlassian:assigned': undefined,
		'atlassian:assignedBy': {
			'@type': 'Person',
			icon: 'https://avatars2.githubusercontent.com/u/15986691?v=4',
			name: 'User',
		},
		'atlassian:assignedTo': [
			{
				'@type': 'Person',
				icon: 'https://avatars2.githubusercontent.com/u/15986691?v=4',
				name: 'User',
			},
			{
				'@type': 'Person',
				image: 'https://avatars0.githubusercontent.com/u/40266685?v=4',
				name: 'Partner',
			},
		],
		'atlassian:isCompleted': false,
		'atlassian:isDeleted': false,
		'atlassian:priority': 'critical',
		'atlassian:subscriber': [
			{
				'@type': 'Person',
				image: 'https://avatars0.githubusercontent.com/u/385?v=4',
				name: 'subscriber1',
			},
			{
				'@type': 'Person',
				image: 'https://avatars3.githubusercontent.com/u/2050?v=4',
				name: 'subscriber2',
			},
		],
		'atlassian:subscriberCount': 1,
		'atlassian:taskStatus': {
			'@type': 'Link',
			href: 'https://github.com/user/repo-name/issues?q=is%3Aissue%20is%3Aopen',
			name: 'open',
		},
		'atlassian:taskType': {
			'@type': 'Link',
			href: 'https://github.com/user/repo-name/issues',
			name: 'Issue',
		},
		'atlassian:updatedBy': undefined,
		attributedTo: {
			'@type': 'Person',
			icon: 'https://avatars2.githubusercontent.com/u/15986691?v=4',
			name: 'User',
		},
		completed: undefined,
		content: 'Issue descriptions bla bla',
		context: {
			'@type': 'atlassian:Project',
			name: 'User/repo-name',
		},
		endTime: undefined,
		generator: {
			'@type': 'Application',
			icon: {
				'@type': 'Image',
				url: 'https://github.githubassets.com/favicon.ico',
			},
			name: 'git',
		},
		image: undefined,
		mediaType: 'text/markdown',
		name: 'w1',
		'schema:commentCount': 24,
		'schema:dateCreated': '2018-07-10T15:00:32Z',
		'schema:potentialAction': undefined,
		startTime: '2018-07-10T15:00:32Z',
		summary: undefined,
		tags: [
			{
				'@type': 'Object',
				id: 576144926,
				name: 'enhancement',
				url: 'https://github.com/user/repo-name/labels/enhancement',
			},
			{
				'@type': 'Object',
				id: 576144927,
				name: 'help wanted',
				url: 'https://github.com/user/repo-name/labels/help%20wanted',
			},
			{
				'@type': 'Object',
				id: 576144928,
				name: 'invalid',
				url: 'https://github.com/user/repo-name/labels/invalid',
			},
		],
		updated: '2018-07-30T16:15:03Z',
		url: 'https://github.com/user/repo-name/issues/535123525?a=2',
	},
} as JsonLd.Response;
