/**
 * Commented out for hot-114295
 */
export const noop = () => {};
// import { defaultKeymap, indentWithTab } from '@codemirror/commands';
// import { Extension } from '@codemirror/state';
// import { KeyBinding, keymap as cmKeymap } from '@codemirror/view';

// import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
// import type { getPosHandlerNode } from '@atlaskit/editor-common/types';
// import { exitCode } from '@atlaskit/editor-prosemirror/commands';
// import { undo, redo } from '@atlaskit/editor-prosemirror/history';
// import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
// import { EditorView } from '@atlaskit/editor-prosemirror/view';

// import { backspaceKeymap } from './backspace';
// import { maybeEscapeKeymap } from './maybeEscape';

// interface KeymapProps {
// 	view: EditorView;
// 	getNode: () => PMNode;
// 	getPos: getPosHandlerNode;
// 	selectCodeBlockNode: (relativeSelectionPos: RelativeSelectionPos | undefined) => void;
// 	onMaybeNodeSelection: () => void;
// }

// export const keymapExtension = ({
// 	view,
// 	getNode,
// 	getPos,
// 	selectCodeBlockNode,
// 	onMaybeNodeSelection,
// }: KeymapProps): Extension => {
// 	return cmKeymap.of(
// 		codeBlockKeymap({ view, getNode, getPos, selectCodeBlockNode, onMaybeNodeSelection }),
// 	);
// };

// const codeBlockKeymap = ({
// 	view,
// 	getNode,
// 	getPos,
// 	selectCodeBlockNode,
// 	onMaybeNodeSelection,
// }: KeymapProps): readonly KeyBinding[] => {
// 	return [
// 		{
// 			key: 'ArrowUp',
// 			run: (cm) =>
// 				maybeEscapeKeymap({
// 					unit: 'line',
// 					dir: -1,
// 					cm,
// 					view,
// 					getNode,
// 					getPos,
// 					selectCodeBlockNode,
// 					onMaybeNodeSelection,
// 				}),
// 		},
// 		{
// 			key: 'ArrowLeft',
// 			run: (cm) =>
// 				maybeEscapeKeymap({
// 					unit: 'char',
// 					dir: -1,
// 					cm,
// 					view,
// 					getNode,
// 					getPos,
// 					selectCodeBlockNode,
// 					onMaybeNodeSelection,
// 				}),
// 		},
// 		{
// 			key: 'ArrowDown',
// 			run: (cm) =>
// 				maybeEscapeKeymap({
// 					unit: 'line',
// 					dir: 1,
// 					cm,
// 					view,
// 					getNode,
// 					getPos,
// 					selectCodeBlockNode,
// 					onMaybeNodeSelection,
// 				}),
// 		},
// 		{
// 			key: 'ArrowRight',
// 			run: (cm) =>
// 				maybeEscapeKeymap({
// 					unit: 'char',
// 					dir: 1,
// 					cm,
// 					view,
// 					getNode,
// 					getPos,
// 					selectCodeBlockNode,
// 					onMaybeNodeSelection,
// 				}),
// 		},
// 		{
// 			key: 'Ctrl-Enter',
// 			run: () => {
// 				if (!exitCode(view.state, view.dispatch)) {
// 					return false;
// 				}
// 				view.focus();
// 				return true;
// 			},
// 		},
// 		{ key: 'Ctrl-z', mac: 'Cmd-z', run: () => undo(view.state, view.dispatch) },
// 		{ key: 'Shift-Ctrl-z', mac: 'Shift-Cmd-z', run: () => redo(view.state, view.dispatch) },
// 		{ key: 'Ctrl-y', mac: 'Cmd-y', run: () => redo(view.state, view.dispatch) },
// 		{
// 			key: 'Backspace',
// 			run: (cm) => backspaceKeymap({ cm, view, getNode, getPos }),
// 		},
// 		...defaultKeymap.concat(indentWithTab),
// 	];
// };
