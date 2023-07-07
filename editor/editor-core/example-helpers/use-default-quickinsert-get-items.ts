import React from 'react';
import { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import {
  QuickInsertItem,
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';

import { useStateFromPromise } from '../src/utils/react-hooks/use-state-from-promise';
import EditorActions from '../src/actions';
import { extensionProviderToQuickInsertProvider } from '../src/utils/extensions';
import { searchQuickInsertItems } from '../src/plugins/quick-insert/search';
import { getExampleExtensionProviders } from './get-example-extension-providers';

const ACTIONS = {} as EditorActions;
const EMPTY: any[] = [];

const useDefaultQuickInsertProvier = (providers: ExtensionProvider) => {
  const [quickInsertProvider] = useStateFromPromise<QuickInsertProvider>(
    () => extensionProviderToQuickInsertProvider(providers, ACTIONS),
    [providers],
  );

  return quickInsertProvider;
};

export const useDefaultQuickInsertGetItems = () => {
  const providers = React.useMemo(() => getExampleExtensionProviders(), []);
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
