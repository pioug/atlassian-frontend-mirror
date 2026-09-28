import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { createHistoryCheckpoint } from '../../src/createHistoryCheckpoint';
import { history } from '../../src/history';
import { redo } from '../../src/redo';
import { redoDepth } from '../../src/redoDepth';
import { undo } from '../../src/undo';
import { undoDepth } from '../../src/undoDepth';

it('rejecting a deletion preserves earlier typing without a duplicate undo event', () => {
	let state = EditorState.create({
		schema,
		plugins: [history()],
		doc: doc(p('Before'), p('Original'), p('After'))(schema),
	});
	const initial = state.doc;
	state = state.apply(state.tr.insertText(' My edit.', state.doc.content.size - 1));
	const edited = state.doc;
	const restore = createHistoryCheckpoint(state);
	const start = state.doc.child(0).nodeSize;
	const end = start + state.doc.child(1).nodeSize;
	const original = state.doc.slice(start, end);
	state = state.apply(state.tr.setMeta('startHistorySlice', true));
	state = state.apply(state.tr.delete(start, end));
	state = state.apply(state.tr.setMeta('endHistorySlice', true));
	state = state.apply(state.tr.replaceRange(start, start, original).setMeta('addToHistory', false));
	expect(state.doc.eq(edited)).toBe(true);
	const restored = restore?.(state);
	expect(restored).toBeTruthy();
	if (restored) {
		state = state.apply(restored);
	}
	undo(state, (tr) => {
		state = state.apply(tr);
	});
	expect(state.doc.eq(initial)).toBe(true);
	redo(state, (tr) => {
		state = state.apply(tr);
	});
	expect(state.doc.eq(edited)).toBe(true);
	expect(undoDepth(state)).toBe(1);
	expect(redoDepth(state)).toBe(0);
});

it('preserves pre-existing redo and creates no history event for a rejected session', () => {
	let state = EditorState.create({ schema, plugins: [history()], doc: doc(p('Original'))(schema) });
	state = state.apply(state.tr.insertText('Before ', 1));
	undo(state, (tr) => {
		state = state.apply(tr);
	});
	const restore = createHistoryCheckpoint(state);
	const original = state.doc;
	state = state.apply(state.tr.setMeta('startHistorySlice', true));
	state = state.apply(state.tr.insertText('AI ', 1));
	state = state.apply(state.tr.setMeta('endHistorySlice', true));
	state = state.apply(state.tr.delete(1, 4).setMeta('addToHistory', false));
	const tr = restore?.(state);
	expect(tr).toBeTruthy();
	if (tr) {
		state = state.apply(tr);
	}
	expect(undoDepth(state)).toBe(0);
	expect(redoDepth(state)).toBe(1);
	undo(state, (tr) => {
		state = state.apply(tr);
	});
	expect(state.doc.eq(original)).toBe(true);
	redo(state, (tr) => {
		state = state.apply(tr);
	});
	expect(state.doc.textContent).toBe('Before Original');
});

it('refuses to restore over a document with retained edits', () => {
	const state = EditorState.create({
		schema,
		plugins: [history()],
		doc: doc(p('Original'))(schema),
	});
	const restore = createHistoryCheckpoint(state);
	const edited = state.apply(state.tr.insertText('Retained ', 1));
	expect(restore?.(edited)).toBeNull();
});

it('does not capture or restore during an active history slice', () => {
	const state = EditorState.create({
		schema,
		plugins: [history()],
		doc: doc(p('Original'))(schema),
	});
	const restore = createHistoryCheckpoint(state);
	const streaming = state.apply(state.tr.setMeta('startHistorySlice', true));
	expect(createHistoryCheckpoint(streaming)).toBeUndefined();
	expect(restore?.(streaming)).toBeNull();
});

it('does not capture without a history plugin or restore into another plugin instance', () => {
	const document = doc(p('Original'))(schema);
	const state = EditorState.create({ schema, plugins: [history()], doc: document });
	const restore = createHistoryCheckpoint(state);
	expect(createHistoryCheckpoint(EditorState.create({ schema, doc: document }))).toBeUndefined();
	expect(restore?.(EditorState.create({ schema, plugins: [history()], doc: document }))).toBeNull();
});
