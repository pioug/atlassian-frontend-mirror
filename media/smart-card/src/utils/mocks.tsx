import CardClient from '../client';
import { JsonLd } from 'json-ld-types';

export const mocks = {
  success: {
    meta: {
      visibility: 'public',
      access: 'granted',
      auth: [],
      definitionId: 'd1',
      key: 'object-provider',
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Object',
      name: 'I love cheese',
      summary: 'Here is your serving of cheese: 🧀',
      'schema:potentialAction': {
        '@id': 'comment',
        '@type': 'CommentAction',
        identifier: 'object-provider',
        name: 'Comment',
      },
      preview: {
        href: 'https://www.ilovecheese.com',
      },
      url: 'https://some.url',
    },
  } as JsonLd.Response,
  notFound: {
    meta: {
      visibility: 'not_found',
      access: 'forbidden',
      auth: [],
      definitionId: 'd1',
      key: 'object-provider',
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Object',
      name: 'I love cheese',
      url: 'https://some.url',
    },
  } as JsonLd.Response,
  forbidden: {
    meta: {
      visibility: 'restricted',
      access: 'forbidden',
      auth: [
        {
          key: 'some-flow',
          displayName: 'Flow',
          url: 'https://outbound-auth/flow',
        },
      ],
      definitionId: 'd1',
      key: 'object-provider',
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Object',
      name: 'I love cheese',
      url: 'https://some.url',
    },
  } as JsonLd.Response,
  unauthorized: {
    meta: {
      visibility: 'restricted',
      access: 'unauthorized',
      auth: [
        {
          key: 'some-flow',
          displayName: 'Flow',
          url: 'https://outbound-auth/flow',
        },
      ],
      definitionId: 'd1',
      key: 'object-provider',
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Object',
      name: 'I love cheese',
      url: 'https://some.url',
    },
  } as JsonLd.Response,
  actionSuccess: {
    meta: {
      visibility: 'public',
      access: 'granted',
      auth: [],
      definitionId: 'd1',
    },
    data: {
      status: 'CompletedStatus',
    },
  },
};
export const fakeResponse = () => Promise.resolve(mocks.success);

export const fakeFactory: any = (
  implementation: () => Promise<JsonLd.Response>,
  implementationPost: () => Promise<JsonLd.Response>,
  implementationPrefetch: () => Promise<JsonLd.Response | undefined>,
) =>
  class CustomClient extends CardClient {
    async fetchData() {
      return await implementation();
    }

    async postData() {
      return await implementationPost();
    }

    async prefetchData() {
      return await implementationPrefetch();
    }
  };

export const waitFor = (time = 1) =>
  new Promise((res) => setTimeout(res, time));
