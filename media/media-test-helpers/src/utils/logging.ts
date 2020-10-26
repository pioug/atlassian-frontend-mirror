import { Database, KakapoResponse } from 'kakapo';

import { MediaDatabaseSchema } from '../mocks/database';

export interface LogRequestParams {
  path: string;
  method: string;
  request: any;
  response: KakapoResponse;
  error?: any;
  database?: any;
}

export enum WsDirection {
  Upstream = 'UP',
  Downstream = 'DOWN',
}

export interface LogWsMessageParams {
  url: string;
  dir: WsDirection;
  type: string;
  payload?: any;
  database?: Database<MediaDatabaseSchema>;
}

export function logRequest(params: LogRequestParams) {
  const { path, method, request, response, error, database } = params;

  // eslint-disable-next-line no-console
  console.log('MOCK', path, {
    method,
    request,
    response,
    error,
    database,
  });
}

export function logWsMessage(params: LogWsMessageParams) {
  const { url, dir, type, payload, database } = params;

  // eslint-disable-next-line no-console
  console.log(`MOCK WS:${dir}`, url, {
    type,
    payload,
    database,
  });
}
