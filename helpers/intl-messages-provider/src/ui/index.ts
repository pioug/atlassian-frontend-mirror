/**
 * @deprecated Volt migration shim. Import from the explicit subpath instead:
 * `import IntlMessagesProvider from '@atlaskit/intl-messages-provider/main'`.
 * This entry-point re-export is retained only while consumers migrate off it.
 */
export { default } from './main';
export type { IntlMessagesProviderProps } from './types';
export type { I18NMessages } from '../common/types';
