import React from 'react';

import Loadable from 'react-loadable';
// oxlint-disable-next-line @atlassian/no-restricted-imports
import { lazyForPaint, LazySuspense } from 'react-loosely-lazy';

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
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { findInsertLocation } from '@atlaskit/editor-common/utils/analytics';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type EditorActions from '../actions';
import { getExtensionQuickInsertComponents } from '../ui/quick-insert/getExtensionQuickInsertComponents';

// Structural shape of the markdown-mode plugin's slice of the injection API.
// Used to read `isMarkdownMode` without importing the `MarkdownModePlugin`
// type — that would pull editor-plugin-markdown-mode into editor-core's
// dependency graph and force every consuming product to rebuild.
type MarkdownModeReader = {
	markdownMode?: {
		sharedState: { currentState: () => { isMarkdownMode?: boolean } | undefined };
	};
};

/**
 * Utils to send analytics event when an extension is inserted using quickInsert
 */
function sendExtensionQuickInsertAnalytics(
	item: MenuItem,
	selection: Selection,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
	source?:
		| INPUT_METHOD.TOOLBAR
		| INPUT_METHOD.INSERT_MENU
		| INPUT_METHOD.QUICK_INSERT
		| INPUT_METHOD.ELEMENT_BROWSER,
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

type IconLoader = NonNullable<MenuItem['icon']>;
// Keep lazy icon component identities stable across menu unmounts and remounts.
const lazyExtensionIconCache = new WeakMap<IconLoader, ReturnType<typeof lazyForPaint>>();

const LazyExtensionIcon = ({ iconLoader }: { iconLoader: IconLoader }) => {
	let Icon = lazyExtensionIconCache.get(iconLoader);
	if (!Icon) {
		Icon = lazyForPaint(() => iconLoader());
		lazyExtensionIconCache.set(iconLoader, Icon);
	}

	return (
		<LazySuspense fallback={null}>
			<Icon label="" />
		</LazySuspense>
	);
};

/** Creates legacy and registered Quick Insert representations for extensions. */
export async function extensionProviderToQuickInsertProvider(
	extensionProvider: ExtensionProvider,
	editorActions: EditorActions,
	apiRef: React.MutableRefObject<PublicPluginAPI<[ExtensionPlugin]> | undefined>,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
): Promise<QuickInsertProvider> {
	const extensions = await extensionProvider.getExtensions();
	const getMenuItems = (): MenuItem[] =>
		getQuickInsertItemsFromModule<MenuItem>(extensions, (item) => item);

	return {
		getComponents: () => {
			const isMarkdownMode = (
				apiRef.current as unknown as MarkdownModeReader | undefined
			)?.markdownMode?.sharedState.currentState()?.isMarkdownMode;
			if (!isExperimentEnabled('platform_editor_slash_command') || isMarkdownMode) {
				return Promise.resolve([] as RegisterMenuItem[]);
			}

			return Promise.resolve(
				getExtensionQuickInsertComponents({
					apiRef,
					createAnalyticsEvent,
					editorActions,
					items: getMenuItems(),
				}),
			);
		},
		getItems: () => {
			// `extensionProvider` is supplied independently of the preset, so
			// suppress its items in markdown mode where rich-only content cannot
			// be inserted. See `MarkdownModeReader` above for why this is read
			// via a structural cast rather than the typed plugin API.
			const isMarkdownMode = (
				apiRef.current as unknown as MarkdownModeReader | undefined
			)?.markdownMode?.sharedState.currentState()?.isMarkdownMode;
			if (isMarkdownMode) {
				return Promise.resolve([]);
			}

			const quickInsertItems = getQuickInsertItemsFromModule<QuickInsertItem>(
				extensions,
				(item) => {
					return {
						...((isExperimentEnabled('platform_editor_slash_app_category_analytics') ||
							isExperimentEnabled('platform_editor_slash_command')) &&
						item.app
							? { app: item.app }
							: {}),
						// Add module key so typeahead/quick-insert can identify items
						// **locale-agnostically**! nb: we _already_ send key in analytics
						// events, this standardises and makes our items more predictable.
						key: item.key,
						title: item.title,
						description: item.description,
						...(item.preview ? { preview: item.preview } : {}),
						icon: () => {
							if (isExperimentEnabled('platform_editor_loosely_lazy_migration')) {
								return <LazyExtensionIcon iconLoader={item.icon} />;
							}

							const Icon = Loadable<{ label: string }, object>({
								loader: item.icon,
								loading: () => null,
							});
							return <Icon label="" />;
						},
						keywords: item.keywords,
						featured: item.featured,
						priority: item.priority,
						...(item.category ? { category: item.category } : {}),
						categories: item.categories,
						...(item.lozenge != null && { lozenge: item.lozenge }),
						isDisabledOffline: true,
						// This legacy action intentionally mirrors executeExtensionQuickInsertItem,
						// which serves the registered representation of the same item.
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
									// Since making it optional now would be a breaking change - instead we can just pass a dummy extension API to consumers that warns them of using the methods.
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
