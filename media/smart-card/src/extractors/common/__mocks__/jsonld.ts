import { JsonLd } from 'json-ld-types';
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

export const TEST_DOCUMENT: JsonLd.Data.Document = {
  ...TEST_OBJECT,
  ...TEST_BASE_DATA,
  '@type': 'Document',
  'schema:commentCount': 214,
  'schema:potentialAction': [],
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

export const TEST_NO_ID_ACTION: JsonLd.Data.BaseData['schema:potentialAction'] = {
  '@type': 'DeleteAction',
  identifier: 'dropbox-object-provider',
  name: 'delete',
};

export const TEST_DOCUMENT_WITH_ACTIONS = {
  ...TEST_DOCUMENT,
  'schema:potentialAction': [TEST_DOWNLOAD_ACTION, TEST_ASSIGN_ACTION as any],
};

export const PREVIEW: JsonLd.Data.BaseData['preview'] = {
  '@type': 'Link',
  href: TEST_URL,
  'atlassian:supportedPlatforms': ['web'],
};

export const TEST_DOCUMENT_WITH_PREVIEW = {
  ...TEST_DOCUMENT,
  preview: PREVIEW,
};
