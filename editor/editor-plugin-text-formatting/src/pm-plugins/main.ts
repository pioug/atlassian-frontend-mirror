// TODO: Ideally this should use the custom toggleMark function from @atlaskit/editor-common so we also disable the options when selecting inline nodes but it disables the marks when the selection is empty at this point in time which is undesirable
// import { toggleMark } from '@atlaskit/editor-common/mark';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import {
	moveLeft as keymapMoveLeft,
	moveRight as keymapMoveRight,
} from '@atlaskit/editor-common/keymaps';
import { anyMarkActive } from '@atlaskit/editor-common/mark';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { TextFormattingState } from '@atlaskit/editor-common/types';
import { shallowEqual } from '@atlaskit/editor-common/utils';
import { toggleMark } from '@atlaskit/editor-prosemirror/commands';
import type { MarkType } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

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

	if (type !== null || type !== undefined) {
		return toggleMark(mark, { type: type })(editorState);
	}

	return toggleMark(mark)(editorState);
};

const getTextFormattingState = (
	editorState: EditorState,
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): TextFormattingState => {
	const { em, code, strike, strong, subsup, underline } = editorState.schema.marks;
	const state: TextFormattingState = {};

	if (code) {
		state.codeActive = anyMarkActive(editorState, code.create());
		state.codeDisabled = !checkNodeSelection(code, editorState);
	}
	if (em) {
		state.emActive = anyMarkActive(editorState, em);
		state.emDisabled = state.codeActive ? true : !checkNodeSelection(em, editorState);
	}
	if (strike) {
		state.strikeActive = anyMarkActive(editorState, strike);
		state.strikeDisabled = state.codeActive ? true : !checkNodeSelection(strike, editorState);
	}
	if (strong) {
		state.strongActive = anyMarkActive(editorState, strong);
		state.strongDisabled = state.codeActive ? true : !checkNodeSelection(strong, editorState);
	}
	if (subsup) {
		const subMark = subsup.create({ type: 'sub' });
		const supMark = subsup.create({ type: 'sup' });
		state.subscriptActive = anyMarkActive(editorState, subMark);
		state.subscriptDisabled = state.codeActive
			? true
			: !checkNodeSelection(subsup, editorState, 'sub');
		state.superscriptActive = anyMarkActive(editorState, supMark);
		state.superscriptDisabled = state.codeActive
			? true
			: !checkNodeSelection(subsup, editorState, 'sup');
	}
	if (underline) {
		state.underlineActive = anyMarkActive(editorState, underline);
		state.underlineDisabled = state.codeActive ? true : !checkNodeSelection(underline, editorState);
	}
	return state;
};

export const plugin = (dispatch: Dispatch, editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	new SafePlugin({
		state: {
			init(_config, state: EditorState): TextFormattingState {
				return getTextFormattingState(state, editorAnalyticsAPI);
			},
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/max-params
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
				}
				return false;
			},
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/max-params
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
