import { JsonLd } from '../client/types';
import CardClient from '../client';

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
    },
  } as JsonLd,
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
  } as JsonLd,
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
  } as JsonLd,
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
  } as JsonLd,
};
export const fakeResponse = () => Promise.resolve(mocks.success);

export const fakeFactory: any = (implementation: () => Promise<JsonLd>) =>
  class CustomClient extends CardClient {
    async fetchData() {
      return await implementation();
    }
  };

export const waitFor = (time = 1) => new Promise(res => setTimeout(res, time));
