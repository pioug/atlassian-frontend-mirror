import React from 'react';

import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import type {
  QuickInsertItem,
  QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';
import { find } from '@atlaskit/editor-common/quick-insert';
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import { getExampleExtensionProviders } from '@atlaskit/editor-test-helpers/example-helpers';

import type EditorActions from '../src/actions';
import { usePresetContext } from '../src/presets/context';
import { extensionProviderToQuickInsertProvider } from '../src/utils/extensions';

type StackPlugins = [OptionalPlugin<ExtensionPlugin>];

const ACTIONS = {} as EditorActions;
const EMPTY: any[] = [];

// Copied and simplified from `editor-plugin-extension/src/ui/ConfigPanel/use-state-from-promise/index.ts`
export function useStateFromPromise<S>(
  callback: () => Promise<S>,
  deps: React.DependencyList,
  initialValue?: S,
): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>] {
  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fn = React.useCallback(callback, deps);
  const [value, setValue] = React.useState<S | undefined>(initialValue);

  React.useEffect(
    () => {
      Promise.resolve(fn()).then((result) => {
        setValue(result);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps],
  );

  return [value, setValue];
}

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
