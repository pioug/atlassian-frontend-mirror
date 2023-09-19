import { JsonLd } from 'json-ld-types';

export default {
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
        url: 'https://icon-url',
      },
    },
    '@type': ['Object', 'atlassian:Project'],
    url: 'https://link-url',
    icon: {
      '@type': 'Image',
      url: 'https://icon-url',
    },
    name: 'The Superman Project',
    summary: 'The journey to discover the real identity of Superman?',
    'atlassian:state': {
      '@type': 'Object',
      name: 'On track',
      appearance: 'success',
    },
    attributedTo: [
      {
        name: 'Lois Lane',
        icon: 'https://person-url',
      },
    ],
    'atlassian:updatedBy': [
      {
        name: 'Clark Ken',
        icon: 'https://person-url',
      },
    ],
    preview: {
      '@type': 'Link',
      href: 'https://preview-url',
    },
    'schema:commentCount': 1,
    'atlassian:subscriberCount': 109,
    endTime: '2030-12-31',
    updated: '2023-03-05T08:00:00.861423',
    'atlassian:serverAction': [
      {
        '@type': 'UpdateAction',
        name: 'UpdateAction',
        dataUpdateAction: {
          '@type': 'UpdateAction',
          name: 'FollowEntityAction',
        },
        resourceIdentifiers: {
          ari: 'some-id',
        },
        refField: 'button',
      },
    ],
  },
} as JsonLd.Response;
