import type { IntlShape } from 'react-intl';

import { InsertTypeAheadStep } from '@atlaskit/adf-schema/steps';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { closest } from '@atlaskit/editor-common/utils';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { TypeAheadPlugin } from '../typeAheadPluginType';
import type { PopupMountPointReference, TypeAheadHandler, TypeAheadPluginState } from '../types';

import { ACTIONS } from './actions';
import { openTypeAheadAtCursor } from './commands/open-typeahead-at-cursor';
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

/** Creates the type-ahead ProseMirror plugin. */
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

	// Tracks a wide-char trigger handler detected during IME composition (e.g. ／).
	// Set by compositionupdate, cleared by compositionend. Used by handleKeyDown
	// to intercept Enter that confirms the composition.
	let pendingWideSlashHandler: TypeAheadHandler | null = null;

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
					sectionTitleUpdates: {},
					sections: [],
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

			handleKeyDown: (view, event) => {
				// When composing a wide-char trigger (e.g. ／), intercept the Enter key
				// that confirms the composition so we can open the typeahead instead.
				if (
					pendingWideSlashHandler &&
					event.isComposing &&
					(event.key === 'Enter' || event.keyCode === 13)
				) {
					const handler = pendingWideSlashHandler;
					pendingWideSlashHandler = null;
					// Defer until ProseMirror has flushed the composed text into its state.
					setTimeout(() => {
						const command = openTypeAheadAtCursor({
							triggerHandler: handler,
							inputMethod: INPUT_METHOD.KEYBOARD,
						});
						const tr = command({ tr: view.state.tr });
						if (tr) {
							view.dispatch(tr);
						}
					}, 0);
					return true;
				}
				return false;
			},

			handleDOMEvents: {
				compositionupdate: (view, event) => {
					// When the experiment is on, track whether the current composition
					// exactly matches a wide-char trigger (e.g. ／ from Japanese keyboard).
					// We can't open the typeahead yet because composition is still active,
					// but we record the matching handler so the next keydown (Enter) can use it.
					if (expValEquals('platform_editor_wide_slash_trigger', 'isEnabled', true)) {
						const pendingData = event.data ?? '';
						pendingWideSlashHandler =
							typeAheadHandlers.find((handler) => {
								if (!handler.customRegex) {
									return false;
								}
								// Only match if the composition is a NON-ASCII trigger character.
								// ASCII triggers (e.g. '/') are handled by the normal input rule
								// path and must NOT be intercepted here — otherwise typing '/' on
								// a macOS Japanese IME (which briefly fires compositionupdate with
								// data='/') would cause the Enter-confirm to open the typeahead.
								// Matches any single ASCII character (U+0000–U+007F).
								// No 'u' flag needed for ASCII-only ranges.
								// Ignored via go/ees005
								// eslint-disable-next-line require-unicode-regexp
								if (/^[\x00-\x7F]$/.test(pendingData)) {
									return false;
								}
								const pattern = new RegExp(`^(${handler.customRegex})$`, 'u');
								return pattern.test(pendingData);
							}) ?? null;
					}
					return false;
				},
				compositionend: (view, event) => {
					// Clear the pending handler when composition ends (cancelled or committed
					// via a non-Enter key like Space, which we don't want to intercept).
					pendingWideSlashHandler = null;
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
