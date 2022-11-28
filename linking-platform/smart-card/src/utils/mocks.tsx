import { CardClient } from '@atlaskit/link-provider';
import { JsonLd } from 'json-ld-types';
import { AnalyticsFacade } from '../state/analytics';

export const mockContext = {
  '@vocab': 'https://www.w3.org/ns/activitystreams#',
  atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
  schema: 'http://schema.org/',
} as const;

export const mockByUrl = (url: string) => {
  return {
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
      name: url,
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
      url: url,
    },
  } as JsonLd.Response;
};

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
  analytics: {
    status: 'resolved',
    details: {
      meta: {
        definitionId: 'spaghetti-id',
        key: 'spaghetti-key',
        resourceType: 'spaghetti-resource',
        subproduct: 'spaghetti-subproduct',
        product: 'spaghetti-product',
      },
    },
  },
};
export const fakeResponse = () => Promise.resolve(mocks.success);

export const fakeFactory: any = (
  implementation: (url: string) => Promise<JsonLd.Response>,
  implementationPost: () => Promise<JsonLd.Response>,
  implementationPrefetch: () => Promise<JsonLd.Response | undefined>,
) =>
  class CustomClient extends CardClient {
    async fetchData(url: string) {
      return await implementation(url);
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

export const mockAnalytics = {
  ui: {
    buttonClickedEvent: () => {},
    modalClosedEvent: () => {},
    renderSuccessEvent: () => {},
    renderFailedEvent: () => {},
  },
  operational: {},
  track: {},
  screen: {
    modalViewedEvent: () => {},
  },
} as unknown as AnalyticsFacade;
