import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { type Extension } from '@codemirror/state';
import { type KeyBinding, keymap as cmKeymap } from '@codemirror/view';

import { browser } from '@atlaskit/editor-common/browser';
import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
import type { getPosHandlerNode } from '@atlaskit/editor-common/types';
import { exitCode, selectAll } from '@atlaskit/editor-prosemirror/commands';
import { undo, redo } from '@atlaskit/editor-prosemirror/history';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { EditorView } from '@atlaskit/editor-prosemirror/view';

import { backspaceKeymap } from './backspace';
import { maybeEscapeKeymap } from './maybeEscape';

interface KeymapProps {
	view: EditorView;
	getNode: () => PMNode;
	getPos: getPosHandlerNode;
	selectCodeBlockNode: (relativeSelectionPos: RelativeSelectionPos | undefined) => void;
	onMaybeNodeSelection: () => void;
	customFindReplace: boolean;
}

export const keymapExtension = ({
	view,
	getNode,
	getPos,
	selectCodeBlockNode,
	onMaybeNodeSelection,
	customFindReplace,
}: KeymapProps): Extension => {
	return cmKeymap.of(
		codeBlockKeymap({
			view,
			getNode,
			getPos,
			selectCodeBlockNode,
			onMaybeNodeSelection,
			customFindReplace,
		}),
	);
};

const codeBlockKeymap = ({
	view,
	getNode,
	getPos,
	selectCodeBlockNode,
	onMaybeNodeSelection,
	customFindReplace,
}: KeymapProps): readonly KeyBinding[] => {
	return [
		{
			key: 'ArrowUp',
			run: (cm) =>
				maybeEscapeKeymap({
					unit: 'line',
					dir: -1,
					cm,
					view,
					getNode,
					getPos,
					selectCodeBlockNode,
					onMaybeNodeSelection,
				}),
		},
		{
			key: 'ArrowLeft',
			run: (cm) =>
				maybeEscapeKeymap({
					unit: 'char',
					dir: -1,
					cm,
					view,
					getNode,
					getPos,
					selectCodeBlockNode,
					onMaybeNodeSelection,
				}),
		},
		{
			key: 'ArrowDown',
			run: (cm) =>
				maybeEscapeKeymap({
					unit: 'line',
					dir: 1,
					cm,
					view,
					getNode,
					getPos,
					selectCodeBlockNode,
					onMaybeNodeSelection,
				}),
		},
		{
			key: 'Ctrl-a',
			mac: 'Cmd-a',
			run: (cm) => {
				const isFullBlockSelection =
					cm.state.selection.main.from === 0 &&
					cm.state.selection.main.to === getNode().content.size;

				// Allow codemirror to handle
				if (!isFullBlockSelection) {
					return false;
				}

				// Move the selection and focus into prosemirror
				onMaybeNodeSelection();
				view.focus();
				selectAll(view.state, view.dispatch);
				return true;
			},
		},
		{
			key: 'ArrowRight',
			run: (cm) =>
				maybeEscapeKeymap({
					unit: 'char',
					dir: 1,
					cm,
					view,
					getNode,
					getPos,
					selectCodeBlockNode,
					onMaybeNodeSelection,
				}),
		},
		{
			key: 'Ctrl-f',
			mac: 'Cmd-f',
			run: () => {
				// Pass synthetic event to prosemirror
				if (customFindReplace) {
					view.dispatchEvent(
						new KeyboardEvent('keydown', {
							key: 'f',
							code: 'KeyF',
							metaKey: browser.mac ? true : false,
							ctrlKey: browser.mac ? false : true,
						}),
					);
					return true;
				}
				return false;
			},
		},
		{
			key: 'Ctrl-Enter',
			run: () => {
				if (!exitCode(view.state, view.dispatch)) {
					return false;
				}
				view.focus();
				return true;
			},
		},
		{ key: 'Ctrl-z', mac: 'Cmd-z', run: () => undo(view.state, view.dispatch) },
		{ key: 'Shift-Ctrl-z', mac: 'Shift-Cmd-z', run: () => redo(view.state, view.dispatch) },
		{ key: 'Ctrl-y', mac: 'Cmd-y', run: () => redo(view.state, view.dispatch) },
		{
			key: 'Backspace',
			run: (cm) => backspaceKeymap({ cm, view, getNode, getPos }),
		},
		...defaultKeymap.concat(indentWithTab),
	];
};
