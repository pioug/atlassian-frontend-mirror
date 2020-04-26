import { JsonLd } from 'json-ld-types';
import Environments from '../utils/environments';
import { CardInnerAppearance } from '../view/Card/types';

export interface CardClient {
  fetchData(url: string): Promise<JsonLdCustom>;
  postData(data: InvokePayload<ServerActionOpts>): Promise<JsonLd.Response>;
}

export interface CardRequest {
  resourceUrl: string;
  context?: string;
}

export interface CardRequestBatch {
  resourceUrls: CardRequest[];
}

export type JsonLdAuth = {
  key: string;
  displayName: string;
  url: string;
};

export type JsonLdVisibility = 'public' | 'restricted' | 'other' | 'not_found';

export type JsonLdAccess = 'granted' | 'unauthorized' | 'forbidden';

export type JsonLdBatch = Array<JsonLdResponse>;
export type JsonLdResponse = {
  status: number;
  body: JsonLdCustom;
};

export type JsonLdCustom = {
  meta: {
    visibility: JsonLdVisibility;
    access: JsonLdAccess;
    auth: JsonLdAuth[];
    definitionId: string;
  };
  data?: {
    [name: string]: any;
  };
};

export type ClientEnvironment = {
  baseUrl: string;
  resolverUrl: string;
};

export type EnvironmentsKeys = keyof typeof Environments;

export interface ServerError {
  message: string;
  name: string;
  resourceUrl: string;
  status: number;
}

export const isServerError = (obj: any) =>
  'message' in obj && 'name' in obj && 'resourceUrl' in obj && 'status' in obj;

export type InvokeType = 'server' | 'client';

export interface InvokePayload<T> {
  key: string;
  context?: string;
  action: T;
}
export type InvokeOpts<T> = {
  type: InvokeType;
  source?: CardInnerAppearance;
} & InvokePayload<T>;

export type InvokeClientOpts = InvokeOpts<ClientActionOpts> & {
  type: 'client';
};
export type InvokeServerOpts = InvokeOpts<ServerActionOpts> & {
  type: 'server';
};

export type InvokeHandler = (
  opts: InvokeClientOpts | InvokeServerOpts,
) => Promise<JsonLd.Response | void>;

export interface ServerActionOpts {
  type: string;
  payload: ActionPayload;
}
export interface ClientActionOpts {
  type: string;
  promise: () => Promise<void>;
}

export interface ActionPayload {
  id: string;
  context?: JsonLd.Primitives.Object | JsonLd.Primitives.Link;
}
