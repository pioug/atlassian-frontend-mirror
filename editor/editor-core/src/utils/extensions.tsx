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
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import { fg } from '@atlaskit/platform-feature-flags';

import type EditorActions from '../actions';

/**
 * Utils to send analytics event when a extension is inserted using quickInsert
 */
function sendExtensionQuickInsertAnalytics(
	item: MenuItem,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
	source?: INPUT_METHOD.TOOLBAR | INPUT_METHOD.QUICK_INSERT,
) {
	if (createAnalyticsEvent) {
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
								if (fg('platform_editor_add_extension_api_to_quick_insert')) {
									const extensionAPI = apiRef?.current?.extension?.actions?.api();
									// While the api can be "undefined" there are no runtime scenarios where this is the case because:
									// - The quick insert API can only be called from an active editor
									// - The extension module handler can only be called from an active editor with the extension plugin
									// Therefore this should always be run unless there is something very wrong.
									if (extensionAPI) {
										resolveImport(item.node(extensionAPI)).then((node) => {
											sendExtensionQuickInsertAnalytics(item, createAnalyticsEvent, source);

											if (node) {
												editorActions.replaceSelection(node);
											}
										});
									}
								} else {
									// @ts-expect-error No longer supported without extension API - this will be removed once we cleanup the FG.
									resolveImport(item.node()).then((node) => {
										sendExtensionQuickInsertAnalytics(item, createAnalyticsEvent, source);

										if (node) {
											editorActions.replaceSelection(node);
										}
									});
								}

								return insert('');
							} else {
								sendExtensionQuickInsertAnalytics(item, createAnalyticsEvent, source);
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
