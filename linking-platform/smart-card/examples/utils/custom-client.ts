import { JsonLd } from 'json-ld-types';
import { CardClient } from '@atlaskit/link-provider';
import { mocks, overrideEmbedContent } from './common';
import { iconGoogleDrive } from '../images';
import { AtlasProject } from '../../examples-helpers/_jsonLDExamples';
import { Client } from '@atlaskit/smart-card';

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
