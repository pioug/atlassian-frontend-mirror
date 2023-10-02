import { CardClient } from '@atlaskit/link-provider';
import { Client } from '@atlaskit/smart-card';
import { JsonLd } from 'json-ld-types';
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

export class ForbiddenClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.forbidden);
  }
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "FORBIDDEN",
export class ForbiddenWithImageClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.forbiddenCrossJoin('FORBIDDEN', 'not_found'));
  }
}

// "visibility": "restricted",
// "access": "forbidden",
// "accessType": "ACCESS_EXISTS",
export class ForbiddenWithObjectRequestAccessClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(
      mocks.forbiddenCrossJoin('ACCESS_EXISTS', 'restricted'),
    );
  }
}

export class ForbiddenWithSiteDeniedRequestClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.forbiddenCrossJoin('DENIED_REQUEST_EXISTS'));
  }
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "DIRECT_ACCESS",
export class ForbiddenWithSiteDirectAccessClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(
      mocks.forbiddenCrossJoin('DIRECT_ACCESS', 'not_found'),
    );
  }
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "PENDING_REQUEST_EXISTS",
export class ForbiddenWithSitePendingRequestClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(
      mocks.forbiddenCrossJoin('PENDING_REQUEST_EXISTS', 'not_found'),
    );
  }
}

// "visibility": "not_found",
// "access": "forbidden",
// "accessType": "REQUEST_ACCESS",
export class ForbiddenWithSiteRequestAccessClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(
      mocks.forbiddenCrossJoin('REQUEST_ACCESS', 'not_found'),
    );
  }
}

export class NotFoundClient extends CardClient {
  fetchData(): Promise<JsonLd.Response> {
    return Promise.resolve(mocks.notFound);
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
