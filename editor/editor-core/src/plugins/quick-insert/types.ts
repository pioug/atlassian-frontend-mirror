import { InjectedIntl } from 'react-intl';

import {
  QuickInsertItem,
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';

import { EmptyStateHandler } from '../../types/empty-state-handler';

export type {
  QuickInsertActionInsert,
  QuickInsertItem,
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';

export type QuickInsertOptions =
  | boolean
  | {
      provider: Promise<QuickInsertProvider>;
    };

export type QuickInsertHandler =
  | Array<QuickInsertItem>
  | ((intl: InjectedIntl) => Array<QuickInsertItem>);

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
