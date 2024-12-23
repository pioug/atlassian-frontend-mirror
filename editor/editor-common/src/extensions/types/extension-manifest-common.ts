import { type ComponentType } from 'react';

export type ESModule<T> = {
	__esModule?: boolean;
	default: T;
};
export type MaybeESModule<T> = ESModule<T> | T;
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtensionIcon = ComponentType<React.PropsWithChildren<any>>;
export type ExtensionIconModule = Promise<MaybeESModule<ExtensionIcon>>;
