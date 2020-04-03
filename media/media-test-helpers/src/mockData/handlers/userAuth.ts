import { Auth } from '@atlaskit/media-core';
import { MockRequest, MockResponse } from 'xhr-mock';
import { exactMatch, fillInResponse, MockContext } from '../';
import { userAuthProviderBaseURL } from '../../userAuthProvider';

export const userAuth = (context: () => MockContext) => (
  req: MockRequest,
  res: MockResponse,
): MockResponse | undefined => {
  const data = {
    method: 'GET',
    url: {
      path: '/media-playground/api/token/user/impersonation',
      query: {},
    },
    headers: {
      accept: 'application/json, text/plain, */*',
    },
    body: null,
  };

  if (exactMatch(req, data)) {
    const clientId = '866af8a6-7d6d-458e-84fb-a1e44f648fec';
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnREZXRhaWxzIjp7ImNsaWVudFR5cGUiOiJ1c2VyIiwidXNlcklkIjoiNjU1MzYyOmI5ZTBlMGI1LWM2MzktNGZjYi05NmYyLTA2ZmU2YWU3OTRiZSIsInVzZXJJZFR5cGUiOiJhaWQifSwiYWNjZXNzIjp7InVybjpmaWxlc3RvcmU6Y29sbGVjdGlvbjpyZWNlbnRzIjpbInVwZGF0ZSIsInJlYWQiXSwidXJuOmZpbGVzdG9yZTpjaHVuazoqIjpbImNyZWF0ZSIsInJlYWQiXSwidXJuOmZpbGVzdG9yZTp1cGxvYWQiOlsiY3JlYXRlIl0sInVybjpmaWxlc3RvcmU6dXBsb2FkOioiOlsicmVhZCIsInVwZGF0ZSIsImRlbGV0ZSJdfSwibmJmIjoxNTE5MDkwMDc2LCJleHAiOjE1MTkwOTM2NzYsImlhdCI6MTUxOTA5MDEzNywiaXNzIjoiODY2YWY4YTYtN2Q2ZC00NThlLTg0ZmItYTFlNDRmNjQ4ZmVjIn0.Y3paoakNmCNS13BpRvi6ZdsPd6QYFF1v-kwMwX-qJmQ';
    const resdata = {
      status: 200,
      reason: 'OK',
      headers: {
        'access-control-allow-origin': '*',
        date: 'Tue, 20 Feb 2018 00',
        connection: 'keep-alive',
        'x-powered-by': 'Express',
        etag: 'W/2a6-OxGoXpRvoAR8dw98y9Z92A',
        'content-length': '678',
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(<Auth>{
        token,
        clientId,
        baseUrl: userAuthProviderBaseURL,
      }),
    };
    context().userContext.auth = {
      clientId,
      token,
      baseUrl: userAuthProviderBaseURL,
    };
    fillInResponse(res, resdata);
    return res;
  }

  return undefined;
};
