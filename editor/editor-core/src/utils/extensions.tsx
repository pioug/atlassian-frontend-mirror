import React from 'react';

import Loadable from 'react-loadable';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	fireAnalyticsEvent,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { getQuickInsertItemsFromModule, resolveImport } from '@atlaskit/editor-common/extensions';
import type { ExtensionProvider, MenuItem } from '@atlaskit/editor-common/extensions';
import type {
	QuickInsertItem,
	QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';
import { combineProviders } from '@atlaskit/editor-common/provider-helpers';
import { type PublicPluginAPI } from '@atlaskit/editor-common/types';
import { findInsertLocation } from '@atlaskit/editor-common/utils/analytics';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type EditorActions from '../actions';

/**
 * Utils to send analytics event when a extension is inserted using quickInsert
 */
function sendExtensionQuickInsertAnalytics(
	item: MenuItem,
	selection: Selection,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
	source?: INPUT_METHOD.TOOLBAR | INPUT_METHOD.QUICK_INSERT,
) {
	if (createAnalyticsEvent) {
		const insertLocation = fg('platform_nested_nbm_analytics_location')
			? findInsertLocation(selection)
			: undefined;

		if (
			insertLocation &&
			['listItem', 'blockquote', 'nestedExpand', 'panel'].includes(insertLocation)
		) {
			// No-op editorExperiment evaluation to track usage of nested non-bodied macros
			// these can't be tracked at the point of diversion of the experience because that is a toggle of the
			// ProseMirror schema nodes for listItems, nestedExpand, blockquote, and panel. At that point the customer
			// has not yet been exposed to the experience.
			editorExperiment('platform_editor_nested_non_bodied_macros', 'test', { exposure: true });
		}

		fireAnalyticsEvent(createAnalyticsEvent)({
			payload: {
				action: ACTION.INSERTED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				actionSubjectId: ACTION_SUBJECT_ID.EXTENSION,
				attributes: {
					extensionType: item.extensionType,
					extensionKey: item.extensionKey,
					key: item.key,
					inputMethod: source || INPUT_METHOD.QUICK_INSERT,
					...(insertLocation ? { insertLocation } : {}),
				},
				eventType: EVENT_TYPE.TRACK,
			},
		});
	}
}

export async function extensionProviderToQuickInsertProvider(
	extensionProvider: ExtensionProvider,
	editorActions: EditorActions,
	apiRef: React.MutableRefObject<PublicPluginAPI<[ExtensionPlugin]> | undefined>,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
): Promise<QuickInsertProvider> {
	const extensions = await extensionProvider.getExtensions();

	return {
		getItems: () => {
			const quickInsertItems = getQuickInsertItemsFromModule<QuickInsertItem>(
				extensions,
				(item) => {
					const Icon = Loadable<{ label: string }, Object>({
						loader: item.icon,
						loading: () => null,
					});

					return {
						title: item.title,
						description: item.description,
						icon: () => <Icon label="" />,
						keywords: item.keywords,
						featured: item.featured,
						categories: item.categories,
						isDisabledOffline: true,
						action: (insert, state, source) => {
							if (typeof item.node === 'function') {
								const extensionAPI = apiRef?.current?.extension?.actions?.api();
								// While the api can be "undefined" there are no runtime scenarios where this is the case because:
								// - The quick insert API can only be called from an active editor
								// - The extension module handler can only be called from an active editor with the extension plugin
								// Therefore this should always be run unless there is something very wrong.
								if (extensionAPI) {
									resolveImport(item.node(extensionAPI)).then((node) => {
										sendExtensionQuickInsertAnalytics(
											item,
											state.selection,
											createAnalyticsEvent,
											source,
										);

										if (node) {
											editorActions.replaceSelection(node);
										}
									});
								}

								return insert('');
							} else {
								sendExtensionQuickInsertAnalytics(
									item,
									state.selection,
									createAnalyticsEvent,
									source,
								);
								return insert(item.node);
							}
						},
					};
				},
			);

			return Promise.all(quickInsertItems);
		},
	};
}

// Ignored via go/ees005
// eslint-disable-next-line require-await
export async function combineQuickInsertProviders(
	quickInsertProviders: Array<QuickInsertProvider | Promise<QuickInsertProvider>>,
): Promise<QuickInsertProvider> {
	const { invokeList } = combineProviders<QuickInsertProvider>(quickInsertProviders);

	return {
		getItems() {
			return invokeList('getItems');
		},
	};
}
