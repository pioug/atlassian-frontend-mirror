import { type JsonLd } from 'json-ld-types';

const emptyData: JsonLd.Data.BaseData = {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@type': 'Object',
};

export const getEmptyJsonLd = (): JsonLd.Data.BaseData => emptyData;

export const getUnauthorizedJsonLd = (): JsonLd.Response => ({
  meta: {
    visibility: 'restricted',
    access: 'unauthorized',
    auth: [],
    definitionId: 'provider-not-found',
  },
  data: { ...emptyData },
});

export const getForbiddenJsonLd = (): JsonLd.Response => ({
  meta: {
    visibility: 'restricted',
    access: 'forbidden',
    auth: [],
    definitionId: 'provider-not-found',
  },
  data: { ...emptyData },
});
