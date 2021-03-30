import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill

import fetchMock from 'fetch-mock/cjs/client';

import { requestService } from '../serviceUtils';
import {
  RefreshSecurityProvider,
  RequestServiceOptions,
  SecurityProvider,
  ServiceConfig,
} from '../types';

const url = 'http://cheese';
const defaultResponse = {
  cheese: 'cheddar',
};

const securityProvider: SecurityProvider = () => ({
  params: {
    bacon: 'nice',
  },
  headers: {
    'X-Cheese': 'american',
  },
});

const refreshedSecurityProvider: RefreshSecurityProvider = () =>
  Promise.resolve({
    params: {
      bacon: 'crispy',
    },
    headers: {
      'X-Cheese': 'swiss',
    },
  });

describe('requestService', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('minimal config/params', () => {
    fetchMock.mock({
      matcher: `begin:${url}`,
      response: defaultResponse,
    });
    const serviceConfig: ServiceConfig = {
      url,
    };
    return requestService(serviceConfig).then(response => {
      expect(response).toEqual(defaultResponse);
    });
  });

  it('max config/params', () => {
    fetchMock.mock({
      matcher: `begin:${url}`,
      response: defaultResponse,
      name: 'request',
    });
    const serviceConfig: ServiceConfig = {
      url,
      securityProvider,
      refreshedSecurityProvider,
    };
    const options: RequestServiceOptions = {
      path: 'burger',
      queryParams: {
        sauce: 'tomato',
      },
      requestInit: {
        method: 'POST',
      },
    };
    return requestService(serviceConfig, options).then(response => {
      expect(response).toEqual(defaultResponse);
      const calls = fetchMock.calls('request');
      expect(calls.length).toEqual(1);
      const url = calls[0][0];
      const { headers, method } = calls[0][1];
      const xCheeseHeader = headers['X-Cheese'];
      expect(xCheeseHeader).not.toEqual(undefined);
      expect(xCheeseHeader).toEqual('american');
      expect(url.indexOf(url)).toEqual(0);
      expect(url.indexOf('sauce=tomato') >= 0).toEqual(true);
      expect(url.indexOf('bacon=nice') >= 0).toEqual(true);
      expect(method).toEqual('POST');
    });
  });

  it('retry on 401/no refresh support', () => {
    fetchMock.mock({
      matcher: `begin:${url}`,
      response: 401,
      name: 'request',
    });
    const serviceConfig: ServiceConfig = {
      url,
    };
    return requestService(serviceConfig).catch(error => {
      const calls = fetchMock.calls('request');
      expect(calls.length).toEqual(1);
      expect(error.code).toEqual(401);
    });
  });

  it('retry on 401/refresh support', () => {
    fetchMock
      .mock({
        matcher: `begin:${url}`,
        response: 401,
        name: '401',
        repeat: 1,
      })
      .mock({
        matcher: `begin:${url}`,
        response: defaultResponse,
        name: 'request',
      });
    const serviceConfig: ServiceConfig = {
      url,
      securityProvider,
      refreshedSecurityProvider,
    };
    return requestService(serviceConfig).then(() => {
      const refreshCalls = fetchMock.calls('request');
      expect(refreshCalls.length).toEqual(1);
      const url = refreshCalls[0][0];
      const { headers } = refreshCalls[0][1];

      const xCheeseHeader = headers['X-Cheese'];
      expect(xCheeseHeader).not.toEqual(undefined);
      expect(xCheeseHeader).toEqual('swiss');
      expect(url.indexOf(url)).toEqual(0);
      expect(url.indexOf('bacon=crispy') >= 0).toEqual(true);
    });
  });

  it('handles 204 responses', () => {
    fetchMock.mock({
      matcher: `begin:${url}`,
      response: 204,
      name: 'request',
    });
    const serviceConfig: ServiceConfig = {
      url,
    };
    return requestService(serviceConfig)
      .then(() => expect(true).toEqual(true))
      .catch(() => expect(false).toEqual(true)); // should not error
  });
  it('builds URLs when path is absolute', () => {
    fetchMock.mock({
      matcher: `begin:${url}`,
      response: 204,
      name: 'request',
    });
    const serviceConfig: ServiceConfig = {
      url,
    };
    const options: RequestServiceOptions = {
      path: '/path',
    };
    return requestService(serviceConfig, options).then(() => {
      const refreshCalls = fetchMock.calls('request');
      expect(refreshCalls.length).toEqual(1);
      const url = refreshCalls[0][0];

      expect(url).toEqual('http://cheese/path');
    });
  });
});
