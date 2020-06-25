import { Client, ResolveResponse } from '@atlaskit/smart-card';
import { smallImage } from '@atlaskit/media-test-helpers';
import { JsonLd, defaults } from 'json-ld-types';

const inlineCardTestUrl = 'https://inlineCardTestUrl';
const inlineCardTestUrlUnauthorized = 'https://inlineCardTestUrl/unauthorized';
const inlineCardTestUrlForbidden = 'https://inlineCardTestUrl/forbidden';
const blockCardTestUrl = 'https://blockCardTestUrl';
const blockCardTestUrlUnauthorized = 'https://blockCardTestUrl/unauthorized';
const blockCardTestUrlForbidden = 'https://blockCardTestUrl/forbidden';
const embedCardTestUrl = 'https://embedCardTestUrl';
const embedCardTestUrlFallback = 'https://embedCardTestUrl/fallback';
const embedCardTestUrlUnauthorized = 'https://embedCardTestUrl/unauthorized';
const embedCardTestUrlForbidden = 'https://embedCardTestUrl/forbidden';

export const cardPayload = (
  url: string,
  metaType?: keyof typeof defaults.meta,
): JsonLd.Object<JsonLd.Meta.BaseMeta, JsonLd.Data.Document> => ({
  meta: metaType ? defaults.meta[metaType] : defaults.meta.granted,
  data: {
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@id': 'id:gbp5oQsUU5AAAAAAAAAACg',
    '@type': 'Document',
    'schema:fileFormat': 'image/jpeg',
    'schema:potentialAction': {
      '@type': 'DownloadAction',
      name: 'Download',
      identifier: 'dropbox-object-provider',
    },
    'atlassian:downloadUrl':
      'https://www.dropbox.com/s/q3njsd094anqero/birdman.jpg?dl=1',
    'atlassian:fileSize': 727238,
    'atlassian:isDeleted': false,
    attributedTo: {
      '@type': 'Person',
      name: 'Artur Bodera',
    },
    context: {
      '@type': 'Collection',
      name: 'Root',
    },
    generator: {
      '@type': 'Application',
      icon: {
        '@type': 'Image',
        url: smallImage,
      },
      name: 'Dropbox',
    },
    preview: {
      '@type': 'Link',
      href: 'https://some-broken-preview-url',
    },
    name: 'birdman.jpg',
    url,
  },
});

let embedCardFallbackPayload = cardPayload(embedCardTestUrlFallback);
embedCardFallbackPayload = {
  ...embedCardFallbackPayload,
  data: { ...embedCardFallbackPayload.data, preview: undefined },
} as JsonLd.Object<JsonLd.Meta.BaseMeta, JsonLd.Data.Document>;

const payloadMap: { [key: string]: JsonLd.Response } = {
  [inlineCardTestUrl]: cardPayload(inlineCardTestUrl),
  [inlineCardTestUrlUnauthorized]: cardPayload(
    inlineCardTestUrlUnauthorized,
    'unauthorized',
  ),
  [inlineCardTestUrlForbidden]: cardPayload(
    inlineCardTestUrlForbidden,
    'permissionDenied',
  ),
  [blockCardTestUrlUnauthorized]: cardPayload(
    blockCardTestUrlUnauthorized,
    'unauthorized',
  ),
  [blockCardTestUrlForbidden]: cardPayload(
    blockCardTestUrlForbidden,
    'permissionDenied',
  ),
  [blockCardTestUrl]: cardPayload(blockCardTestUrl),
  [embedCardTestUrl]: cardPayload(embedCardTestUrl),
  [embedCardTestUrlFallback]: embedCardFallbackPayload,
  [embedCardTestUrlUnauthorized]: cardPayload(embedCardTestUrl, 'unauthorized'),
  [embedCardTestUrlForbidden]: cardPayload(
    embedCardTestUrl,
    'permissionDenied',
  ),
};

export class MockedSmartCardClient extends Client {
  fetchData(url: string): Promise<ResolveResponse> {
    const isResolving = url.includes('/resolving');
    const timeout = isResolving ? 1000000000 : 500;
    const data = payloadMap[url];
    return new Promise(resolve => {
      // We simulate a 0.5s load time
      window.setTimeout(() => {
        resolve(data);
      }, timeout);
    });
  }
}

export const cardClient = new MockedSmartCardClient('staging');
