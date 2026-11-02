// TODO: ED-26962 - Ideally this should use the custom toggleMark function from @atlaskit/editor-common so we also disable the options when selecting inline nodes but it disables the marks when the selection is empty at this point in time which is undesirable
// import { toggleMark } from '@atlaskit/editor-common/mark';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics/api';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import {
	moveLeft as keymapMoveLeft,
	moveRight as keymapMoveRight,
} from '@atlaskit/editor-common/keymaps';
import { anyMarkActive, isMarkExcluded } from '@atlaskit/editor-common/mark';
import { wholeSelectionHasMarks } from '@atlaskit/editor-common/mark/text-formatting';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { TextFormattingState } from '@atlaskit/editor-common/types/text-formatting';
import { shallowEqual } from '@atlaskit/editor-common/utils';
import { toggleMark } from '@atlaskit/editor-prosemirror/commands';
import { MarkType } from '@atlaskit/editor-prosemirror/model';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/editor-experiment';

import { createInlineCodeFromTextInputWithAnalytics } from '../editor-commands/text-formatting';
// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as commands from '../editor-commands/text-formatting';
import { pluginKey } from './plugin-key';

const isSelectionInlineCursor = (selection: Selection) => {
	if (selection instanceof NodeSelection) {
		return true;
	}
	return false;
};

const checkNodeSelection = (
	mark: MarkType,
	editorState: EditorState,
	type?: string | null | undefined,
): boolean => {
	const selection = editorState.selection;
	if (isSelectionInlineCursor(selection)) {
		return false;
	}

	return toggleMark(mark, { type: type })(editorState);
};

/**
 * Whether a range selection holds any text that can take `markType`, i.e. text whose marks
 * (such as inline code) do not exclude it. Cursor selections return false.
 */
const selectionHasTextAcceptingMark = (editorState: EditorState, markType: MarkType): boolean => {
	const { selection, doc } = editorState;
	if (selection.empty) {
		return false;
	}

	let hasTextAcceptingMark = false;
	for (const { $from, $to } of selection.ranges) {
		doc.nodesBetween($from.pos, $to.pos, (node) => {
			if (hasTextAcceptingMark) {
				return false;
			}
			if (node.isText && !isMarkExcluded(markType, node.marks)) {
				hasTextAcceptingMark = true;
			}
		});
		if (hasTextAcceptingMark) {
			break;
		}
	}
	return hasTextAcceptingMark;
};

/**
 * Whether inline code in the selection should disable `markType`. Behind
 * `platform_editor_style_around_inline_code`, code only disables a mark when no other text in the
 * selection could take it.
 */
const isDisabledByCode = (
	codeInSelection: boolean | undefined,
	markType: MarkType,
	editorState: EditorState,
): boolean => {
	if (!codeInSelection) {
		return false;
	}
	if (fg('platform_editor_style_around_inline_code')) {
		return !selectionHasTextAcceptingMark(editorState, markType);
	}
	return true;
};

const getTextFormattingState = (
	editorState: EditorState,
	_editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): TextFormattingState => {
	const { em, code, strike, strong, subsup, underline } = editorState.schema.marks;
	const state: TextFormattingState = { isInitialised: true };

	const showOnlyCommonMarks = editorExperiment('platform_editor_controls', 'variant1', {
		exposure: true,
	});

	if (showOnlyCommonMarks) {
		// Code marks will disable all other formatting options when they are included in a
		// selection but (for now) we do not want to make it behave differently in regards to which
		// toolbar items are highlighted on selection. We need to track code in selection seperately
		// to ensure all other formatting options are disabled appropriately.
		if (code) {
			state.codeInSelection = anyMarkActive(editorState, code.create());
		}

		const marks = (
			[
				[code, 'code'],
				[em, 'em'],
				[strike, 'strike'],
				[strong, 'strong'],
				[underline, 'underline'],
				[subsup?.create({ type: 'sub' }), 'subscript'],
				[subsup?.create({ type: 'sup' }), 'superscript'],
			] as const
		).filter(([mark]) => mark);

		const marksToName = new Map<Mark | MarkType, (typeof marks)[0][1]>(marks);

		const activeMarks = wholeSelectionHasMarks(editorState, Array.from(marksToName.keys()));

		for (const [mark, markName] of marks) {
			const active = activeMarks.get(mark);
			if (active !== undefined) {
				state[`${markName}Active`] = active;
			}

			const markType = mark instanceof MarkType ? mark : mark.type;
			state[`${markName}Disabled`] =
				// Disable when code is active, except for code itself which should not be disabled
				// when code is in selection 😅
				markName !== 'code' && isDisabledByCode(state.codeInSelection, markType, editorState)
					? true
					: !checkNodeSelection(markType, editorState);
		}

		return state;
	}

	if (code) {
		state.codeActive = anyMarkActive(editorState, code.create());
		state.codeDisabled = !checkNodeSelection(code, editorState);
	}
	if (em) {
		state.emActive = anyMarkActive(editorState, em);
		state.emDisabled = isDisabledByCode(state.codeActive, em, editorState)
			? true
			: !checkNodeSelection(em, editorState);
	}
	if (strike) {
		state.strikeActive = anyMarkActive(editorState, strike);
		state.strikeDisabled = isDisabledByCode(state.codeActive, strike, editorState)
			? true
			: !checkNodeSelection(strike, editorState);
	}
	if (strong) {
		state.strongActive = anyMarkActive(editorState, strong);
		state.strongDisabled = isDisabledByCode(state.codeActive, strong, editorState)
			? true
			: !checkNodeSelection(strong, editorState);
	}
	if (subsup) {
		const subMark = subsup.create({ type: 'sub' });
		const supMark = subsup.create({ type: 'sup' });
		state.subscriptActive = anyMarkActive(editorState, subMark);
		state.superscriptActive = anyMarkActive(editorState, supMark);

		state.subscriptDisabled = isDisabledByCode(state.codeActive, subsup, editorState)
			? true
			: !checkNodeSelection(subsup, editorState, 'sub');
		state.superscriptDisabled = isDisabledByCode(state.codeActive, subsup, editorState)
			? true
			: !checkNodeSelection(subsup, editorState, 'sup');
	}
	if (underline) {
		state.underlineActive = anyMarkActive(editorState, underline);
		state.underlineDisabled = isDisabledByCode(state.codeActive, underline, editorState)
			? true
			: !checkNodeSelection(underline, editorState);
	}
	return state;
};

export const plugin = (
	dispatch: Dispatch,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin<TextFormattingState> =>
	new SafePlugin({
		state: {
			init(_config, state: EditorState): TextFormattingState {
				return getTextFormattingState(state, editorAnalyticsAPI);
			},
			apply(_tr, pluginState: TextFormattingState, _oldState, newState): TextFormattingState {
				const state = getTextFormattingState(newState, editorAnalyticsAPI);
				if (!shallowEqual(pluginState, state)) {
					dispatch(pluginKey, state);
					return state;
				}
				return pluginState;
			},
		},
		key: pluginKey,
		props: {
			handleKeyDown(view: EditorView, event: KeyboardEvent) {
				const { state, dispatch } = view;
				if (event.key === keymapMoveRight.common && !event.metaKey) {
					return commands.moveRight()(state, dispatch);
				} else if (event.key === keymapMoveLeft.common && !event.metaKey) {
					return commands.moveLeft()(state, dispatch);
				} else if (
					event.key === 'u' &&
					event.metaKey &&
					pluginKey.getState(state)?.underlineDisabled &&
					editorExperiment('platform_editor_controls', 'variant1')
				) {
					// This is a workaround for browser behaviour with cmd+u (in Chrome only) where the underline mark being applied around the selection
					event.preventDefault();
				}
				return false;
			},
			handleTextInput(view: EditorView, from: number, to: number, text: string) {
				const { state, dispatch } = view;
				const {
					schema,
					selection: {
						$from: {
							parent: { type: parentNodeType },
						},
					},
				} = state;

				if (parentNodeType.allowsMarkType(schema.marks.code)) {
					return createInlineCodeFromTextInputWithAnalytics(editorAnalyticsAPI)(from, to, text)(
						state,
						dispatch,
					);
				}

				return false;
			},
		},
	});
