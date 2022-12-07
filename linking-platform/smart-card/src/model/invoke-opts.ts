import { InvokePayload, ServerActionOpts } from '@atlaskit/linking-common';
import { CardInnerAppearance } from '../view/Card/types';

export type InvokeType = 'server' | 'client';
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
export interface ClientActionOpts {
  type: string;
  promise: <T>(opts?: T) => Promise<void>;
}
