import { ComponentType } from 'react';

export type ESModule<T> = {
  __esModule?: boolean;
  default: T;
};
export type MaybeESModule<T> = ESModule<T> | T;
export type ExtensionIcon = ComponentType<any>;
export type ExtensionIconModule = Promise<MaybeESModule<ExtensionIcon>>;
