import React from 'react';

import { type IntlShape, useIntl } from 'react-intl-next';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type {
	ProviderFactory,
	QuickInsertItem,
	QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';
import { memoProcessQuickInsertItems } from '@atlaskit/editor-common/quick-insert';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type {
	Command,
	EditorCommand,
	EmptyStateHandler,
	QuickInsertHandler,
	QuickInsertPluginState,
	QuickInsertPluginStateKeys,
	TypeAheadHandler,
} from '@atlaskit/editor-common/types';

import { createInsertItem, openElementBrowserModal } from './pm-plugins/commands';
import { pluginKey } from './pm-plugins/plugin-key';
import { type QuickInsertPlugin } from './quickInsertPluginType';
import ModalElementBrowser from './ui/ModalElementBrowser';
import { getQuickInsertSuggestions } from './ui/search';

export const quickInsertPlugin: QuickInsertPlugin = ({ config: options, api }) => {
	const onInsert = (item: QuickInsertItem) => {
		options?.onInsert?.(item);
	};

	const typeAhead: TypeAheadHandler = {
		id: TypeAheadAvailableNodes.QUICK_INSERT,
		trigger: '/',
		headless: options?.headless,
		getItems({ query, editorState }) {
			const quickInsertState = pluginKey.getState(editorState);

			return Promise.resolve(
				getQuickInsertSuggestions(
					{
						query,
						disableDefaultItems: options?.disableDefaultItems,
						prioritySortingFn: options?.prioritySortingFn,
					},
					quickInsertState?.lazyDefaultItems,
					quickInsertState?.providedItems,
				),
			);
		},
		selectItem: (state, item, insert) => {
			const quickInsertItem = item as QuickInsertItem;
			const result = quickInsertItem.action(insert, state);

			if (result) {
				onInsert(quickInsertItem);
			}

			return result;
		},
	};

	let intl: IntlShape;
	return {
		name: 'quickInsert',

		pmPlugins(defaultItems: Array<QuickInsertHandler>) {
			return [
				{
					name: 'quickInsert', // It's important that this plugin is above TypeAheadPlugin
					plugin: ({ providerFactory, getIntl, dispatch }) =>
						quickInsertPluginFactory(
							defaultItems,
							providerFactory,
							getIntl,
							dispatch,
							options?.emptyStateHandler,
						),
				},
			];
		},

		pluginsOptions: {
			typeAhead,
		},

		contentComponent({ editorView }) {
			if (options?.enableElementBrowser) {
				return (
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
			};
		},

		actions: {
			insertItem: createInsertItem(onInsert),

			openTypeAhead(inputMethod) {
				return Boolean(
					api?.typeAhead?.actions.open({
						triggerHandler: typeAhead,
						inputMethod,
					}),
				);
			},
			getSuggestions: (searchOptions) => {
				const { lazyDefaultItems, providedItems } =
					api?.quickInsert?.sharedState.currentState() ?? {};

				if (options?.prioritySortingFn) {
					searchOptions = { ...searchOptions, prioritySortingFn: options.prioritySortingFn };
				}

				return getQuickInsertSuggestions(searchOptions, lazyDefaultItems, providedItems);
			},
		},

		commands: {
			openElementBrowserModal,
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

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
function quickInsertPluginFactory(
	defaultItems: Array<QuickInsertHandler>,
	providerFactory: ProviderFactory,
	getIntl: () => IntlShape,
	dispatch: Dispatch,
	emptyStateHandler?: EmptyStateHandler,
) {
	return new SafePlugin({
		key: pluginKey,
		state: {
			init(): QuickInsertPluginState {
				return {
					isElementBrowserModalOpen: false,
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
			const providerHandler = async (
				_name: string,
				providerPromise?: Promise<QuickInsertProvider>,
			) => {
				if (providerPromise) {
					try {
						const provider = await providerPromise;
						const providedItems = await provider.getItems();

						setProviderState({ provider, providedItems })(editorView.state, editorView.dispatch);
					} catch (e) {
						// eslint-disable-next-line no-console
						console.error('Error getting items from quick insert provider', e);
					}
				}
			};

			providerFactory.subscribe('quickInsertProvider', providerHandler);

			return {
				destroy() {
					providerFactory.unsubscribe('quickInsertProvider', providerHandler);
				},
			};
		},
	});
}
