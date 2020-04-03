import { exactMatch, fillInResponse, MockContext } from '..';
import { userAuthProviderBaseURL } from '../..';
import { MockRequest, MockResponse } from 'xhr-mock';
import { Auth } from '@atlaskit/media-core';

export const tenantAuth = (context: () => MockContext) => (
  req: MockRequest,
  res: MockResponse,
): MockResponse | undefined => {
  const bodyPerms: { access: { [resource: string]: string[] } } = {
    access: {
      'urn:filestore:chunk:*': ['create', 'read'],
      'urn:filestore:upload': ['create'],
      'urn:filestore:upload:*': ['read', 'update'],
    },
  };
  bodyPerms.access[
    `urn:filestore:collection:${context().tenantContext.collectionName}`
  ] = ['read', 'insert'];
  const data1 = {
    method: 'POST',
    url: {
      path: '/media-playground/api/token/tenant',
      query: {
        collection: context().tenantContext.collectionName,
        environment: '',
      },
    },
    headers: {
      accept: 'application/json, text/plain, */*',
      'content-type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(bodyPerms),
  };

  const data2 = {
    method: 'GET',
    url: {
      path: '/media-playground/api/token/tenant',
      query: {
        collection: context().tenantContext.collectionName,
        environment: '',
      },
    },
    headers: {
      accept: 'application/json, text/plain, */*',
    },
    body: null,
  };

  if (exactMatch(req, data1) || exactMatch(req, data2)) {
    const clientId = '5a9812fc-d029-4a39-8a46-d3cc36eed7ab';
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTUzNjI6YjllMGUwYjUtYzYzOS00ZmNiLTk2ZjItMDZmZTZhZTc5NGJlIiwiYWNjZXNzIjp7InVybjpmaWxlc3RvcmU6Y29sbGVjdGlvbjpNZWRpYVNlcnZpY2VzU2FtcGxlIjpbInJlYWQiLCJpbnNlcnQiXSwidXJuOmZpbGVzdG9yZTpjaHVuazoqIjpbImNyZWF0ZSIsInJlYWQiXSwidXJuOmZpbGVzdG9yZTp1cGxvYWQiOlsiY3JlYXRlIl0sInVybjpmaWxlc3RvcmU6dXBsb2FkOioiOlsicmVhZCIsInVwZGF0ZSJdfSwibmJmIjoxNTE5MDkwMDc2LCJleHAiOjE1MTkwOTM2NzYsImlhdCI6MTUxOTA5MDEzNiwiaXNzIjoiNWE5ODEyZmMtZDAyOS00YTM5LThhNDYtZDNjYzM2ZWVkN2FiIn0.7Qr_rZfVLFEBgi5u0xPhjDRCxml75MxDObAhHSnadL4';
    const resdata = {
      status: 200,
      reason: 'OK',
      headers: {
        'access-control-allow-origin': '*',
        date: 'Mon, 19 Feb 2018 23',
        connection: 'keep-alive',
        'x-powered-by': 'Express',
        etag: 'W/25a-6ea8ENhURYqK8jk0lAhNFg',
        'content-length': '602',
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(<Auth>{
        token,
        clientId,
        baseUrl: userAuthProviderBaseURL,
      }),
    };
    context().tenantContext.auth = {
      clientId,
      token,
      baseUrl: userAuthProviderBaseURL,
    };
    fillInResponse(res, resdata);
    return res;
  }

  return undefined;
};
