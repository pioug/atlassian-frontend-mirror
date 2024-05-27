import { CardClient } from '@atlaskit/link-provider';
import { Client } from '@atlaskit/smart-card';
import { type JsonLd } from 'json-ld-types';
import { AtlasProject } from '../../examples-helpers/_jsonLDExamples';
import { iconGoogleDrive } from '../images';
import { mocks, overrideEmbedContent } from './common';

export class ResolvedClient extends Client {
  fetchData(url: string) {
    const response = { ...AtlasProject };
    response.data.preview.href = overrideEmbedContent;
    return Promise.resolve(response as JsonLd.Response);
  }
}

export class ErroredClient extends CardClient {
  fetchData(url: string): Promise<JsonLd.Response> {
    return Promise.reject(`Can't resolve from ${url}`);
  }
}

// "visibility": "restricted",
// "access": "forbidden",
export class ForbiddenClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.forbidden);
  }
}

// "visibility": "restricted",
// "access": "forbidden",
// "accessType": "ACCESS_EXISTS",
export class ForbiddenWithObjectRequestAccessClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.unresolved('ACCESS_EXISTS', 'restricted'));
  }
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "DENIED_REQUEST_EXISTS",
export class ForbiddenWithSiteDeniedRequestClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(
      mocks.unresolved('DENIED_REQUEST_EXISTS', 'not_found'),
    );
  }
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "DIRECT_ACCESS",
export class ForbiddenWithSiteDirectAccessClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.unresolved('DIRECT_ACCESS', 'not_found'));
  }
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "FORBIDDEN",
export class ForbiddenWithSiteForbiddenClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.unresolved('FORBIDDEN', 'not_found'));
  }
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "PENDING_REQUEST_EXISTS",
export class ForbiddenWithSitePendingRequestClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(
      mocks.unresolved('PENDING_REQUEST_EXISTS', 'not_found'),
    );
  }
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "REQUEST_ACCESS",
export class ForbiddenWithSiteRequestAccessClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.unresolved('REQUEST_ACCESS', 'not_found'));
  }
}

// visibility: 'not_found',
// access: 'forbidden',
export class NotFoundClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.notFound);
  }
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "ACCESS_EXISTS",
export class NotFoundWithSiteAccessExistsClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.unresolved('ACCESS_EXISTS', 'not_found'));
  }
}

export class UnAuthClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.unauthorized);
  }
}

export class UnAuthClientWithProviderImage extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    const response = {
      ...mocks.unauthorized,
      data: {
        ...mocks.unauthorized.data,
        generator: {
          ...((mocks.unauthorized.data as JsonLd.Data.BaseData)
            .generator as JsonLd.Primitives.Object),
          image: {
            '@type': 'Image',
            url: iconGoogleDrive,
          },
        },
      },
    };
    return Promise.resolve(response as JsonLd.Response);
  }
}

export class UnAuthClientWithNoAuthFlow extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve({
      ...mocks.unauthorized,
      meta: {
        ...mocks.unauthorized.meta,
        auth: [],
      },
    } as JsonLd.Response);
  }
}
