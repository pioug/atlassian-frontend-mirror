import type { IntlShape } from 'react-intl-next';

import type { DocNode } from '@atlaskit/adf-schema';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { pluginKey, EMPTY_PARAGRAPH_TIMEOUT_DELAY } from '../placeholderPlugin';
import type { PlaceholderPlugin } from '../placeholderPluginType';

import { TYPEWRITER_TYPED_AND_DELETED_DELAY } from './constants';
import { createPlaceholderDecoration } from './decorations';
import type { PlaceHolderState } from './types';
import {
	calculateUserInteractionState,
	createPlaceHolderStateFrom,
	getPlaceholderState,
} from './utils';

export default function createPlugin(
	intl: IntlShape,
	defaultPlaceholderText?: string,
	bracketPlaceholderText?: string,
	emptyLinePlaceholder?: string,
	placeholderPrompts?: string[],
	withEmptyParagraph?: boolean,
	placeholderADF?: DocNode,
	api?: ExtractInjectionAPI<PlaceholderPlugin>,
): SafePlugin | undefined {
	if (
		!defaultPlaceholderText &&
		!placeholderPrompts &&
		!bracketPlaceholderText &&
		!placeholderADF
	) {
		return;
	}

	let isDestroyed = false;
	let activeTypewriterTimeouts: (() => void)[] = [];
	const clearAllTypewriterTimeouts = () => {
		activeTypewriterTimeouts.forEach((clearFn) => clearFn());
		activeTypewriterTimeouts = [];
	};

	return new SafePlugin<PlaceHolderState>({
		key: pluginKey,
		state: {
			init: (_, state) =>
				createPlaceHolderStateFrom({
					isInitial: true,
					isEditorFocused: Boolean(api?.focus?.sharedState.currentState()?.hasFocus),
					editorState: state,
					isTypeAheadOpen: api?.typeAhead?.actions.isOpen,
					defaultPlaceholderText,
					bracketPlaceholderText,
					emptyLinePlaceholder,
					placeholderADF,
					placeholderPrompts,
					typedAndDeleted: false,
					userHadTyped: false,
					intl,
					withEmptyParagraph,
				}),

			apply: (tr, placeholderState, _oldEditorState, newEditorState) => {
				const meta = tr.getMeta(pluginKey);
				const isEditorFocused = Boolean(api?.focus?.sharedState.currentState()?.hasFocus);

				const { userHadTyped, typedAndDeleted } = calculateUserInteractionState({
					placeholderState,
					oldEditorState: _oldEditorState,
					newEditorState,
				});

				let isPlaceholderHidden = placeholderState?.isPlaceholderHidden ?? false;
				const shouldUpdatePlaceholderHidden = fg('platform_editor_ai_aifc_patch_ga_blockers')
					? meta?.isPlaceholderHidden !== undefined
					: meta?.isPlaceholderHidden !== undefined && withEmptyParagraph;
				if (shouldUpdatePlaceholderHidden) {
					isPlaceholderHidden = meta.isPlaceholderHidden;
				}

				if (meta?.placeholderText !== undefined && withEmptyParagraph) {
					// Only update defaultPlaceholderText from meta if we're not using ADF placeholder
					if (!(fg('platform_editor_ai_aifc_patch_ga') && placeholderADF)) {
						defaultPlaceholderText = meta.placeholderText;
					}
				}

				const newPlaceholderState = createPlaceHolderStateFrom({
					isEditorFocused,
					editorState: newEditorState,
					isTypeAheadOpen: api?.typeAhead?.actions.isOpen,
					defaultPlaceholderText: withEmptyParagraph
						? defaultPlaceholderText
						: (meta?.placeholderText ??
							placeholderState?.placeholderText ??
							defaultPlaceholderText),
					bracketPlaceholderText,
					emptyLinePlaceholder,
					placeholderADF,
					placeholderPrompts:
						meta?.placeholderPrompts ?? placeholderState?.placeholderPrompts ?? placeholderPrompts,
					typedAndDeleted,
					userHadTyped,
					intl,
					isPlaceholderHidden,
					withEmptyParagraph,
					showOnEmptyParagraph:
						meta?.showOnEmptyParagraph ?? placeholderState?.showOnEmptyParagraph,
				});

				// Clear timeouts when hasPlaceholder becomes false
				if (!newPlaceholderState.hasPlaceholder) {
					clearAllTypewriterTimeouts();
				}

				return newPlaceholderState;
			},
		},
		props: {
			decorations(editorState) {
				const { hasPlaceholder, placeholderText, pos, typedAndDeleted, contextPlaceholderADF } =
					getPlaceholderState(editorState);

				// Decorations is still called after plugin is destroyed
				// So we need to make sure decorations is not called if plugin has been destroyed to prevent the placeholder animations' setTimeouts called infinitely
				if (isDestroyed) {
					return;
				}

				const compositionPluginState = api?.composition?.sharedState.currentState();
				const isShowingDiff = Boolean(
					api?.showDiff?.sharedState.currentState()?.isDisplayingChanges,
				);

				if (
					hasPlaceholder &&
					((placeholderText ?? '') ||
						placeholderPrompts ||
						placeholderADF ||
						contextPlaceholderADF) &&
					pos !== undefined &&
					!compositionPluginState?.isComposing &&
					!isShowingDiff
				) {
					const initialDelayWhenUserTypedAndDeleted = typedAndDeleted
						? TYPEWRITER_TYPED_AND_DELETED_DELAY
						: 0;
					// contextPlaceholderADF takes precedence over the global placeholderADF
					const placeholderAdfToUse = contextPlaceholderADF || placeholderADF;
					return createPlaceholderDecoration(
						editorState,
						placeholderText ?? '',
						placeholderPrompts,
						activeTypewriterTimeouts,
						pos,
						initialDelayWhenUserTypedAndDeleted,
						placeholderAdfToUse,
					);
				}
				return;
			},
		},

		view() {
			let timeoutId: ReturnType<typeof setTimeout> | undefined;

			function startEmptyParagraphTimeout(editorView: EditorView) {
				if (timeoutId) {
					return;
				}
				timeoutId = setTimeout(() => {
					timeoutId = undefined;
					editorView.dispatch(
						editorView.state.tr.setMeta(pluginKey, {
							showOnEmptyParagraph: true,
						}),
					);
				}, EMPTY_PARAGRAPH_TIMEOUT_DELAY);
			}

			function destroyEmptyParagraphTimeout() {
				if (timeoutId) {
					clearTimeout(timeoutId);
					timeoutId = undefined;
				}
			}

			return {
				update(editorView, prevState) {
					if (withEmptyParagraph) {
						const prevPluginState = getPlaceholderState(prevState);
						const newPluginState = getPlaceholderState(editorView.state);

						// user start typing after move to an empty paragraph, clear timeout
						if (!newPluginState.canShowOnEmptyParagraph && timeoutId) {
							destroyEmptyParagraphTimeout();
						}
						// user move to an empty paragraph again, reset state to hide placeholder, and restart timeout
						else if (
							prevPluginState.canShowOnEmptyParagraph &&
							newPluginState.canShowOnEmptyParagraph &&
							newPluginState.pos !== prevPluginState.pos
						) {
							editorView.dispatch(
								editorView.state.tr.setMeta(pluginKey, {
									showOnEmptyParagraph: false,
								}),
							);
							destroyEmptyParagraphTimeout();
							startEmptyParagraphTimeout(editorView);
						}
						// user move to an empty paragraph (by click enter or move to an empty paragraph), start timeout
						else if (
							!prevPluginState.canShowOnEmptyParagraph &&
							newPluginState.canShowOnEmptyParagraph &&
							!newPluginState.showOnEmptyParagraph &&
							!timeoutId
						) {
							startEmptyParagraphTimeout(editorView);
						}
					}
				},

				destroy() {
					clearAllTypewriterTimeouts();

					destroyEmptyParagraphTimeout();

					isDestroyed = true;
				},
			};
		},
	});
}
