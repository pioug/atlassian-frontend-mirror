import React from 'react';

import { type IntlShape, useIntl } from 'react-intl';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type {
	ProviderFactory,
	QuickInsertItem,
	QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';
import { memoProcessQuickInsertItems } from '@atlaskit/editor-common/quick-insert';
import { getActiveQuickInsertCategories } from '@atlaskit/editor-common/quick-insert/get-active-quick-insert-categories';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type {
	Command,
	EditorCommand,
	EmptyStateHandler,
	ExtractInjectionAPI,
	QuickInsertHandler,
	TypeAheadHandler,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { createQuickInsertItemsAnalyticsScheduler } from './app-category-analytics';
import {
	createInsertItem,
	openElementBrowser as openElementBrowserCommand,
	openElementBrowserModal,
} from './pm-plugins/commands';
import { getQuickInsertOpenExperiencePlugin } from './pm-plugins/experiences/quick-insert-open-experience';
import {
	pluginKey,
	type QuickInsertPluginState,
	type QuickInsertPluginStateKeys,
} from './pm-plugins/plugin-key';
import type { OpenElementBrowserOptions, QuickInsertPlugin } from './quickInsertPluginType';
import { getBlockControlQuickInsertComponents } from './ui/block-control-quick-insert';
import { getLegacyCompatibleComponents } from './ui/getLegacyCompatibleComponents';
import { getQuickInsertComponents } from './ui/getQuickInsertComponents';
import ModalElementBrowser from './ui/ModalElementBrowser';
import { RegistryElementBrowserContainer } from './ui/RegistryElementBrowser';
import { getQuickInsertSuggestions, withLayoutQuickInsertPrioritySorting } from './ui/search';

export const quickInsertPlugin: QuickInsertPlugin = ({ config: options, api }) => {
	const refs: {
		editorView?: EditorView;
		popupsMountPoint?: HTMLElement;
		wrapperElement?: HTMLElement;
	} = {};

	const onInsert = (item: QuickInsertItem) => {
		options?.onInsert?.(item);
	};

	const typeAheadPrioritySortingFn = withLayoutQuickInsertPrioritySorting(
		options?.prioritySortingFn,
	);

	const typeAhead: TypeAheadHandler = {
		id: TypeAheadAvailableNodes.QUICK_INSERT,
		trigger: '/',
		// Support fullwidth slash (U+FF0F) used by Japanese/CJK keyboards (e.g. typing / on a Japanese keyboard layout)
		customRegex: expValEquals('platform_editor_wide_slash_trigger', 'isEnabled', true)
			? '[/／]'
			: undefined,
		headless: options?.headless,
		getItems({ query, editorState }) {
			const quickInsertState = pluginKey.getState(editorState);
			const items = getQuickInsertSuggestions(
				{
					query: query,
					disableDefaultItems: options?.disableDefaultItems,
					prioritySortingFn: typeAheadPrioritySortingFn,
					// EDITOR-6558: pass through consumer-supplied filter (e.g. Markdown Mode allowlist)
					itemFilter: options?.itemFilter,
				},
				quickInsertState?.lazyDefaultItems,
				quickInsertState?.providedItems,
			);

			return Promise.resolve(items);
		},

		getEmptyItem({ editorState }) {
			if (!isExperimentEnabled('platform_editor_insert_menu_ai')) {
				return undefined;
			}

			const quickInsertState = pluginKey.getState(editorState);

			const matches = getQuickInsertSuggestions(
				{
					query: '',
					disableDefaultItems: options?.disableDefaultItems,
					prioritySortingFn: options?.prioritySortingFn,
					itemFilter: (item) =>
						getActiveQuickInsertCategories(item.category, item.categories).includes('AI'),
				},
				quickInsertState?.lazyDefaultItems,
				quickInsertState?.providedItems,
			);

			return matches[0];
		},
		selectItem: (state, item, insert) => {
			const quickInsertItem = item as QuickInsertItem;
			const result = quickInsertItem.action(insert, state);

			if (result) {
				onInsert(quickInsertItem);
			}

			return result;
		},
		getMoreOptionsButtonConfig: options?.enableElementBrowser
			? ({ formatMessage }) => {
					return {
						title: formatMessage(messages.viewMore),
						ariaLabel: formatMessage(messages.viewMoreAriaLabel),
						onClick: (props) => openElementBrowser()(props),
						iconBefore: <ShowMoreHorizontalIcon label="" />,
					};
				}
			: undefined,
	};
	if (isExperimentEnabled('platform_editor_slash_command')) {
		api?.uiControlRegistry?.actions.register(
			getQuickInsertComponents({
				api,
				includeElementBrowserItems: options?.enableElementBrowser === true,
				isRecommendedItem: options?.isRecommendedItem,
			}),
		);
	}

	if (
		isExperimentEnabled('platform_editor_block_control_migration') &&
		options?.blockControlButtonEnabled !== false
	) {
		api?.uiControlRegistry?.actions.register(
			getBlockControlQuickInsertComponents({
				api,
				getEditorView: () => refs.editorView,
				openTypeAhead: () =>
					api?.typeAhead?.actions.open({
						triggerHandler: typeAhead,
						inputMethod: 'blockControl',
						removePrefixTriggerOnCancel: true,
					}),
			}),
		);
	}

	const openElementBrowser =
		(options?: OpenElementBrowserOptions): EditorCommand =>
		({ tr }) => {
			if (fg('platform_editor_ease_of_use_metrics')) {
				api?.metrics?.commands.handleIntentToStartEdit({
					shouldStartTimer: false,
					shouldPersistActiveSession: true,
				})({ tr });
			}
			return (
				isExperimentEnabled('platform_editor_slash_command')
					? openElementBrowserCommand(options)
					: openElementBrowserModal
			)({ tr });
		};

	let intl: IntlShape;
	return {
		name: 'quickInsert',

		pmPlugins(defaultItems: Array<QuickInsertHandler>) {
			return [
				{
					name: 'quickInsert', // It's important that this plugin is above TypeAheadPlugin
					plugin: ({ providerFactory, getIntl, dispatch, dispatchAnalyticsEvent }) =>
						quickInsertPluginFactory(
							isExperimentEnabled('platform_editor_slash_command')
								? (defaultItems || []).filter((item) => item !== undefined)
								: defaultItems,
							providerFactory,
							getIntl,
							dispatch,
							dispatchAnalyticsEvent,
							options?.emptyStateHandler,
							onInsert,
							options?.itemFilter,
							api,
						),
				},
				{
					name: 'quickInsertOpenExperience',
					plugin: () =>
						getQuickInsertOpenExperiencePlugin({
							refs,
							dispatchAnalyticsEvent: (payload) =>
								api?.analytics?.actions?.fireAnalyticsEvent(payload),
						}),
				},
			];
		},

		pluginsOptions: {
			typeAhead,
		},

		contentComponent({ editorView, popupsMountPoint, wrapperElement }) {
			refs.editorView = editorView || undefined;
			refs.popupsMountPoint = popupsMountPoint || undefined;
			refs.wrapperElement = wrapperElement || undefined;

			if (!editorView || isSSR()) {
				return null;
			}

			if (options?.enableElementBrowser) {
				return isExperimentEnabled('platform_editor_slash_command') && api?.uiControlRegistry ? (
					<RegistryElementBrowserContainer
						editorView={editorView}
						helpUrl={options?.elementBrowserHelpUrl}
						pluginInjectionAPI={api}
					/>
				) : (
					<ModalElementBrowser
						editorView={editorView}
						helpUrl={options?.elementBrowserHelpUrl}
						pluginInjectionAPI={api}
					/>
				);
			}

			return null;
		},

		getSharedState(editorState) {
			if (!editorState) {
				return null;
			}
			const quickInsertState = pluginKey.getState(editorState);
			if (!quickInsertState) {
				return null;
			}
			return {
				typeAheadHandler: typeAhead,
				lazyDefaultItems: quickInsertState.lazyDefaultItems,
				emptyStateHandler: quickInsertState.emptyStateHandler,
				providedItems: quickInsertState.providedItems,
				isElementBrowserModalOpen: quickInsertState.isElementBrowserModalOpen,
				isElementBrowserOpen: quickInsertState.isElementBrowserOpen,
			};
		},

		actions: {
			insertItem: createInsertItem(onInsert),

			openTypeAhead(inputMethod, removePrefixTriggerOnCancel) {
				return Boolean(
					api?.typeAhead?.actions.open({
						triggerHandler: typeAhead,
						inputMethod,
						removePrefixTriggerOnCancel,
					}),
				);
			},
			getSuggestions: (searchOptions) => {
				const { lazyDefaultItems, providedItems } =
					api?.quickInsert?.sharedState.currentState() ?? {};

				searchOptions = {
					...searchOptions,
					prioritySortingFn: withLayoutQuickInsertPrioritySorting(
						options?.prioritySortingFn ?? searchOptions.prioritySortingFn,
					),
				};

				// EDITOR-6558: layer the consumer-supplied filter (e.g. Markdown Mode allowlist)
				// over any caller-supplied filter so both apply.
				if (options?.itemFilter) {
					const consumerFilter = options.itemFilter;
					const callerFilter = searchOptions.itemFilter;
					searchOptions = {
						...searchOptions,
						itemFilter: callerFilter
							? (item) => consumerFilter(item) && callerFilter(item)
							: consumerFilter,
					};
				}

				return getQuickInsertSuggestions(searchOptions, lazyDefaultItems, providedItems);
			},
		},

		commands: {
			openElementBrowser,
			openElementBrowserModal: ({ tr }) => {
				if (fg('platform_editor_ease_of_use_metrics')) {
					api?.metrics?.commands.handleIntentToStartEdit({
						shouldStartTimer: false,
						shouldPersistActiveSession: true,
					})({ tr });
				}
				return openElementBrowserModal({ tr });
			},
			addQuickInsertItem:
				(item: QuickInsertHandler): EditorCommand =>
				({ tr }) => {
					const { lazyDefaultItems } = api?.quickInsert?.sharedState.currentState() ?? {};
					const defaultItems = lazyDefaultItems ? lazyDefaultItems() : [];
					const memoisedNewItems = memoProcessQuickInsertItems([item], intl);
					return tr.setMeta(pluginKey, {
						lazyDefaultItems: () => [...defaultItems, ...memoisedNewItems],
					});
				},
			updateQuickInsertItem:
				(key: string, item: QuickInsertHandler): EditorCommand =>
				({ tr }) => {
					const { providedItems, lazyDefaultItems } =
						api?.quickInsert?.sharedState.currentState() ?? {};
					const defaultItems = lazyDefaultItems ? lazyDefaultItems() : [];
					const newItem = memoProcessQuickInsertItems([item], intl);

					const replaceByKey = (items: QuickInsertItem[]) =>
						items.flatMap((i) => (i.key === key ? newItem : i));

					const meta: Partial<QuickInsertPluginState> = {};
					if (defaultItems.some((i) => i.key === key)) {
						meta.lazyDefaultItems = () => replaceByKey(defaultItems);
					}
					if (providedItems?.some((i) => i.key === key)) {
						meta.providedItems = replaceByKey(providedItems);
					}

					return Object.keys(meta).length > 0 ? tr.setMeta(pluginKey, meta) : tr;
				},
			removeQuickInsertItem:
				(key: string): EditorCommand =>
				({ tr }) => {
					const { providedItems, lazyDefaultItems } =
						api?.quickInsert?.sharedState.currentState() ?? {};
					const defaultItems = lazyDefaultItems ? lazyDefaultItems() : [];
					return tr.setMeta(pluginKey, {
						providedItems: providedItems?.filter((item) => item.key !== key) ?? [],
						lazyDefaultItems: () => defaultItems.filter((item) => item.key !== key),
					});
				},
		},

		usePluginHook: () => {
			intl = useIntl();
		},
	};
};

const setProviderState =
	(providerState: Partial<QuickInsertPluginState>): Command =>
	(state, dispatch) => {
		if (dispatch) {
			dispatch(state.tr.setMeta(pluginKey, providerState));
		}
		return true;
	};

function quickInsertPluginFactory(
	defaultItems: Array<QuickInsertHandler>,
	providerFactory: ProviderFactory,
	getIntl: () => IntlShape,
	dispatch: Dispatch,
	dispatchAnalyticsEvent: DispatchAnalyticsEvent,
	emptyStateHandler?: EmptyStateHandler,
	onInsert: (item: QuickInsertItem) => void = () => {},
	itemFilter?: (item: QuickInsertItem) => boolean,
	api?: ExtractInjectionAPI<QuickInsertPlugin>,
) {
	return new SafePlugin({
		key: pluginKey,
		state: {
			init(): QuickInsertPluginState {
				return {
					isElementBrowserModalOpen: false,
					isElementBrowserOpen: false,
					emptyStateHandler,
					// lazy so it doesn't run on editor initialization
					// memo here to avoid using a singleton cache, avoids editor
					// getting confused when two editors exist within the same page.
					lazyDefaultItems: () => memoProcessQuickInsertItems(defaultItems || [], getIntl()),
				};
			},

			apply(tr, pluginState) {
				const meta = tr.getMeta(pluginKey);
				if (meta) {
					const keys = Object.keys(meta) as Array<QuickInsertPluginStateKeys>;
					const changed = keys.some((key) => {
						return pluginState[key] !== meta[key];
					});

					if (changed) {
						const newState = { ...pluginState, ...meta };

						dispatch(pluginKey, newState);
						return newState;
					}
				}

				return pluginState;
			},
		},

		view(editorView) {
			let quickInsertItemsAnalyticsScheduler:
				| ReturnType<typeof createQuickInsertItemsAnalyticsScheduler>
				| undefined;
			let isDestroyed = false;
			const providerHandler = async (
				_name: string,
				providerPromise?: Promise<QuickInsertProvider>,
			) => {
				if (providerPromise) {
					try {
						const provider = await providerPromise;
						const providedItems = await provider.getItems();
						if (isExperimentEnabled('platform_editor_slash_command')) {
							const directComponents = provider.getComponents ? await provider.getComponents() : [];
							const components = getLegacyCompatibleComponents({
								directComponents,
								itemFilter,
								onInsert,
								providedItems,
							});
							api?.uiControlRegistry?.actions.register(components);
						}
						setProviderState({ provider, providedItems })(editorView.state, editorView.dispatch);

						if (
							!isDestroyed &&
							!quickInsertItemsAnalyticsScheduler &&
							(isExperimentEnabled('platform_editor_slash_app_category_analytics') ||
								isExperimentEnabled('platform_editor_slash_command'))
						) {
							quickInsertItemsAnalyticsScheduler =
								createQuickInsertItemsAnalyticsScheduler(dispatchAnalyticsEvent);
							quickInsertItemsAnalyticsScheduler.schedule({
								providedItems,
							});
						}
					} catch (e) {
						// eslint-disable-next-line no-console
						console.error('Error getting items from quick insert provider', e);
					}
				}
			};

			providerFactory.subscribe('quickInsertProvider', providerHandler);

			return {
				destroy() {
					isDestroyed = true;
					quickInsertItemsAnalyticsScheduler?.destroy();
					providerFactory.unsubscribe('quickInsertProvider', providerHandler);
				},
			};
		},
	});
}
