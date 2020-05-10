import { JsonLd } from 'json-ld-types';
export const TEST_URL = 'https://my.url.com';
export const TEST_NAME = 'my name';
export const TEST_STRING = 'foo';
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
export const TEST_BASE_DATA: JsonLd.Data.BaseData = {
  ...TEST_OBJECT,
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
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
