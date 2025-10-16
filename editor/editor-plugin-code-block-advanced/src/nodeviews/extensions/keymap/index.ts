import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { type Extension } from '@codemirror/state';
import { type KeyBinding, keymap as cmKeymap } from '@codemirror/view';

import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import { type RelativeSelectionPos } from '@atlaskit/editor-common/selection';
import type { getPosHandlerNode } from '@atlaskit/editor-common/types';
import { exitCode, selectAll } from '@atlaskit/editor-prosemirror/commands';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { undo, redo } from '@atlaskit/prosemirror-history';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { backspaceKeymap } from './backspace';
import { maybeEscapeKeymap } from './maybeEscape';

interface KeymapProps {
	customFindReplace: boolean;
	getNode: () => PMNode;
	getPos: getPosHandlerNode;
	onMaybeNodeSelection: () => void;
	selectCodeBlockNode: (relativeSelectionPos: RelativeSelectionPos | undefined) => void;
	view: EditorView;
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
	const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
		? getBrowserInfo()
		: browserLegacy;
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
		{
			key: 'Ctrl-Alt-]',
			mac: 'Cmd-Alt-]',
			run: () => {
				// Pass synthetic event to prosemirror
				if (expValEquals('platform_editor_breakout_resizing', 'isEnabled', true)) {
					view.dispatchEvent(
						new KeyboardEvent('keydown', {
							key: ']',
							code: 'BracketRight',
							metaKey: browser.mac ? true : false,
							ctrlKey: browser.mac ? false : true,
							altKey: true,
						}),
					);
					return true;
				}
				return false;
			},
		},
		{
			key: 'Ctrl-Alt-[',
			mac: 'Cmd-Alt-[',
			run: () => {
				// Pass synthetic event to prosemirror
				if (expValEquals('platform_editor_breakout_resizing', 'isEnabled', true)) {
					view.dispatchEvent(
						new KeyboardEvent('keydown', {
							key: ']',
							code: 'BracketLeft',
							metaKey: browser.mac ? true : false,
							ctrlKey: browser.mac ? false : true,
							altKey: true,
						}),
					);
					return true;
				}
				return false;
			},
		},
		...defaultKeymap.concat(indentWithTab),
	];
};
