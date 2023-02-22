import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { QuickInsertProvider } from '@atlaskit/editor-common/provider-factory';
import EditorActions from '../actions';

import { QuickInsertOptions } from '../plugins/quick-insert/types';
import {
  extensionProviderToQuickInsertProvider,
  combineQuickInsertProviders,
} from './extensions';

/**
 *
 * Used to combine the quickInsert provider and extension provider (if available)
 * Or return a provider that is available (quickInsertProvider preferred)
 * @param editorActions
 * @param extensionProvider
 * @param quickInsert
 * @param createAnalyticsEvent
 * @returns Quick insert provider if available
 */
export default function prepareQuickInsertProvider(
  editorActions: EditorActions,
  extensionProvider?: ExtensionProvider,
  quickInsert?: QuickInsertOptions,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
): Promise<QuickInsertProvider> | undefined {
  const quickInsertProvider =
    quickInsert && typeof quickInsert !== 'boolean' && quickInsert.provider;

  const extensionQuickInsertProvider =
    extensionProvider &&
    extensionProviderToQuickInsertProvider(
      extensionProvider,
      editorActions,
      createAnalyticsEvent,
    );

  return quickInsertProvider && extensionQuickInsertProvider
    ? combineQuickInsertProviders([
        quickInsertProvider,
        extensionQuickInsertProvider,
      ])
    : quickInsertProvider || extensionQuickInsertProvider;
}
