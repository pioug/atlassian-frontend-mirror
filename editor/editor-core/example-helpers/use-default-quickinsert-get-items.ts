import React from 'react';
import {
  combineExtensionProviders,
  ExtensionProvider,
} from '@atlaskit/editor-common/extensions';
import {
  QuickInsertItem,
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';

import { useStateFromPromise } from '../src/utils/react-hooks/use-state-from-promise';
import EditorActions from '../src/actions';
import { extensionProviderToQuickInsertProvider } from '../src/utils/extensions';
import { getConfluenceMacrosExtensionProvider } from '../example-helpers/confluence-macros';
import { searchQuickInsertItems } from '../src/plugins/quick-insert/search';
import { getXProductExtensionProvider } from './fake-x-product-extensions';

const ACTIONS = {} as EditorActions;
const EMPTY: any[] = [];

const useDefaultExtensibilityProviders = () => {
  const [macroProvider] = useStateFromPromise(
    () => getConfluenceMacrosExtensionProvider(ACTIONS),
    [],
  );

  const extensionProvider = React.useMemo(getXProductExtensionProvider, []);
  return React.useMemo(
    () =>
      combineExtensionProviders(
        macroProvider
          ? [macroProvider, extensionProvider]
          : [extensionProvider],
      ),
    [macroProvider, extensionProvider],
  );
};

const useDefaultQuickInsertProvier = (providers: ExtensionProvider) => {
  const [quickInsertProvider] = useStateFromPromise<QuickInsertProvider>(
    () => extensionProviderToQuickInsertProvider(providers, ACTIONS),
    [providers],
  );

  return quickInsertProvider;
};

export const useDefaultQuickInsertGetItems = () => {
  const providers = useDefaultExtensibilityProviders();
  const quickInsertProvider = useDefaultQuickInsertProvier(providers);

  const [items] = useStateFromPromise<QuickInsertItem[]>(
    () => quickInsertProvider?.getItems() ?? Promise.resolve(EMPTY),
    [quickInsertProvider],
    [],
  );

  return React.useCallback(
    (query?: string, category?: string) =>
      searchQuickInsertItems(
        {
          isElementBrowserModalOpen: true,
          lazyDefaultItems: () => items || [],
        },
        {},
      )(query, category),
    [items],
  );
};
