import type { IntlShape } from 'react-intl-next';

import { InsertTypeAheadStep } from '@atlaskit/adf-schema/steps';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { closest } from '@atlaskit/editor-common/utils';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { type TypeAheadPlugin } from '../typeAheadPluginType';
import type { PopupMountPointReference, TypeAheadHandler, TypeAheadPluginState } from '../types';

import { ACTIONS } from './actions';
import { TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE } from './constants';
import { factoryDecorations } from './decorations';
import { isInsertionTransaction } from './isInsertionTransaction';
import { pluginKey } from './key';
import { createReducer } from './reducer';

const hasValidTypeAheadStep = (tr: ReadonlyTransaction): InsertTypeAheadStep | null => {
	const steps = tr.steps.filter((step) => step instanceof InsertTypeAheadStep);

	// There are some cases, like collab rebase, where the steps are re-applied
	// We should not re open the type-ahead for those cases
	if (steps.length === 1) {
		return steps[0] as InsertTypeAheadStep;
	}

	return null;
};

type Props = {
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
	getIntl: () => IntlShape;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	popupMountRef: PopupMountPointReference;
	reactDispatch: Dispatch;
	typeAheadHandlers: Array<TypeAheadHandler>;
};
export function createPlugin({
	reactDispatch,
	popupMountRef,
	typeAheadHandlers,
	getIntl,
	nodeViewPortalProviderAPI,
	api,
}: Props): SafePlugin {
	const intl = getIntl();
	const { createDecorations, removeDecorations } = factoryDecorations({
		intl,
		nodeViewPortalProviderAPI,
		popupMountRef,
		api,
	});
	const reducer = createReducer({
		createDecorations,
		removeDecorations,
		typeAheadHandlers,
		popupMountRef,
	});
	return new SafePlugin<TypeAheadPluginState>({
		key: pluginKey,

		state: {
			init() {
				return {
					typeAheadHandlers,
					query: '',
					decorationSet: DecorationSet.empty,
					decorationElement: null,
					items: [],
					errorInfo: null,
					selectedIndex: -1,
					stats: null,
					inputMethod: null,
					removePrefixTriggerOnCancel: undefined,
				};
			},

			apply(tr, currentPluginState, oldEditorState, state) {
				const customStep = hasValidTypeAheadStep(tr);

				const nextPluginState = reducer(tr, currentPluginState, customStep);

				if (currentPluginState !== nextPluginState) {
					reactDispatch(pluginKey, nextPluginState);
				}

				return nextPluginState;
			},
		},

		appendTransaction(transactions, _oldState, newState) {
			const insertItemCallback = isInsertionTransaction(transactions, ACTIONS.INSERT_RAW_QUERY);
			if (insertItemCallback) {
				const tr = insertItemCallback(newState);
				if (tr) {
					if (fg('platform_editor_ease_of_use_metrics')) {
						api?.metrics?.commands.startActiveSessionTimer()({ tr });
					}
					return tr;
				}
			}
		},

		view() {
			return {
				update(editorView) {},
			};
		},

		props: {
			decorations: (state: EditorState) => {
				return pluginKey.getState(state)?.decorationSet;
			},

			handleDOMEvents: {
				compositionend: (view, event) => {
					return false;
				},

				click: (view, event) => {
					const { target } = event;
					// ProseMirror view listen to any click event inside of it
					// When this event is coming from the typeahead
					// we should tell to ProseMirror to sit down and relax
					// cuz we know what we are doing (I hope)
					if (
						target instanceof HTMLElement &&
						closest(target, `[data-type-ahead=${TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE}]`)
					) {
						return true;
					}
					return false;
				},
			},
		},
	});
}
