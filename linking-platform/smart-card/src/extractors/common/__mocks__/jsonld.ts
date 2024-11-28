import { type JsonLd } from 'json-ld-types';

import { SmartLinkActionType } from '@atlaskit/linking-types';
export const TEST_URL = 'https://my.url.com';
export const TEST_VISIT_URL = 'https://visit.url.com';
export const TEST_NAME = 'my name';
export const TEST_STRING = 'foo';
export const TEST_PREFIX = 'some-mock-prefix';
export const TEST_EMOJI = '"emoji-id"';
export const TEST_EMOJI_SANITIZED = 'emoji-id';
export const TEST_LINK: JsonLd.Primitives.Link = {
	'@type': 'Link',
	href: TEST_URL,
	name: TEST_NAME,
};
export const TEST_ARRAY: JsonLd.Primitives.Link[] = [TEST_LINK];
export const TEST_OBJECT: JsonLd.Primitives.Object = {
	'@type': 'Object',
	url: TEST_URL,
	name: TEST_NAME,
	icon: TEST_URL,
	image: TEST_URL,
};
export const TEST_PERSON: JsonLd.Primitives.Person = {
	...TEST_OBJECT,
	'@type': 'Person',
};
export const TEST_IMAGE: JsonLd.Primitives.Image = {
	'@type': 'Image',
	url: TEST_URL,
};
export const TEST_IMAGE_WITH_LINK: JsonLd.Primitives.Image = {
	'@type': 'Image',
	url: TEST_LINK,
};

export const TEST_TITLE_EMOJI: JsonLd.Data.BaseData['atlassian:titlePrefix'] = {
	'@type': 'atlassian:Emoji',
	text: TEST_EMOJI,
};
export const TEST_BASE_DATA: JsonLd.Data.BaseData = {
	...TEST_OBJECT,
	'@context': {
		'@vocab': 'https://www.w3.org/ns/activitystreams#',
		atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
		schema: 'http://schema.org/',
	},
};

export const TEST_DATA_WITH_EMOJI: JsonLd.Data.BaseData = {
	...TEST_BASE_DATA,
	'atlassian:titlePrefix': TEST_TITLE_EMOJI,
};

export const TEST_DATA_WITH_NO_PREFIX: JsonLd.Data.BaseData = {
	...TEST_BASE_DATA,
	'atlassian:titlePrefix': undefined,
};

export const TEST_PROJECT: JsonLd.Data.Project = {
	...TEST_BASE_DATA,
	'@type': 'atlassian:Project',
	'atlassian:isDeleted': false,
	'atlassian:member': TEST_PERSON,
	'schema:dateCreated': '2018-07-10T15:00:32Z',
};
export const TEST_PROJECT_WITHOUT_MEMBERS: Partial<JsonLd.Data.Project> = {
	...TEST_BASE_DATA,
	'@type': 'atlassian:Project',
	'atlassian:isDeleted': false,
	'schema:dateCreated': '2018-07-10T15:00:32Z',
};
export const TEST_PULL_REQUEST: JsonLd.Data.SourceCodePullRequest = {
	...TEST_BASE_DATA,
	'@type': 'atlassian:SourceCodePullRequest',
	'atlassian:isMerged': false,
	'atlassian:state': 'OPEN',
	'schema:dateCreated': '2018-07-10T15:00:32Z',
	'schema:potentialAction': undefined,
};

export const TEST_TASK: JsonLd.Data.Task = {
	'@type': 'atlassian:Task',
	'@context': {
		'@vocab': 'https://www.w3.org/ns/activitystreams#',
		atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
		schema: 'http://schema.org/',
	},
};

export const TEST_META_DATA: JsonLd.Meta.BaseMeta = {
	access: 'forbidden',
	visibility: 'restricted',
};

export const TEST_RESOLVED_META_DATA: JsonLd.Meta.BaseMeta = {
	access: 'granted',
	visibility: 'restricted',
	key: 'object-provider',
};

export const TEST_RESOLVED_META_DATA_WITH_AI_SUMMARY: JsonLd.Meta.BaseMeta = {
	...TEST_RESOLVED_META_DATA,
	supportedFeature: ['AISummary'],
};

export const TEST_DOCUMENT: JsonLd.Data.Document = {
	...TEST_OBJECT,
	...TEST_BASE_DATA,
	'@type': 'Document',
	'schema:commentCount': 214,
	'schema:potentialAction': [],
};

export const TEST_DOCUMENT_WITH_ARI: JsonLd.Data.Document = {
	...TEST_DOCUMENT,
	'atlassian:ari': 'some-resource-identifier',
};

export const TEST_CURRENT_DOCUMENT: JsonLd.Data.Document = {
	...TEST_OBJECT,
	...TEST_BASE_DATA,
	'@type': 'Document',
	'schema:commentCount': 214,
	'schema:potentialAction': [],
	'atlassian:state': 'current',
};
export const TEST_DOWNLOAD_ACTION: JsonLd.Data.BaseData['schema:potentialAction'] = {
	'@type': 'DownloadAction',
	'@id': 'download',
	identifier: 'dropbox-object-provider',
};

export const TEST_UNDEFINED_LINK: JsonLd.Data.UndefinedLinkDocument = {
	...TEST_DOCUMENT,
	'@type': ['Document', 'atlassian:UndefinedLink'],
	'atlassian:visitUrl': TEST_VISIT_URL,
};

export const TEST_ASSIGN_ACTION: JsonLd.Data.BaseData['schema:potentialAction'] = {
	'@type': 'AssignAction',
	'@id': 'assign',
	identifier: 'dropbox-object-provider',
	name: 'assign',
};

export const TEST_VIEW_ACTION: JsonLd.Data.BaseData['schema:potentialAction'] = {
	'@type': 'ViewAction',
	identifier: 'dropbox-object-provider',
	name: 'view',
};

export const TEST_FOLLOW_ACTION: JsonLd.Primitives.UpdateAction = {
	'@type': 'UpdateAction',
	name: 'UpdateAction',
	dataUpdateAction: {
		'@type': 'UpdateAction',
		name: 'FollowEntityAction',
	},
	resourceIdentifiers: {
		ari: 'some-resource-identifier',
	},
	refField: 'button',
};

export const TEST_UNFOLLOW_ACTION: JsonLd.Primitives.UpdateAction = {
	'@type': 'UpdateAction',
	name: 'UpdateAction',
	dataUpdateAction: {
		'@type': 'UpdateAction',
		name: 'UnfollowEntityAction',
	},
	resourceIdentifiers: {
		ari: 'some-resource-identifier',
	},
	refField: 'button',
};

export const TEST_STATUS_UPDATE_ACTION: JsonLd.Primitives.UpdateAction = {
	'@type': 'UpdateAction',
	name: 'UpdateAction',
	dataRetrievalAction: {
		'@type': 'ReadAction',
		name: SmartLinkActionType.GetStatusTransitionsAction,
	},
	dataUpdateAction: {
		'@type': 'UpdateAction',
		name: SmartLinkActionType.StatusUpdateAction,
	},
	refField: 'tag',
	resourceIdentifiers: {
		issueKey: 'some-id',
		hostname: 'some-hostname',
	},
};

export const TEST_DOCUMENT_WITH_ACTIONS: JsonLd.Data.BaseData = {
	...TEST_DOCUMENT,
	'schema:potentialAction': [TEST_DOWNLOAD_ACTION, TEST_ASSIGN_ACTION as any],
};

export const TEST_DOCUMENT_WITH_DOWNLOAD_ACTION: JsonLd.Data.BaseData = {
	...TEST_DOCUMENT,
	'atlassian:downloadUrl': TEST_URL,
	'schema:potentialAction': [TEST_DOWNLOAD_ACTION],
};

export const TEST_DOCUMENT_WITH_VIEW_ACTION: JsonLd.Data.BaseData = {
	...TEST_DOCUMENT,
	'schema:potentialAction': [TEST_VIEW_ACTION],
};

export const TEST_DOCUMENT_WITH_MULTIPLE_ACTIONS: JsonLd.Data.BaseData = {
	...TEST_DOCUMENT,
	'schema:potentialAction': [TEST_VIEW_ACTION, TEST_DOWNLOAD_ACTION],
};

export const PREVIEW: JsonLd.Data.BaseData['preview'] = {
	'@type': 'Link',
	href: TEST_URL,
	'atlassian:supportedPlatforms': ['web'],
};

export const TEST_DOCUMENT_WITH_PREVIEW: JsonLd.Data.BaseData = {
	...TEST_DOCUMENT,
	preview: PREVIEW,
};

export const TEST_DATA_WITH_LATEST_COMMIT_OBJ = {
	...TEST_BASE_DATA,
	'atlassian:latestCommit': {
		'@type': 'atlassian:SourceCodeCommit',
		name: '83f45c9',
	},
} as JsonLd.Data.SourceCodeRepository;

export const TEST_DATA_WITH_LATEST_COMMIT_TEXT = {
	...TEST_BASE_DATA,
	'atlassian:latestCommit': '83f45c9',
} as JsonLd.Data.SourceCodeRepository;

// Full JSON LD responses
export const TEST_RESPONSE: JsonLd.Response = {
	data: TEST_DOCUMENT,
	meta: TEST_RESOLVED_META_DATA,
};

export const TEST_RESPONSE_WITH_PREVIEW_AND_DOWNLOAD: JsonLd.Response = {
	...TEST_RESPONSE,
	data: {
		...TEST_DOCUMENT_WITH_DOWNLOAD_ACTION,
		preview: PREVIEW,
	},
};

export const TEST_RESPONSE_WITH_DOWNLOAD: JsonLd.Response = {
	...TEST_RESPONSE,
	data: TEST_DOCUMENT_WITH_DOWNLOAD_ACTION,
};

export const TEST_RESPONSE_WITH_PREVIEW: JsonLd.Response = {
	...TEST_RESPONSE,
	data: {
		...TEST_DOCUMENT,
		preview: PREVIEW,
	},
};

export const TEST_RESPONSE_WITH_VIEW: JsonLd.Response = {
	...TEST_RESPONSE,
	data: TEST_DOCUMENT_WITH_VIEW_ACTION,
};
