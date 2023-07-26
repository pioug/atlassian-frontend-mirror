import { JsonLd } from 'json-ld-types';
import { CardClient } from '@atlaskit/link-provider';
import { mocks } from './common';

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
