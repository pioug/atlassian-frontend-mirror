// eslint-disable-next-line
import { JsonLd } from 'json-ld-types';
import { CardClient } from '@atlaskit/link-provider';

import { dropboxImage } from './images/dropbox';
import { forbidden } from './images/forbidden';
import { notFound } from './images/notFound';
import { unauthorized } from './images/unauthorized';

const mockData = {
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
      generator: {
        '@type': 'Application',
        name: 'Dropbox',
        icon: {
          '@type': 'Image',
          url: dropboxImage,
        },
        image: notFound,
      },
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
      generator: {
        '@type': 'Application',
        name: 'Dropbox',
        icon: {
          '@type': 'Image',
          url: dropboxImage,
        },
        image: forbidden,
      },
      url: 'https://some.url',
    },
  } as JsonLd.Response,
  unauthorized: {
    meta: {
      access: 'unauthorized',
      visibility: 'restricted',
      auth: [
        {
          key: 'some-flow',
          displayName: 'Flow',
          url: 'https://outbound-auth/flow',
        },
      ],
      definitionId: 'd1',
      key: 'google-object-provider',
      resourceType: 'file',
    },
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      '@type': 'Object',
      generator: {
        '@type': 'Application',
        name: 'Dropbox',
        icon: {
          '@type': 'Image',
          url: dropboxImage,
        },
        image: unauthorized,
      },
      url: 'https://some.url',
    },
  } as JsonLd.Response,
};

export class NotFoundClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mockData.notFound);
  }
}

export class ResolvingClient extends CardClient {
  private timeout;
  constructor(timeout: number) {
    super();
    this.timeout = timeout;
  }
  fetchData(): Promise<JsonLd.Response> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({} as JsonLd.Response);
      }, this.timeout);
    });
  }
}

export class ForbiddenClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mockData.forbidden);
  }
}

export class UnauthorizedClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mockData.unauthorized);
  }
}

export class ErroredClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    // @ts-expect-error negative test case
    return Promise.resolve({ data: null });
  }
}
