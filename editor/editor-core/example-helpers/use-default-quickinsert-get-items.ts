import React from 'react';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import type {
  QuickInsertItem,
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';

import { useStateFromPromise } from '../src/utils/react-hooks/use-state-from-promise';
import type EditorActions from '../src/actions';
import { extensionProviderToQuickInsertProvider } from '../src/utils/extensions';
import { getQuickInsertSuggestions } from '@atlaskit/editor-common/quick-insert';
import { getExampleExtensionProviders } from './get-example-extension-providers';

const ACTIONS = {} as EditorActions;
const EMPTY: any[] = [];

const useDefaultQuickInsertProvider = (providers: ExtensionProvider) => {
  const [quickInsertProvider] = useStateFromPromise<QuickInsertProvider>(
    () => extensionProviderToQuickInsertProvider(providers, ACTIONS),
    [providers],
  );

  return quickInsertProvider;
};

export const useDefaultQuickInsertGetItems = () => {
  const providers = React.useMemo(() => getExampleExtensionProviders(), []);
  const quickInsertProvider = useDefaultQuickInsertProvider(providers);

  const [items] = useStateFromPromise<QuickInsertItem[]>(
    () => quickInsertProvider?.getItems() ?? Promise.resolve(EMPTY),
    [quickInsertProvider],
    [],
  );

  return React.useCallback(
    (query?: string, category?: string) =>
      getQuickInsertSuggestions({
        searchOptions: {
          query,
          category,
        },
        lazyDefaultItems: () => items || [],
      }),
    [items],
  );
};
