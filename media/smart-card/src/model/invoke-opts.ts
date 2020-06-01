import { JsonLd } from 'json-ld-types';
import { CardInnerAppearance } from '../view/Card/types';

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
export interface ServerActionOpts {
  type: string;
  payload: ServerActionPayload;
}
export interface ServerActionPayload {
  id: string;
  context?: JsonLd.Primitives.Object | JsonLd.Primitives.Link;
}
export interface ClientActionOpts {
  type: string;
  promise: () => Promise<void>;
}
