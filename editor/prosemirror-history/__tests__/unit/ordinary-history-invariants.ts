/**
 * The history fork carries extra machinery for backend agent events. Everything here drives only
 * ordinary human history, with no external-event metadata anywhere, and pins the invariants that
 * must hold exactly as they did before that machinery existed: no item ever gains external
 * metadata, `eventCount` equals the number of bookmark-bearing items, and the external pop path
 * declines every event so the original `popEvent` runs. This is what keeps the feature inert for
 * users who never receive an agent batch (for example with its feature gate off).
 */
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { Branch } from '../../src/branch';
import { closeHistory } from '../../src/closeHistory';
import { history } from '../../src/history';
import { historyKey } from '../../src/historyKey';
import { redo } from '../../src/redo';
import { undo } from '../../src/undo';
import { undoDepth } from '../../src/undoDepth';

type Command = (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean;

const run = (state: EditorState, command: Command): EditorState => {
	command(state, (tr) => (state = state.apply(tr)));
	return state;
};

const mkState = (): EditorState => EditorState.create({ schema, plugins: [history()] });

const branches = (state: EditorState): Branch[] => {
	const hist = historyKey.getState(state)!;
	return [hist.done, hist.undone];
};

const assertOrdinary = (state: EditorState) => {
	for (const branch of branches(state)) {
		let bookmarks = 0;
		branch.items.forEach((item) => {
			expect(item.externalMetadata).toBeUndefined();
			if (item.selection) {
				bookmarks++;
			}
		});
		expect(branch.eventCount).toBe(bookmarks);
		// The external pop path must decline an ordinary branch so `popEvent` runs.
		expect(branch.popExternalEvent(state, false)).toBeNull();
	}
};

describe('ordinary history stays free of external-event state', () => {
	it('after typing, undo and redo', () => {
		let state = mkState();
		state = state.apply(state.tr.insertText('a'));
		state = state.apply(closeHistory(state.tr));
		state = state.apply(state.tr.insertText('b'));
		assertOrdinary(state);

		state = run(state, undo);
		assertOrdinary(state);
		state = run(state, redo);
		assertOrdinary(state);
		expect(state.doc.textContent).toBe('ab');
	});

	it('after a remote step rebased under unconfirmed typing', () => {
		const base = mkState().doc;
		let state = EditorState.create({ schema, plugins: [history()], doc: base });
		const local = state.tr.insertText('L', 1);
		state = state.apply(local);

		// Receive a remote insert and rebase the one unconfirmed local step above it, the same shape
		// the collab plugin produces: invert local, apply remote, reapply the remapped local step.
		const rebase = state.tr;
		rebase.step(local.steps[0].invert(base));
		rebase.insert(1, schema.text('R'));
		const remapped = local.steps[0].map(rebase.mapping.slice(1));
		expect(remapped).not.toBeNull();
		rebase.step(remapped!);
		// @ts-expect-error Internal ProseMirror types
		rebase.mapping.setMirror(0, rebase.steps.length - 1);
		rebase.setMeta('addToHistory', false).setMeta('rebased', 1);

		state = state.apply(rebase);
		assertOrdinary(state);
		expect(undoDepth(state)).toBe(1);

		// The collaborator's text is not undoable; the user's own typing is.
		state = run(state, undo);
		assertOrdinary(state);
		expect(state.doc.textContent).toBe('R');
		expect(undoDepth(state)).toBe(0);
	});

	it('after enough map-only remote steps to trigger compression', () => {
		let state = mkState();
		state = state.apply(state.tr.insertText('a'));
		state = state.apply(closeHistory(state.tr));
		state = state.apply(state.tr.insertText('b'));

		// More than the fork's empty-item threshold, so `addMaps` runs `compress` on the branch.
		const REMOTE_STEPS = 600;
		for (let i = 0; i < REMOTE_STEPS; i++) {
			state = state.apply(state.tr.insertText('x', 1).setMeta('addToHistory', false));
		}
		assertOrdinary(state);
		expect(undoDepth(state)).toBe(2);

		state = run(state, undo);
		assertOrdinary(state);
		state = run(state, undo);
		assertOrdinary(state);
		expect(undoDepth(state)).toBe(0);
		expect(state.doc.textContent).toBe('x'.repeat(REMOTE_STEPS));

		state = run(state, redo);
		state = run(state, redo);
		assertOrdinary(state);
		expect(state.doc.textContent).toHaveLength(REMOTE_STEPS + 2);
	});
});
