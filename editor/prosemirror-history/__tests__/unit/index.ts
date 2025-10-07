import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { Slice, Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { EditorState, Plugin, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { history, closeHistory, undo, redo, undoDepth, redoDepth } from '../../src';

const plugin = history();

function mkState(doc?: DocBuilder, config?: any) {
	const plugins = [config ? history(config) : plugin];
	if (config && config.preserveItems) {
		plugins.push(new Plugin({ historyPreserveItems: true } as any));
	}
	return EditorState.create({
		schema,
		plugins: plugins.concat((config && config.plugins) || []),
		doc: doc?.(schema),
	});
}

function type(state: EditorState, text: string) {
	return state.apply(state.tr.insertText(text));
}

type CommandDispatch = (tr: Transaction) => void;
// Duplicated type to avoid circular dependency
type Command = (state: EditorState, dispatch?: CommandDispatch, view?: EditorView) => boolean;
function command(state: EditorState, command: Command) {
	command(state, (tr) => (state = state.apply(tr)));
	return state;
}

function compress(state: EditorState) {
	// NOTE: This is mutating stuff that shouldn't be mutated. Not safe
	// to do outside of these tests.
	plugin.getState(state).done = plugin.getState(state).done.compress();
}

describe('history', () => {
	it('enables undo', () => {
		let state = mkState();
		state = type(state, 'a');
		state = type(state, 'b');
		expect(state.doc).toEqualDocument(doc(p('ab')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p()));
	});

	it('enables redo', () => {
		let state = mkState();
		state = type(state, 'a');
		state = type(state, 'b');
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p()));
		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('ab')));
	});

	it('tracks multiple levels of history', () => {
		let state = mkState();
		state = type(state, 'a');
		state = type(state, 'b');
		state = state.apply(state.tr.insertText('c', 1));
		expect(state.doc).toEqualDocument(doc(p('cab')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('ab')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p()));
		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('ab')));
		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('cab')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('ab')));
	});

	it('starts a new event when newGroupDelay elapses', () => {
		let state = mkState(undefined, { newGroupDelay: 1000 });
		state = state.apply(state.tr.insertText('a').setTime(1000));
		state = state.apply(state.tr.insertText('b').setTime(1600));
		expect(undoDepth(state)).toBe(1);
		state = state.apply(state.tr.insertText('c').setTime(2700));
		expect(undoDepth(state)).toBe(2);
		state = command(state, undo);
		state = state.apply(state.tr.insertText('d').setTime(2800));
		expect(undoDepth(state)).toBe(2);
	});

	it('starts a new event for non-adjacent changes', () => {
		let state = mkState(doc(p('abc')), { newGroupDelay: 1000 });
		state = state.apply(state.tr.insertText('x', 1));
		state = state.apply(state.tr.insertText('y', 5));
		expect(undoDepth(state)).toBe(2);
	});

	it("doesn't get confused by non-replacement steps when checking adjacency", () => {
		let state = mkState(doc(p()), { newGroupDelay: 1000 });
		state = state.apply(state.tr.insertText('x', 1).addMark(1, 2, schema.marks.em.create()));
		state = state.apply(state.tr.insertText('y', 2).addMark(2, 3, schema.marks.em.create()));
		expect(undoDepth(state)).toBe(1);
	});

	it("allows changes that aren't part of the history", () => {
		let state = mkState();
		state = type(state, 'hello');
		state = state.apply(state.tr.insertText('oops', 1).setMeta('addToHistory', false));
		state = state.apply(state.tr.insertText('!', 10).setMeta('addToHistory', false));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('oops!')));
	});

	it("doesn't get confused by an undo not adding any redo item", () => {
		let state = mkState();
		state = state.apply(state.tr.insertText('foo'));
		state = state.apply(
			state.tr.replaceWith(1, 4, schema.text('bar')).setMeta('addToHistory', false),
		);
		state = command(state, undo);
		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('bar')));
	});

	function unsyncedComplex(state: EditorState, doCompress: boolean) {
		state = type(state, 'hello');
		state = state.apply(closeHistory(state.tr));
		state = type(state, '!');
		state = state.apply(state.tr.insertText('....', 1).setMeta('addToHistory', false));
		state = state.apply(state.tr.split(3));
		expect(state.doc).toEqualDocument(doc(p('..'), p('..hello!')));
		state = state.apply(state.tr.split(2).setMeta('addToHistory', false));
		if (doCompress) {
			compress(state);
		}
		state = command(state, undo);
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('.'), p('...hello')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('.'), p('...')));
	}

	it('can handle complex editing sequences', () => {
		unsyncedComplex(mkState(), false);
	});

	it('can handle complex editing sequences with compression', () => {
		unsyncedComplex(mkState(), true);
	});

	it('supports overlapping edits', () => {
		let state = mkState();
		state = type(state, 'hello');
		state = state.apply(closeHistory(state.tr));
		state = state.apply(state.tr.delete(1, 6));
		expect(state.doc).toEqualDocument(doc(p()));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('hello')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p()));
	});

	it("supports overlapping edits that aren't collapsed", () => {
		let state = mkState();
		state = state.apply(state.tr.insertText('h', 1).setMeta('addToHistory', false));
		state = type(state, 'ello');
		state = state.apply(closeHistory(state.tr));
		state = state.apply(state.tr.delete(1, 6));
		expect(state.doc).toEqualDocument(doc(p()));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('hello')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('h')));
	});

	it('supports overlapping unsynced deletes', () => {
		let state = mkState();
		state = type(state, 'hi');
		state = state.apply(closeHistory(state.tr));
		state = type(state, 'hello');
		state = state.apply(state.tr.delete(1, 8).setMeta('addToHistory', false));
		expect(state.doc).toEqualDocument(doc(p()));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p()));
	});

	it('can go back and forth through history multiple times', () => {
		let state = mkState();
		state = type(state, 'one');
		state = type(state, ' two');
		state = state.apply(closeHistory(state.tr));
		state = type(state, ' three');
		state = state.apply(state.tr.insertText('zero ', 1));
		state = state.apply(closeHistory(state.tr));
		state = state.apply(state.tr.split(1));
		state = state.apply(state.tr.setSelection(TextSelection.create(state.doc, 1)));
		state = type(state, 'top');
		for (let i = 0; i < 6; i++) {
			const re = i % 2;
			for (let j = 0; j < 4; j++) {
				state = command(state, re ? redo : undo);
			}
			expect(state.doc).toEqualDocument(re ? doc(p('top'), p('zero one two three')) : doc(p()));
		}
	});

	it('supports non-tracked changes next to tracked changes', () => {
		let state = mkState();
		state = type(state, 'o');
		state = state.apply(state.tr.split(1));
		state = state.apply(state.tr.insertText('zzz', 4).setMeta('addToHistory', false));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('zzz')));
	});

	it('can go back and forth through history when preserving items', () => {
		let state = mkState();
		state = type(state, 'one');
		state = type(state, ' two');
		state = state.apply(closeHistory(state.tr));
		state = state.apply(
			state.tr.insertText('xxx', state.selection.head).setMeta('addToHistory', false),
		);
		state = type(state, ' three');
		state = state.apply(state.tr.insertText('zero ', 1));
		state = state.apply(closeHistory(state.tr));
		state = state.apply(state.tr.split(1));
		state = state.apply(state.tr.setSelection(TextSelection.create(state.doc, 1)));
		state = type(state, 'top');
		state = state.apply(state.tr.insertText('yyy', 1).setMeta('addToHistory', false));
		for (let i = 0; i < 3; i++) {
			// eslint-disable-next-line eqeqeq
			if (i == 2) {
				compress(state);
			}
			for (let j = 0; j < 4; j++) {
				state = command(state, undo);
			}
			expect(state.doc).toEqualDocument(doc(p('yyyxxx')));
			for (let j = 0; j < 4; j++) {
				state = command(state, redo);
			}
			expect(state.doc).toEqualDocument(doc(p('yyytop'), p('zero one twoxxx three')));
		}
	});

	it('restores selection on undo', () => {
		let state = mkState();
		state = type(state, 'hi');
		state = state.apply(closeHistory(state.tr));
		state = state.apply(state.tr.setSelection(TextSelection.create(state.doc, 1, 3)));
		const selection = state.selection;
		state = state.apply(state.tr.replaceWith(selection.from, selection.to, schema.text('hello')));
		const selection2 = state.selection;
		state = command(state, undo);
		expect(state.selection).toStrictEqual(selection);
		state = command(state, redo);
		expect(state.selection).toStrictEqual(selection2);
	});

	it('rebases selection on undo', () => {
		let state = mkState();
		state = type(state, 'hi');
		state = state.apply(closeHistory(state.tr));
		state = state.apply(state.tr.setSelection(TextSelection.create(state.doc, 1, 3)));
		state = state.apply(state.tr.insert(1, schema.text('hello')));
		state = state.apply(state.tr.insert(1, schema.text('---')).setMeta('addToHistory', false));
		state = command(state, undo);
		expect(state.selection.head).toBe(6);
	});

	it('handles change overwriting in item-preserving mode', () => {
		let state = mkState(undefined, { preserveItems: true });
		state = type(state, 'a');
		state = type(state, 'b');
		state = state.apply(closeHistory(state.tr));
		state = state.apply(state.tr.setSelection(TextSelection.create(state.doc, 1, 3)));
		state = type(state, 'c');
		state = command(state, undo);
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p()));
	});

	it('supports querying for the undo and redo depth', () => {
		let state = mkState();
		state = type(state, 'a');
		expect(undoDepth(state)).toBe(1);
		expect(redoDepth(state)).toBe(0);
		state = state.apply(state.tr.insertText('b', 1).setMeta('addToHistory', false));
		expect(undoDepth(state)).toBe(1);
		expect(redoDepth(state)).toBe(0);
		state = command(state, undo);
		expect(undoDepth(state)).toBe(0);
		expect(redoDepth(state)).toBe(1);
		state = command(state, redo);
		expect(undoDepth(state)).toBe(1);
		expect(redoDepth(state)).toBe(0);
	});

	it('all functions gracefully handle EditorStates without history', () => {
		const state = EditorState.create({ schema });
		expect(undoDepth(state)).toBe(0);
		expect(redoDepth(state)).toBe(0);
		expect(undo(state)).toBe(false);
		expect(redo(state)).toBe(false);
	});

	it('truncates history', () => {
		let state = mkState(undefined, { depth: 2 });
		for (let i = 1; i < 40; ++i) {
			state = type(state, 'a');
			state = state.apply(closeHistory(state.tr));
			expect(undoDepth(state)).toBe(((i - 2) % 21) + 2);
		}
	});

	it('supports transactions with multiple steps', () => {
		let state = mkState();
		state = state.apply(state.tr.insertText('a').insertText('b'));
		state = state.apply(state.tr.insertText('c', 1));
		expect(state.doc).toEqualDocument(doc(p('cab')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('ab')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p()));
		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('ab')));
		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('cab')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('ab')));
	});

	it('combines appended transactions in the event started by the base transaction', () => {
		let state = mkState(doc(p('x')), {
			plugins: [
				new Plugin({
					appendTransaction: (_trs, _old, state) => {
						// eslint-disable-next-line eqeqeq
						if (state.doc.content.size == 4) {
							return state.tr.insert(1, schema.text('A'));
						}
					},
				}),
			],
		});
		state = state.apply(state.tr.insert(2, schema.text('I')));
		expect(state.doc).toEqualDocument(doc(p('AxI')));
		expect(undoDepth(state)).toBe(1);
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('x')));
	});

	it('includes transactions appended to undo in the redo history', () => {
		let state = mkState(doc(p('x')), {
			plugins: [
				new Plugin({
					appendTransaction: (trs, _old, state) => {
						const add = trs[0].getMeta('add');
						if (add) {
							return state.tr.insert(1, schema.text(add));
						}
					},
				}),
			],
		});
		state = state.apply(state.tr.insert(2, schema.text('I')).setMeta('add', 'A'));
		expect(state.doc).toEqualDocument(doc(p('AxI')));
		undo(state, (tr) => (state = state.apply(tr.setMeta('add', 'B'))));
		expect(state.doc).toEqualDocument(doc(p('Bx')));
		redo(state, (tr) => (state = state.apply(tr.setMeta('add', 'C'))));
		expect(state.doc).toEqualDocument(doc(p('CAxI')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('Bx')));
	});

	it("doesn't close the history on appended transactions", () => {
		let state = mkState(doc(p('x')), {
			plugins: [
				new Plugin({
					appendTransaction: (trs, _old, state) => {
						const add = trs[0].getMeta('add');
						if (add) {
							return state.tr.insert(1, schema.text(add));
						}
					},
				}),
			],
		});
		state = state.apply(state.tr.insert(2, schema.text('R')).setMeta('add', 'A'));
		state = state.apply(state.tr.insert(3, schema.text('M')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('x')));
	});

	it('supports rebasing', () => {
		// This test simulates a collab editing session where the local editor
		// receives a step (`right`) that's on top of the parent step (`base`) of
		// the last local step (`left`).

		// Shared base step
		let state = mkState();
		state = type(state, 'base');
		state = state.apply(closeHistory(state.tr));
		const baseDoc = state.doc;

		// Local unconfirmed step
		//
		//        - left
		//       /
		// base -
		//       \
		//        - right
		const rightStep = new ReplaceStep(5, 5, new Slice(Fragment.from(schema.text(' right')), 0, 0));
		state = state.apply(state.tr.step(rightStep));
		expect(state.doc).toEqualDocument(doc(p('base right')));
		expect(undoDepth(state)).toBe(2);
		const leftStep = new ReplaceStep(1, 1, new Slice(Fragment.from(schema.text('left ')), 0, 0));

		// Receive remote step and rebase local unconfirmed step
		//
		// base --> left --> right'
		const tr = state.tr;
		tr.step(rightStep.invert(baseDoc));
		tr.step(leftStep);
		tr.step(rightStep.map(tr.mapping.slice(1))!);
		// @ts-expect-error Internal ProseMirror types
		tr.mapping.setMirror(0, tr.steps.length - 1);
		tr.setMeta('addToHistory', false);
		tr.setMeta('rebased', 1);
		state = state.apply(tr);
		expect(state.doc).toEqualDocument(doc(p('left base right')));
		expect(undoDepth(state)).toBe(2);

		// Undo local unconfirmed step
		//
		// base --> left
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('left base')));

		// Redo local unconfirmed step
		//
		// base --> left --> right'
		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('left base right')));
	});

	it('properly maps selection when rebasing', () => {
		let state = mkState(doc(p('123456789ABCD')));
		state = state.apply(state.tr.setSelection(TextSelection.create(state.doc, 6, 13)));
		state = state.apply(state.tr.delete(6, 13));
		const rebase = state.tr
			.insert(6, schema.text('6789ABC'))
			.insert(14, schema.text('E'))
			.delete(6, 13)
			.setMeta('rebased', 1)
			.setMeta('addToHistory', false);
		// @ts-expect-error Internal ProseMirror types
		rebase.mapping.setMirror(0, 2);
		state = state.apply(rebase);
		state = command(state, undo);
		expect(state.selection.toJSON()).toEqual({
			anchor: 6,
			head: 13,
			type: 'text',
		});
	});
});
