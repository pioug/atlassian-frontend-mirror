import React from 'react';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import type {
  QuickInsertItem,
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';

import { useStateFromPromise } from '../src/utils/react-hooks/use-state-from-promise';
import type EditorActions from '../src/actions';
import { extensionProviderToQuickInsertProvider } from '../src/utils/extensions';
import { getExampleExtensionProviders } from './get-example-extension-providers';
import { find } from '@atlaskit/editor-common/quick-insert';

import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import { usePresetContext } from '../src/presets/context';

type StackPlugins = [OptionalPlugin<ExtensionPlugin>];

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
  const editorApi = usePresetContext<StackPlugins>();
  const providers = React.useMemo(
    () => getExampleExtensionProviders(editorApi),
    [editorApi],
  );
  const quickInsertProvider = useDefaultQuickInsertProvider(providers);

  const [items] = useStateFromPromise<QuickInsertItem[]>(
    () => quickInsertProvider?.getItems() ?? Promise.resolve(EMPTY),
    [quickInsertProvider],
    [],
  );

  return React.useCallback(
    (query?: string, category?: string) => {
      // Roughly based on the quick-insert getSuggestions logic, but with custom default items for the examples
      const defaultItems = items || [];

      return find(
        query || '',
        category === 'all' || !category
          ? defaultItems
          : defaultItems.filter(
              (item) => item.categories && item.categories.includes(category),
            ),
      );
    },
    [items],
  );
};
