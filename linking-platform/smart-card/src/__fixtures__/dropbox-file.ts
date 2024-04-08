import { JsonLd } from 'json-ld-types';

export default {
  meta: {
    access: 'granted',
    visibility: 'restricted',
    auth: [
      {
        key: 'dropbox',
        displayName: 'Atlassian Links - Dropbox',
        url: 'https://auth-url',
      },
    ],
    definitionId: '9c3e33e4-be06-437f-80fb-26c38acd215d',
    key: 'dropbox-object-provider',
    resourceType: 'sharedFile',
    version: '2.5.10',
  },
  data: {
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@type': ['schema:TextDigitalDocument', 'Object'],
    '@id': 'id:R0SlWhyX2_sAAAAAAAAABg',
    url: 'https://link-url',
    icon: {
      '@type': 'Image',
      url: 'https://icon-url',
    },
    image: {
      '@type': 'Image',
      url: 'https://image-url',
    },
    name: 'Happy Guy.gif',
    'atlassian:fileSize': 169619,
    'schema:fileFormat': 'image/gif',
    updated: '2022-06-30T00:06:16Z',
    'atlassian:isDeleted': false,
    'atlassian:downloadUrl': 'https://download-url',
    'schema:potentialAction': [
      {
        '@type': 'DownloadAction',
        name: 'Download',
        identifier: 'dropbox-object-provider',
      },
    ],
    preview: {
      '@type': 'Link',
      href: 'https://preview-url',
      'atlassian:supportedPlatforms': ['web'],
    },
    generator: {
      '@type': 'Application',
      name: 'Dropbox',
      icon: {
        '@type': 'Image',
        url: 'https://icon-url',
      },
    },
    context: {
      '@type': 'Collection',
      name: 'Dropbox',
    },
  },
} as JsonLd.Response;
