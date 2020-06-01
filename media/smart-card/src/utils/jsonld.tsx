import { JsonLd } from 'json-ld-types';

export const getEmptyJsonLd = (): JsonLd.Data.BaseData => ({
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@type': 'Object',
});

export const getUnauthorizedJsonLd = (): JsonLd.Response => ({
  meta: {
    visibility: 'restricted',
    access: 'unauthorized',
    auth: [],
    definitionId: 'provider-not-found',
  },
  data: {
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    '@type': 'Object',
  },
});
