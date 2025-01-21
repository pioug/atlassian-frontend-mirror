import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import type { QuickInsertProvider } from '@atlaskit/editor-common/provider-factory';
import type { QuickInsertOptions, PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';

import type EditorActions from '../actions';

import { combineQuickInsertProviders, extensionProviderToQuickInsertProvider } from './extensions';

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
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
export default function prepareQuickInsertProvider(
	editorActions: EditorActions,
	apiRef: React.MutableRefObject<PublicPluginAPI<[ExtensionPlugin]> | undefined>,
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
			apiRef,
			createAnalyticsEvent,
		);

	return quickInsertProvider && extensionQuickInsertProvider
		? combineQuickInsertProviders([quickInsertProvider, extensionQuickInsertProvider])
		: quickInsertProvider || extensionQuickInsertProvider;
}
