import { type JsonLd } from 'json-ld-types';
export const TEST_URL = 'https://my.url.com';
export const TEST_INTERACTIVE_HREF_URL = 'https://my.url.com/embed';
export const TEST_NAME = 'my name';
export const TEST_STRING = 'foo';
export const TEST_ARI =
  'ari:cloud:confluence:DUMMY-12345678-abcd-efgh-adbb-a0906ccc722b:page/1228472772';
export const TEST_LINK: JsonLd.Primitives.Link = {
  '@type': 'Link',
  href: TEST_URL,
  name: TEST_NAME,
};
export const TEST_INTERACTIVE_HREF_LINK = {
  '@type': 'Link',
  href: TEST_URL,
  interactiveHref: TEST_INTERACTIVE_HREF_URL,
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
