// Root barrel: retained for backwards compatibility with prebuilt/published consumers
// that still import from the package root (e.g. `import { IntlMessagesProvider } from
// '@atlaskit/intl-messages-provider'`). New code should prefer the explicit subpath exports:
//   import IntlMessagesProvider from '@atlaskit/intl-messages-provider/main';
//   import { createAsyncIntlProvider } from '@atlaskit/intl-messages-provider/async';
//   import type { I18NMessages } from '@atlaskit/intl-messages-provider/types';
export { default as IntlMessagesProvider } from './ui/main';
export type { IntlMessagesProviderProps } from './ui/types';
export type { I18NMessages } from './common/types';
