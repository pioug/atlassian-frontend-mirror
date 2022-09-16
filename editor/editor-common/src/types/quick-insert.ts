import { IntlShape } from 'react-intl-next';

import type { QuickInsertItem, QuickInsertProvider } from '../provider-factory';

import type { EmptyStateHandler } from './empty-state-handler';

export type {
  QuickInsertActionInsert,
  QuickInsertItem,
  QuickInsertProvider,
} from '../provider-factory';

export type QuickInsertOptions =
  | boolean
  | {
      provider: Promise<QuickInsertProvider>;
    };

export type QuickInsertHandler =
  | Array<QuickInsertItem>
  | ((intl: IntlShape) => Array<QuickInsertItem>);

export type IconProps = {
  label?: string;
};

export type QuickInsertPluginState = {
  isElementBrowserModalOpen: boolean;
  lazyDefaultItems: () => QuickInsertItem[];
  providedItems?: QuickInsertItem[];
  provider?: QuickInsertProvider;
  emptyStateHandler?: EmptyStateHandler;
};

export type QuickInsertPluginStateKeys = keyof QuickInsertPluginState;
export interface QuickInsertPluginOptions {
  headless?: boolean;
  disableDefaultItems?: boolean;
  enableElementBrowser?: boolean;
  elementBrowserHelpUrl?: string;
  emptyStateHandler?: EmptyStateHandler;
}
