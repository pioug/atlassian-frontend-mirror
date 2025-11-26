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
import type { ExtensionAPI, ExtensionProvider, MenuItem } from '@atlaskit/editor-common/extensions';
import type {
	QuickInsertItem,
	QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';
import { combineProviders } from '@atlaskit/editor-common/provider-helpers';
import { type PublicPluginAPI } from '@atlaskit/editor-common/types';
import { findInsertLocation } from '@atlaskit/editor-common/utils/analytics';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';

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
		const insertLocation = findInsertLocation(selection);

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

const showDummyAPIWarning = (location: string) => {
	if (process.env.NODE_ENV !== 'production') {
		// eslint-disable-next-line no-console
		console.warn(
			`Extension plugin not attached to editor - cannot use extension API in ${location}`,
		);
	}
};

const dummyExtensionAPI: ExtensionAPI = {
	editInContextPanel: () => showDummyAPIWarning('editInContextPanel'),
	_editInLegacyMacroBrowser: () => showDummyAPIWarning('_editInLegacyMacroBrowser'),
	getNodeWithPosByLocalId: () => ({ node: null, pos: null }) as unknown as NodeWithPos,
	doc: {
		insertAfter: () => showDummyAPIWarning('doc:insertAfter'),
		scrollTo: () => showDummyAPIWarning('doc:scrollTo'),
		update: () => showDummyAPIWarning('doc:update'),
	},
};

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
						// Add module key so typeahead/quick-insert can identify items
						// **locale-agnostically**! nb: we _already_ send key in analytics
						// events, this standardises and makes our items more predictable.
						...(fg('confluence-whiteboards-quick-insert-l10n-eligible') && { key: item.key }),
						title: item.title,
						description: item.description,
						icon: () => <Icon label="" />,
						keywords: item.keywords,
						featured: item.featured,
						...((fg('cc_fd_wb_create_priority_in_slash_menu_enabled') ||
							fg('rovo_chat_enable_skills_ui_m1')) && {
							priority: item.priority,
						}),
						categories: item.categories,
						isDisabledOffline: true,
						action: (insert, state, source) => {
							if (typeof item.node === 'function') {
								const extensionAPI = apiRef?.current?.extension?.actions?.api();
								// While this should only run when the extension some setups of editor
								// may not have the extension API
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
								} else {
									// Originally it was understood we could only use this if we were using the extension plugin
									// However there are some edge cases where this is not true (ie. in jira)
									// Since making it optional now would be a breaking change - instead we can just pass a dummy
									// extension API to consumers that warns them of using the methods.
									resolveImport(item.node(dummyExtensionAPI)).then((node) => {
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
