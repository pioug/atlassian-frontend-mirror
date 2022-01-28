// new child entry point ./utils/index.ts

export type {
  ADDoc, // temporarily keep for confluence
  ADNode, // temporarily keep for confluence
} from './utils';

export type {
  ExtensionHandler, // temporarily keep for confluence
  ExtensionHandlers, // temporarily keep for confluence
  ExtensionParams, // temporarily keep for confluence
} from './extensions';

export type { ContextIdentifierProvider } from './provider-factory/context-identifier-provider'; // temporarily keep for confluence
export type { SearchProvider } from './provider-factory';
export { ProviderFactory, WithProviders } from './provider-factory'; // temporarily keep for confluence

export {
  WidthConsumer, // temporarily keep for confluence
  WidthProvider, // temporarily keep for confluence
} from './ui';

export type {
  EventHandlers, // temporarily keep for confluence
  LinkEventClickHandler, // temporarily keep for confluence
  MentionEventHandler, // temporarily keep for confluence
  SmartCardEventClickHandler, // temporarily keep for confluence
} from './ui';
