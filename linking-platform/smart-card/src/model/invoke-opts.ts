import { type InvokePayload, type ServerActionOpts } from '@atlaskit/linking-common';

import { type CardInnerAppearance } from '../view/Card/types';

export type InvokeType = 'server' | 'client';
export type InvokeOpts<T> = {
	source?: CardInnerAppearance;
	type: InvokeType;
} & InvokePayload<T>;
export type InvokeClientOpts = InvokeOpts<ClientActionOpts> & {
	type: 'client';
};
export type InvokeServerOpts = InvokeOpts<ServerActionOpts> & {
	type: 'server';
};
export interface ClientActionOpts {
	promise: () => Promise<void>;
	type: string;
}
