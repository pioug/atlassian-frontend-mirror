import { JsonLd } from 'json-ld-types';

import { CardClient } from '@atlaskit/link-provider';

import { mockJqlSmartLinkData } from './mockJqlSmartLinkData';
import { mocks } from './mockSmartLinkData';

const jqlUrlRegExp = /.+[jql=].+/;

class SmartLinkClient extends CardClient {
  fetchData(url: string): Promise<JsonLd.Response> {
    switch (url) {
      case 'https://product-fabric.atlassian.net/browse/EDM-5941':
      case 'https://product-fabric.atlassian.net/browse/EDM-5591':
        return Promise.resolve(mocks.resolved);
      case 'https://link-that-does-not-resolve.com':
        return Promise.reject(`Can't resolve from ${url}`);
      case jqlUrlRegExp.test(url) ? url : undefined:
        return Promise.resolve(mockJqlSmartLinkData.resolved);
      default:
        return Promise.resolve(mocks.unauthorized);
    }
  }
}

export default SmartLinkClient;
