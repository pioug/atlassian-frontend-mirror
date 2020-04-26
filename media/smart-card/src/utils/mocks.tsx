import { JsonLdCustom } from '../client/types';
import CardClient from '../client';
import { JsonLd } from 'json-ld-types';

export const mocks = {
  success: {
    meta: {
      visibility: 'public',
      access: 'granted',
      auth: [],
      definitionId: 'd1',
    },
    data: {
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
    },
  } as JsonLdCustom,
  notFound: {
    meta: {
      visibility: 'not_found',
      access: 'forbidden',
      auth: [],
      definitionId: 'd1',
    },
    data: {
      name: 'I love cheese',
    },
  } as JsonLdCustom,
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
    },
    data: {
      name: 'I love cheese',
    },
  } as JsonLdCustom,
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
    },
    data: {
      name: 'I love cheese',
    },
  } as JsonLdCustom,
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
  implementation: () => Promise<JsonLdCustom>,
  implementationPost: () => Promise<JsonLd.Response>,
) =>
  class CustomClient extends CardClient {
    async fetchData() {
      return await implementation();
    }

    async postData() {
      return await implementationPost();
    }
  };

export const waitFor = (time = 1) => new Promise(res => setTimeout(res, time));
