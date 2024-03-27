import { JsonLd } from 'json-ld-types';

import { CardClient } from '@atlaskit/link-provider';
import { APIError } from '@atlaskit/linking-common';

import { mockJqlSmartLinkData } from './mockJqlSmartLinkData';
import { mocks } from './mockSmartLinkData';

const jqlUrlRegExp = /.+[jql=].+/;

const mockedFetch = (url: string): Promise<JsonLd.Response> => {
  switch (url) {
    case 'https://product-fabric.atlassian.net/browse/EDM-5941':
    case 'https://product-fabric.atlassian.net/browse/EDM-5591':
      return Promise.resolve(mocks.resolved);
    case 'https://link-that-does-not-resolve.com':
      return Promise.reject(`Can't resolve from ${url}`);
    case 'https://link-that-is-still-resolving.com/long-url/very-very-very-very-very-very-very-long':
      return new Promise(() => {});
    case 'https://link-that-is-unauthorized.com':
      return Promise.resolve(mocks.unauthorized);
    case 'https://link-that-is-not-found.com/long':
      return Promise.resolve(mocks.notFound);
    case 'https://link-that-is-forbidden.com':
      return Promise.resolve(mocks.forbidden);
    case 'https://link-that-is-unsupported.com':
      throw new APIError(
        'fatal',
        new URL(url).hostname,
        'received unsupported error',
        'ResolveUnsupportedError',
      );
    case jqlUrlRegExp.test(url) ? url : undefined:
      return Promise.resolve(mockJqlSmartLinkData.resolved);
    default:
      return Promise.resolve(mocks.unauthorized);
  }
};

class SmartLinkClient extends CardClient {
  prefetchData = mockedFetch;
  fetchData = mockedFetch;
}

export default SmartLinkClient;
