import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import type { DocBuilder } from '@atlaskit/editor-common/types/doc-builder';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type {
	EditorState,
	SelectionBookmark,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import {
	EditorState as PMEditorState,
	Plugin,
	TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	blockquote,
	code_block,
	doc,
	inlineExtension,
	li,
	p,
	table,
	td,
	tr as row,
	ul,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { closeHistory, history, redo, redoDepth, undo, undoDepth } from '../../src';
import { Branch } from '../../src/branch';
import {
	EXTERNAL_HISTORY_EVENT_META,
	EXTERNAL_HISTORY_OUTCOME_META,
} from '../../src/external-history-event';
import type {
	ExternalHistoryOutcomeMeta,
	ExternalHistoryPartition,
	ExternalHistoryTransactionMeta,
} from '../../src/external-history-event';
import { historyKey } from '../../src/historyKey';
import type { HistoryState } from '../../src/historyState';

const plugin = history();

// Helpers below are copied from `__tests__/unit/index.ts`, where they are module-local.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mkState(docBuilder?: DocBuilder, config?: any) {
	const plugins = [config ? history(config) : plugin];
	if (config && config.preserveItems) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		plugins.push(new Plugin({ historyPreserveItems: true } as any));
	}
	return PMEditorState.create({
		schema,
		plugins: plugins.concat((config && config.plugins) || []),
		doc: docBuilder?.(schema),
	});
}

function typeText(state: EditorState, text: string) {
	return state.apply(state.tr.insertText(text));
}

type CommandDispatch = (tr: Transaction) => void;
// Duplicated type to avoid circular dependency
type Command = (state: EditorState, dispatch?: CommandDispatch, view?: EditorView) => boolean;
function command(state: EditorState, cmd: Command) {
	cmd(state, (tr) => (state = state.apply(tr)));
	return state;
}

function compress(state: EditorState) {
	// NOTE: This is mutating stuff that shouldn't be mutated. Not safe
	// to do outside of these tests.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(plugin.getState(state) as any).done = (plugin.getState(state) as any).done.compress();
}

const TAB = 'tab-1';

function insertStep(pos: number, text: string) {
	return new ReplaceStep(pos, pos, new Slice(Fragment.from(schema.text(text)), 0, 0));
}

function partition(
	invocationId: string,
	transactionIndexes: readonly number[],
	fromVersion: number,
	toVersion: number,
): ExternalHistoryPartition {
	return { batch: { fromVersion, toVersion }, invocationId, transactionIndexes };
}

function externalMeta(
	overrides: Partial<ExternalHistoryTransactionMeta> = {},
): ExternalHistoryTransactionMeta {
	return {
		editorInstanceId: TAB,
		partitions: [],
		rejections: [],
		remoteTransformRange: { from: 0, to: 0 },
		route: 'direct',
		...overrides,
	};
}

type Insert = { pos: number; text: string };

/**
 * Applies a remote (collaboration) transaction carrying external-history-event metadata.
 * One `ReplaceStep` per entry in `inserts`, so transform indexes line up with `inserts` indexes.
 */
function applyExternal(
	state: EditorState,
	inserts: readonly Insert[],
	meta: ExternalHistoryTransactionMeta,
) {
	const tr = state.tr;
	for (const insert of inserts) {
		tr.step(insertStep(insert.pos, insert.text));
	}
	tr.setMeta('addToHistory', false);
	tr.setMeta('isRemote', true);
	tr.setMeta(EXTERNAL_HISTORY_EVENT_META, meta);
	return state.apply(tr);
}

/** A remote transaction from another collaborator, with no external-history-event metadata. */
function applyUnownedRemote(state: EditorState, inserts: readonly Insert[]) {
	const tr = state.tr;
	for (const insert of inserts) {
		tr.step(insertStep(insert.pos, insert.text));
	}
	tr.setMeta('addToHistory', false);
	tr.setMeta('isRemote', true);
	return state.apply(tr);
}

/** A single-partition direct batch inserting `text` at `pos`. */
function applyBatch(
	state: EditorState,
	pos: number,
	text: string,
	invocationId: string,
	fromVersion: number,
	toVersion: number,
) {
	return applyExternal(
		state,
		[{ pos, text }],
		externalMeta({
			partitions: [partition(invocationId, [0], fromVersion, toVersion)],
			remoteTransformRange: { from: 0, to: 1 },
		}),
	);
}

/**
 * An owned agent batch whose steps are built by `build` on a real transaction, so that scenarios
 * needing structural steps (`delete`, `wrap`, `addMark`, …) are not limited to text inserts.
 * Every step is owned unless `ownedIndexes` says otherwise.
 */
function applyBuiltExternal(
	state: EditorState,
	build: (tr: Transaction) => void,
	overrides: {
		fromVersion?: number;
		invocationId?: string;
		ownedIndexes?: readonly number[];
		toVersion?: number;
	} = {},
) {
	const tr = state.tr;
	build(tr);
	const owned = overrides.ownedIndexes ?? tr.steps.map((_step, index) => index);
	tr.setMeta('addToHistory', false);
	tr.setMeta('isRemote', true);
	tr.setMeta(
		EXTERNAL_HISTORY_EVENT_META,
		externalMeta({
			partitions: [
				partition(
					overrides.invocationId ?? 'inv-1',
					owned,
					overrides.fromVersion ?? 1,
					overrides.toVersion ?? 2,
				),
			],
			remoteTransformRange: { from: 0, to: tr.steps.length },
		}),
	);
	return state.apply(tr);
}

/** An unowned remote (other collaborator) transaction whose steps are built by `build`. */
function applyBuiltRemote(state: EditorState, build: (tr: Transaction) => void) {
	const tr = state.tr;
	build(tr);
	tr.setMeta('addToHistory', false);
	tr.setMeta('isRemote', true);
	return state.apply(tr);
}

type WrapperName = 'blockquote' | 'bulletList' | 'listItem';

/** An unowned remote change that wraps the block containing `pos` in `typeNames`. */
function remoteWrap(state: EditorState, pos: number, typeNames: readonly WrapperName[]) {
	return applyBuiltRemote(state, (tr) => {
		const $pos = tr.doc.resolve(pos);
		const range = $pos.blockRange($pos);
		tr.wrap(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			range!,
			typeNames.map((name) => ({ type: schema.nodes[name] })),
		);
	});
}

/** An unowned remote change that lifts the block containing `pos` out to the top level. */
function remoteLift(state: EditorState, pos: number) {
	return applyBuiltRemote(state, (tr) => {
		const $pos = tr.doc.resolve(pos);
		const range = $pos.blockRange($pos);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tr.lift(range!, 0);
	});
}

/** Runs a command, capturing its return value and every transaction it dispatched. */
function runCommand(state: EditorState, cmd: Command) {
	const dispatched: Transaction[] = [];
	let next = state;
	const handled = cmd(state, (transaction) => {
		dispatched.push(transaction);
		next = next.apply(transaction);
	});
	return { dispatched, handled, state: next };
}

function outcomeOf(transaction: Transaction): ExternalHistoryOutcomeMeta | undefined {
	return transaction.getMeta(EXTERNAL_HISTORY_OUTCOME_META);
}

function historyStateOf(state: EditorState): HistoryState {
	return historyKey.getState(state) as HistoryState;
}

function externalMetadataOfBranch(branch: Branch) {
	const result: unknown[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	branch.items.forEach((item: any) => {
		if (item.externalMetadata) {
			result.push(item.externalMetadata);
		}
	});
	return result;
}

function externalMetadataOf(state: EditorState) {
	return externalMetadataOfBranch(historyStateOf(state).done);
}

function externalMetadataOfUndone(state: EditorState) {
	return externalMetadataOfBranch(historyStateOf(state).undone);
}

function doneItemCount(state: EditorState) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (historyKey.getState(state) as any).done.items.length;
}

/**
 * The inverse step of the oldest item in `done`, as JSON. Used to prove that an operation left the
 * items below it untouched rather than removing and rewriting them.
 */
function oldestDoneStep(state: EditorState) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const item = (historyKey.getState(state) as any).done.items.get(0);
	return item.step ? item.step.toJSON() : undefined;
}

/**
 * `popEvent` walks backwards for a bookmark-bearing item with no lower bound, so `eventCount` must
 * always equal the number of items carrying a selection bookmark.
 */
function bookmarkCountOfBranch(branch: Branch) {
	let count = 0;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	branch.items.forEach((item: any) => {
		if (item.selection) {
			count++;
		}
	});
	return count;
}

function bookmarkCount(state: EditorState) {
	return bookmarkCountOfBranch(historyStateOf(state).done);
}

/**
 * Local history: `base` (closed event) then an unconfirmed ` right` step.
 * Then a rebased receive that promotes one owned remote step (`left `).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stateWithRebasedPromotion(config?: any) {
	let state = mkState(undefined, config);
	state = typeText(state, 'base');
	state = state.apply(closeHistory(state.tr));
	const baseDoc = state.doc;
	const rightStep = insertStep(5, ' right');
	state = state.apply(state.tr.step(rightStep));
	const leftStep = insertStep(1, 'left ');

	const tr = state.tr;
	tr.step(rightStep.invert(baseDoc));
	tr.step(leftStep);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	tr.step(rightStep.map(tr.mapping.slice(1))!);
	// @ts-expect-error Internal ProseMirror types
	tr.mapping.setMirror(0, tr.steps.length - 1);
	tr.setMeta('addToHistory', false);
	tr.setMeta('isRemote', true);
	tr.setMeta('rebased', 1);
	tr.setMeta(
		EXTERNAL_HISTORY_EVENT_META,
		externalMeta({
			route: 'rebased',
			partitions: [partition('inv-1', [1], 1, 2)],
			remoteTransformRange: { from: 1, to: 2 },
		}),
	);
	return state.apply(tr);
}

describe('external history event: direct route', () => {
	it('promotes the first agent batch on a fresh editor', () => {
		let state = mkState(doc(p('hello')));
		expect(undoDepth(state)).toBe(0);

		state = applyBatch(state, 6, ' world', 'inv-1', 1, 2);

		expect(state.doc).toEqualDocument(doc(p('hello world')));
		expect(undoDepth(state)).toBe(1);
		expect(redoDepth(state)).toBe(0);
	});

	it('reverses the whole selected run in one undo, leaving unowned steps in place', () => {
		let state = mkState(doc(p('AB')));

		state = applyExternal(
			state,
			[
				{ pos: 1, text: 'x' },
				{ pos: 4, text: '1' },
				{ pos: 5, text: '2' },
				{ pos: 1, text: 'y' },
			],
			externalMeta({
				partitions: [partition('inv-1', [1, 2], 1, 2)],
				remoteTransformRange: { from: 1, to: 3 },
			}),
		);
		expect(state.doc).toEqualDocument(doc(p('yxAB12')));
		expect(undoDepth(state)).toBe(1);

		state = command(state, undo);

		expect(state.doc).toEqualDocument(doc(p('yxAB')));
		expect(undoDepth(state)).toBe(0);
	});

	it('redo reapplies the promoted run', () => {
		let state = mkState(doc(p('AB')));
		state = applyExternal(
			state,
			[
				{ pos: 1, text: 'x' },
				{ pos: 4, text: '1' },
				{ pos: 5, text: '2' },
				{ pos: 1, text: 'y' },
			],
			externalMeta({
				partitions: [partition('inv-1', [1, 2], 1, 2)],
				remoteTransformRange: { from: 1, to: 3 },
			}),
		);
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('yxAB')));

		state = command(state, redo);

		expect(state.doc).toEqualDocument(doc(p('yxAB12')));
		expect(undoDepth(state)).toBe(1);
	});

	it('creates one event per partition, in transaction order', () => {
		let state = mkState(doc(p('start')));

		state = applyExternal(
			state,
			[
				{ pos: 6, text: '-A' },
				{ pos: 8, text: '-B' },
			],
			externalMeta({
				partitions: [partition('inv-1', [0], 1, 2), partition('inv-2', [1], 2, 3)],
				remoteTransformRange: { from: 0, to: 2 },
			}),
		);
		expect(state.doc).toEqualDocument(doc(p('start-A-B')));
		expect(undoDepth(state)).toBe(2);
		expect(bookmarkCount(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('start-A')));

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('start')));
		expect(undoDepth(state)).toBe(0);
	});

	it('starts a new event for human typing straight after a batch', () => {
		let state = mkState(doc(p('hi')), { newGroupDelay: 1000 });
		state = state.apply(state.tr.insertText('a', 3).setTime(1000));
		expect(undoDepth(state)).toBe(1);
		expect(historyStateOf(state).prevRanges).toEqual([3, 4]);

		// The agent inserts *before* the human's range, so that range moves from [3, 4] to [4, 5].
		// Typing at 5 below is therefore adjacent to the mapped range but not to the unmapped one,
		// which is what makes the reset load-bearing rather than incidental.
		state = applyBatch(state, 1, 'Z', 'inv-1', 1, 2);
		expect(state.doc).toEqualDocument(doc(p('Zhia')));
		expect(undoDepth(state)).toBe(2);

		// Promotion performs the grouping reset itself, so nothing about the human's event
		// survives it to be grouped against.
		expect(historyStateOf(state).prevTime).toBe(0);
		expect(historyStateOf(state).prevRanges).toBeNull();

		// Inside newGroupDelay and adjacent to where the human's text now sits: this would join the
		// human's event if promotion had carried `prevTime` and `prevRanges` across.
		state = state.apply(state.tr.insertText('b', 5).setTime(1200));

		expect(state.doc).toEqualDocument(doc(p('Zhiab')));
		expect(undoDepth(state)).toBe(3);
	});
});

describe('external history event: rebased route', () => {
	it('keeps unconfirmed local history and promotes the remote run', () => {
		const state = stateWithRebasedPromotion();

		expect(state.doc).toEqualDocument(doc(p('left base right')));
		expect(undoDepth(state)).toBe(3);
		// One kept confirmed item, one promoted remote item, one remapped local item.
		expect(doneItemCount(state)).toBe(3);
		expect(bookmarkCount(state)).toBe(3);
	});

	it('undoes the remapped local step, then the promoted remote event, then the base event', () => {
		let state = stateWithRebasedPromotion();

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('left base')));
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('base')));
		expect(undoDepth(state)).toBe(1);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p()));
		expect(undoDepth(state)).toBe(0);
	});

	it('keeps the promoted remote event undoable after newer local history', () => {
		let state = stateWithRebasedPromotion();

		state = state.apply(state.tr.insertText('!', 16));
		expect(state.doc).toEqualDocument(doc(p('left base right!')));
		expect(undoDepth(state)).toBe(4);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('left base right')));

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('left base')));

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('base')));
	});

	it('starts a new event for a same-invocation batch after a rebased promotion', () => {
		let state = stateWithRebasedPromotion();
		expect(undoDepth(state)).toBe(3);

		state = applyBatch(state, 16, '?', 'inv-1', 2, 3);

		expect(state.doc).toEqualDocument(doc(p('left base right?')));
		expect(undoDepth(state)).toBe(4);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('left base right')));
	});

	it('promotes a rebased receive whose remote change deleted the unconfirmed local step', () => {
		// `rebaseSteps` pushes no reapplied step, and sets no mirror, when the remote change
		// deleted the unconfirmed local one. The promoted item is then the newest item in the
		// branch, with nothing above it, and the next same-invocation batch is still its own event.
		let state = mkState();
		state = typeText(state, 'base');
		state = state.apply(closeHistory(state.tr));
		const baseDoc = state.doc;
		const rightStep = insertStep(5, ' right');
		state = state.apply(state.tr.step(rightStep));
		expect(undoDepth(state)).toBe(2);

		const tr = state.tr;
		tr.step(rightStep.invert(baseDoc));
		tr.step(insertStep(1, 'left '));
		tr.setMeta('addToHistory', false);
		tr.setMeta('isRemote', true);
		tr.setMeta('rebased', 1);
		tr.setMeta(
			EXTERNAL_HISTORY_EVENT_META,
			externalMeta({
				route: 'rebased',
				partitions: [partition('inv-1', [1], 1, 2)],
				remoteTransformRange: { from: 1, to: 2 },
			}),
		);
		state = state.apply(tr);

		expect(state.doc).toEqualDocument(doc(p('left base')));
		expect(undoDepth(state)).toBe(2);
		// The promoted item is on top, with nothing above it.
		expect(doneItemCount(state)).toBe(2);

		state = applyBatch(state, 10, '!', 'inv-1', 2, 3);

		expect(state.doc).toEqualDocument(doc(p('left base!')));
		expect(undoDepth(state)).toBe(3);
		expect(bookmarkCount(state)).toBe(3);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('left base')));
	});

	it('promotes a rebased receive when the branch is empty', () => {
		let state = mkState(doc(p('base')));
		const baseDoc = state.doc;
		const localStep = insertStep(1, 'L');
		state = state.apply(state.tr.step(localStep).setMeta('addToHistory', false));
		expect(state.doc).toEqualDocument(doc(p('Lbase')));
		expect(undoDepth(state)).toBe(0);

		const remoteStep = insertStep(5, ' REM');
		const tr = state.tr;
		tr.step(localStep.invert(baseDoc));
		tr.step(remoteStep);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tr.step(localStep.map(tr.mapping.slice(1))!);
		// @ts-expect-error Internal ProseMirror types
		tr.mapping.setMirror(0, tr.steps.length - 1);
		tr.setMeta('addToHistory', false);
		tr.setMeta('isRemote', true);
		tr.setMeta('rebased', 1);
		tr.setMeta(
			EXTERNAL_HISTORY_EVENT_META,
			externalMeta({
				route: 'rebased',
				partitions: [partition('inv-1', [1], 1, 2)],
				remoteTransformRange: { from: 1, to: 2 },
			}),
		);
		state = state.apply(tr);

		expect(state.doc).toEqualDocument(doc(p('Lbase REM')));
		expect(undoDepth(state)).toBe(1);
		// One promoted remote item, plus a map-only item for the remapped local step, which is
		// not represented by a rebased item because it was never in the branch.
		expect(doneItemCount(state)).toBe(2);

		state = command(state, undo);

		expect(state.doc).toEqualDocument(doc(p('Lbase')));
		expect(undoDepth(state)).toBe(0);
	});
});

describe('external history event: one batch is one event', () => {
	it('starts a second event for a consecutive same-invocation batch', () => {
		// One reconcile arrives as one receive, so a follow-up batch of the same invocation is rare
		// and is deliberately not folded into the previous event: each batch is its own undo event,
		// and the batches undo newest first.
		let state = mkState(doc(p('a')));

		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);
		expect(undoDepth(state)).toBe(1);

		state = applyBatch(state, 3, '2', 'inv-1', 2, 3);

		expect(state.doc).toEqualDocument(doc(p('a12')));
		expect(undoDepth(state)).toBe(2);
		expect(doneItemCount(state)).toBe(2);
		expect(bookmarkCount(state)).toBe(2);
		expect(externalMetadataOf(state)).toEqual([
			{ editorInstanceId: 'tab-1', invocationId: 'inv-1' },
			{ editorInstanceId: 'tab-1', invocationId: 'inv-1' },
		]);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a1')));
		expect(undoDepth(state)).toBe(1);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a')));
		expect(undoDepth(state)).toBe(0);
	});

	it('starts a new event after human typing', () => {
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);
		state = state.apply(state.tr.insertText('h', 3));
		expect(undoDepth(state)).toBe(2);

		state = applyBatch(state, 4, '2', 'inv-1', 2, 3);

		expect(state.doc).toEqualDocument(doc(p('a1h2')));
		expect(undoDepth(state)).toBe(3);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a1h')));
	});

	it('starts a new event after an unowned remote transaction', () => {
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);

		state = applyUnownedRemote(state, [{ pos: 1, text: 'q' }]);
		expect(state.doc).toEqualDocument(doc(p('qa1')));
		expect(undoDepth(state)).toBe(1);

		state = applyBatch(state, 4, '2', 'inv-1', 2, 3);

		expect(state.doc).toEqualDocument(doc(p('qa12')));
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('qa1')));

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('qa')));
	});

	it('starts a new event for a different invocation', () => {
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);

		state = applyBatch(state, 3, '2', 'inv-2', 1, 2);

		expect(state.doc).toEqualDocument(doc(p('a12')));
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a1')));
	});

	it('starts a new event after an undo', () => {
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);
		state = applyBatch(state, 3, '2', 'inv-2', 1, 2);
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a1')));
		expect(undoDepth(state)).toBe(1);

		state = applyBatch(state, 3, '3', 'inv-2', 2, 3);

		expect(state.doc).toEqualDocument(doc(p('a13')));
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a1')));
	});

	it('keeps same-invocation batches as separate events through undo and redo', () => {
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);
		state = applyBatch(state, 3, '2', 'inv-1', 2, 3);
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a1')));
		expect(redoDepth(state)).toBe(1);

		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('a12')));
		expect(undoDepth(state)).toBe(2);
		expect(redoDepth(state)).toBe(0);

		state = applyBatch(state, 4, '3', 'inv-1', 3, 4);

		expect(state.doc).toEqualDocument(doc(p('a123')));
		expect(undoDepth(state)).toBe(3);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a12')));
	});

	it('starts a new event for the same invocation from a different editor instance', () => {
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);
		expect(undoDepth(state)).toBe(1);

		// Same invocation, different tab: both keep their own identity and their own event.
		state = applyExternal(
			state,
			[{ pos: 3, text: '2' }],
			externalMeta({
				editorInstanceId: 'tab-2',
				partitions: [partition('inv-1', [0], 2, 3)],
				remoteTransformRange: { from: 0, to: 1 },
			}),
		);

		expect(state.doc).toEqualDocument(doc(p('a12')));
		expect(undoDepth(state)).toBe(2);
		expect(bookmarkCount(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a1')));
	});

	it('appends only a map-only item for a partition whose indexes do not exist', () => {
		// `remoteTransformRange` and `transactionIndexes` are transaction metadata, so a producer
		// regression can point them outside `[0, tr.steps.length)`. The clamp in
		// `buildExternalItems` makes that degrade to "not promoted" instead of throwing, and the
		// next same-invocation batch is an ordinary new event on top of the map-only item.
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);
		expect(undoDepth(state)).toBe(1);

		// One step, but the partition claims transform index 3, which does not exist.
		state = applyExternal(
			state,
			[{ pos: 3, text: 'Q' }],
			externalMeta({
				partitions: [partition('inv-1', [3], 2, 3)],
				remoteTransformRange: { from: 0, to: 1 },
			}),
		);
		expect(state.doc).toEqualDocument(doc(p('a1Q')));
		// A map-only item was appended and nothing was promoted.
		expect(undoDepth(state)).toBe(1);
		expect(doneItemCount(state)).toBe(2);
		expect(bookmarkCount(state)).toBe(1);

		state = applyBatch(state, 4, '2', 'inv-1', 3, 4);

		expect(state.doc).toEqualDocument(doc(p('a1Q2')));
		expect(undoDepth(state)).toBe(2);
		expect(bookmarkCount(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a1Q')));
		expect(undoDepth(state)).toBe(1);
	});

	it('starts a new event after an unknown appended transaction', () => {
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);

		const appendedSource = state.tr;
		state = state.apply(state.tr.insertText('h', 3).setMeta('appendedTransaction', appendedSource));
		expect(undoDepth(state)).toBe(2);

		state = applyBatch(state, 4, '2', 'inv-1', 2, 3);

		expect(state.doc).toEqualDocument(doc(p('a1h2')));
		expect(undoDepth(state)).toBe(3);
	});
});

describe('external history event: fork invariants', () => {
	it('creates exactly one item per transform map', () => {
		let state = mkState(doc(p('AB')));

		state = applyExternal(
			state,
			[
				{ pos: 1, text: 'x' },
				{ pos: 4, text: '1' },
				{ pos: 5, text: '2' },
				{ pos: 1, text: 'y' },
			],
			externalMeta({
				partitions: [partition('inv-1', [1, 2], 1, 2)],
				remoteTransformRange: { from: 1, to: 3 },
			}),
		);
		expect(doneItemCount(state)).toBe(4);
		expect(externalMetadataOf(state)).toEqual([
			{
				editorInstanceId: 'tab-1',
				invocationId: 'inv-1',
			},
			{
				editorInstanceId: 'tab-1',
				invocationId: 'inv-1',
			},
		]);

		state = applyUnownedRemote(state, [{ pos: 1, text: 'q' }]);
		expect(state.doc).toEqualDocument(doc(p('qyxAB12')));
		expect(doneItemCount(state)).toBe(5);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('qyxAB')));
	});

	it('clears redo when a batch is promoted', () => {
		let state = mkState(doc(p('hi')));
		state = state.apply(state.tr.insertText('!', 3));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('hi')));
		expect(undoDepth(state)).toBe(0);
		expect(redoDepth(state)).toBe(1);

		state = applyBatch(state, 1, 'Z', 'inv-1', 1, 2);

		expect(state.doc).toEqualDocument(doc(p('Zhi')));
		expect(undoDepth(state)).toBe(1);
		expect(redoDepth(state)).toBe(0);
	});

	it('respects the configured depth and DEPTH_OVERFLOW', () => {
		let state = mkState(doc(p('a')), { depth: 2 });
		let pos = 2;
		for (let i = 0; i < 22; i++) {
			state = applyBatch(state, pos, 'x', `inv-${i}`, i + 1, i + 2);
			pos++;
		}
		expect(undoDepth(state)).toBe(22);

		state = applyBatch(state, pos, 'x', 'inv-22', 23, 24);

		expect(undoDepth(state)).toBe(2);
		expect(doneItemCount(state)).toBe(2);
		expect(bookmarkCount(state)).toBe(2);
	});

	it('respects the configured depth and DEPTH_OVERFLOW on the rebased route', () => {
		let state = mkState(doc(p('a')), { depth: 2 });
		let pos = 2;
		for (let i = 0; i < 22; i++) {
			state = applyBatch(state, pos, 'x', `inv-${i}`, i + 1, i + 2);
			pos++;
		}
		expect(undoDepth(state)).toBe(22);

		// An unconfirmed local step for the rebase to invert. `addToHistory: false` keeps it a
		// map-only item so the event count stays at the DEPTH_OVERFLOW boundary rather than
		// tripping the direct route's trimming first.
		const baseDoc = state.doc;
		const localStep = insertStep(1, 'L');
		state = state.apply(state.tr.step(localStep).setMeta('addToHistory', false));
		expect(undoDepth(state)).toBe(22);
		expect(doneItemCount(state)).toBe(23);

		const tr = state.tr;
		tr.step(localStep.invert(baseDoc));
		tr.step(insertStep(pos, 'R'));
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tr.step(localStep.map(tr.mapping.slice(1))!);
		// @ts-expect-error Internal ProseMirror types
		tr.mapping.setMirror(0, tr.steps.length - 1);
		tr.setMeta('addToHistory', false);
		tr.setMeta('isRemote', true);
		tr.setMeta('rebased', 1);
		tr.setMeta(
			EXTERNAL_HISTORY_EVENT_META,
			externalMeta({
				route: 'rebased',
				partitions: [partition('inv-22', [1], 23, 24)],
				remoteTransformRange: { from: 1, to: 2 },
			}),
		);
		state = state.apply(tr);

		// 23 events minus an overflow of 21: the rebased route trims to the configured depth just
		// as the direct route does.
		expect(undoDepth(state)).toBe(2);
		expect(doneItemCount(state)).toBe(3);
		expect(bookmarkCount(state)).toBe(2);
	});

	it('preserves external metadata through compress and refuses a cross-boundary merge', () => {
		let state = mkState(doc(p('a')));
		state = applyExternal(
			state,
			[
				{ pos: 2, text: '1' },
				{ pos: 3, text: '2' },
			],
			externalMeta({
				partitions: [partition('inv-1', [0, 1], 1, 2)],
				remoteTransformRange: { from: 0, to: 2 },
			}),
		);
		expect(undoDepth(state)).toBe(1);

		state = state.apply(state.tr.insertText('h', 4));
		expect(state.doc).toEqualDocument(doc(p('a12h')));
		expect(undoDepth(state)).toBe(2);

		compress(state);

		expect(undoDepth(state)).toBe(2);
		expect(externalMetadataOf(state)).toEqual([
			{
				editorInstanceId: 'tab-1',
				invocationId: 'inv-1',
			},
			{
				editorInstanceId: 'tab-1',
				invocationId: 'inv-1',
			},
		]);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a12')));

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a')));
		expect(undoDepth(state)).toBe(0);
	});

	it('keeps external metadata on an item produced by a merge inside compress', () => {
		let state = mkState(doc(p('a')));
		// Three inserts at the same position, so that after compression the two upper items — the
		// ones with no bookmark — are mergeable with each other.
		state = applyExternal(
			state,
			[
				{ pos: 2, text: '1' },
				{ pos: 2, text: '2' },
				{ pos: 2, text: '3' },
			],
			externalMeta({
				partitions: [partition('inv-1', [0, 1, 2], 1, 2)],
				remoteTransformRange: { from: 0, to: 3 },
			}),
		);
		expect(state.doc).toEqualDocument(doc(p('a321')));
		expect(undoDepth(state)).toBe(1);
		expect(doneItemCount(state)).toBe(3);

		compress(state);

		// Two of the three items merged into one, and the merged item must still be identifiable
		// as the agent's. Losing the metadata here would let a later human step merge into it.
		expect(doneItemCount(state)).toBe(2);
		expect(externalMetadataOf(state)).toEqual([
			{
				editorInstanceId: 'tab-1',
				invocationId: 'inv-1',
			},
			{
				editorInstanceId: 'tab-1',
				invocationId: 'inv-1',
			},
		]);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a')));
		expect(undoDepth(state)).toBe(0);
	});

	it('keeps external metadata when an unowned remote transaction rebases the promoted event', () => {
		let state = mkState(doc(p('base')));
		const baseDoc = state.doc;
		state = applyBatch(state, 5, ' AGENT', 'inv-1', 1, 2);
		expect(state.doc).toEqualDocument(doc(p('base AGENT')));
		expect(undoDepth(state)).toBe(1);
		expect(doneItemCount(state)).toBe(1);

		// An unowned remote rebase that reaches down over the promoted item — `Branch.rebased`
		// removes it and rebuilds it. The rebuilt copy must keep the agent's identity: without it
		// the event becomes indistinguishable from human history, and `canMerge` stops refusing
		// cross-boundary merges into it.
		const agentStep = insertStep(5, ' AGENT');
		const tr = state.tr;
		tr.step(agentStep.invert(baseDoc));
		tr.step(insertStep(1, 'R'));
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tr.step(agentStep.map(tr.mapping.slice(1))!);
		// @ts-expect-error Internal ProseMirror types
		tr.mapping.setMirror(0, tr.steps.length - 1);
		tr.setMeta('addToHistory', false);
		tr.setMeta('isRemote', true);
		tr.setMeta('rebased', 1);
		state = state.apply(tr);

		expect(state.doc).toEqualDocument(doc(p('Rbase AGENT')));
		expect(undoDepth(state)).toBe(1);
		expect(externalMetadataOf(state)).toEqual([
			{
				editorInstanceId: 'tab-1',
				invocationId: 'inv-1',
			},
		]);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('Rbase')));
	});

	it('refuses to merge an appended human step into an external item', () => {
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);
		expect(doneItemCount(state)).toBe(1);

		const appendedRedo = state.tr.setMeta(historyKey, { redo: true });
		state = state.apply(state.tr.insertText('h', 3).setMeta('appendedTransaction', appendedRedo));

		expect(state.doc).toEqualDocument(doc(p('a1h')));
		expect(doneItemCount(state)).toBe(2);
	});

	it('keeps a batch after a compressed map-only barrier as its own event', () => {
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);

		state = applyUnownedRemote(state, [{ pos: 1, text: 'q' }]);
		expect(state.doc).toEqualDocument(doc(p('qa1')));

		compress(state);
		expect(undoDepth(state)).toBe(1);
		expect(doneItemCount(state)).toBe(1);

		state = applyBatch(state, 4, '2', 'inv-1', 2, 3);

		expect(state.doc).toEqualDocument(doc(p('qa12')));
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('qa1')));

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('qa')));
	});

	// A receive that lands after the slice has already tracked a step is not promoted. Promoting it
	// leaves an event that becomes permanently un-undoable once the slice is undone, when the
	// agent's change sits after the slice's step: `endHistorySlice` rebuilds the slice transform
	// against a re-baselined document without remapping the items below it, so the promoted item's
	// inverse keeps positions that still contain the slice's step. That is a defect of the slice
	// model, reproducible with no external metadata, so such a receive stays map-only until the
	// slice re-baselining is fixed. A slice that has tracked nothing yet is safe.
	it('does not promote a direct receive that lands after the slice tracked a step', () => {
		let state = mkState(doc(p('s')));
		state = state.apply(state.tr.setMeta('startHistorySlice', true));
		state = state.apply(state.tr.insertText('L', 2));
		expect(state.doc).toEqualDocument(doc(p('sL')));

		// The agent inserts *after* the slice's own step: the position that used to become an
		// event whose undo was a silent no-op.
		state = applyBatch(state, 3, 'X', 'inv-1', 1, 2);
		expect(state.doc).toEqualDocument(doc(p('sLX')));
		expect(undoDepth(state)).toBe(0);
		expect(doneItemCount(state)).toBe(0);

		state = state.apply(state.tr.setMeta('endHistorySlice', true));
		expect(undoDepth(state)).toBe(1);

		// The slice undoes cleanly and leaves the agent's text alone, and no dead event remains.
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('sX')));
		expect(undoDepth(state)).toBe(0);
	});

	it('does not promote a direct receive before the slice step either, once a step is tracked', () => {
		let state = mkState(doc(p('s')));
		state = state.apply(state.tr.setMeta('startHistorySlice', true));
		state = state.apply(state.tr.insertText('L', 2));

		state = applyBatch(state, 1, 'X', 'inv-1', 1, 2);
		expect(state.doc).toEqualDocument(doc(p('XsL')));
		expect(undoDepth(state)).toBe(0);

		state = state.apply(state.tr.setMeta('endHistorySlice', true));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('Xs')));
		expect(undoDepth(state)).toBe(0);
	});

	it('promotes a receive that lands in a slice which has not tracked a step yet', () => {
		let state = mkState(doc(p('s')));
		state = state.apply(state.tr.setMeta('startHistorySlice', true));

		state = applyBatch(state, 2, 'X', 'inv-1', 1, 2);
		expect(state.doc).toEqualDocument(doc(p('sX')));
		expect(undoDepth(state)).toBe(1);

		// The slice's own step lands above the agent item, in the right frame.
		state = state.apply(state.tr.insertText('L', 3));
		expect(state.doc).toEqualDocument(doc(p('sXL')));
		expect(undoDepth(state)).toBe(1);

		state = state.apply(state.tr.setMeta('endHistorySlice', true));
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('sX')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('s')));
		expect(undoDepth(state)).toBe(0);
	});

	it('promotes the next batch normally once the slice has ended', () => {
		let state = mkState(doc(p('s')));
		state = state.apply(state.tr.setMeta('startHistorySlice', true));
		state = state.apply(state.tr.insertText('L', 2));
		state = applyBatch(state, 3, 'X', 'inv-1', 1, 2);
		expect(undoDepth(state)).toBe(0);
		state = state.apply(state.tr.setMeta('endHistorySlice', true));
		expect(undoDepth(state)).toBe(1);

		state = applyBatch(state, 4, 'Y', 'inv-1', 2, 3);
		expect(state.doc).toEqualDocument(doc(p('sLXY')));
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('sLX')));
	});

	it('leaves confirmed history alone when a rebased receive arrives after the slice tracked a step', () => {
		let state = mkState(doc(p('')));
		state = typeText(state, 'hello');
		state = state.apply(closeHistory(state.tr));
		expect(undoDepth(state)).toBe(1);
		expect(doneItemCount(state)).toBe(1);

		state = state.apply(state.tr.setMeta('startHistorySlice', true));
		const baseDoc = state.doc;
		const localStep = insertStep(1, 'L');
		state = state.apply(state.tr.step(localStep));
		expect(state.doc).toEqualDocument(doc(p('Lhello')));
		// The in-slice step is held in `trackedSteps`, so it adds no item to `done` — but collab
		// still counts it as unconfirmed and reports `rebased: 1` below.
		expect(undoDepth(state)).toBe(1);
		expect(doneItemCount(state)).toBe(1);
		const confirmedStep = oldestDoneStep(state);

		const remoteStep = insertStep(6, ' REM');
		const tr = state.tr;
		tr.step(localStep.invert(baseDoc));
		tr.step(remoteStep);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tr.step(localStep.map(tr.mapping.slice(1))!);
		// @ts-expect-error Internal ProseMirror types
		tr.mapping.setMirror(0, tr.steps.length - 1);
		tr.setMeta('addToHistory', false);
		tr.setMeta('isRemote', true);
		tr.setMeta('rebased', 1);
		tr.setMeta(
			EXTERNAL_HISTORY_EVENT_META,
			externalMeta({
				route: 'rebased',
				partitions: [partition('inv-1', [1], 1, 2)],
				remoteTransformRange: { from: 1, to: 2 },
			}),
		);
		state = state.apply(tr);
		expect(state.doc).toEqualDocument(doc(p('Lhello REM')));
		// Not promoted: the only event is the confirmed one, and its inverse step is untouched.
		expect(undoDepth(state)).toBe(1);
		expect(oldestDoneStep(state)).toEqual(confirmedStep);
	});

	it('treats rejected-only metadata as an ordinary map-only receive', () => {
		let state = mkState(doc(p('hi')));
		state = state.apply(state.tr.insertText('!', 3));
		state = command(state, undo);
		expect(undoDepth(state)).toBe(0);
		expect(redoDepth(state)).toBe(1);

		const tr = state.tr;
		tr.step(insertStep(1, 'r'));
		tr.setMeta('addToHistory', false);
		tr.setMeta('isRemote', true);
		tr.setMeta(
			EXTERNAL_HISTORY_EVENT_META,
			externalMeta({
				rejections: [{ rawIndexes: [0], reason: 'not-owned' }],
				remoteTransformRange: { from: 0, to: 1 },
			}),
		);
		state = state.apply(tr);

		expect(state.doc).toEqualDocument(doc(p('rhi')));
		expect(undoDepth(state)).toBe(0);
		expect(redoDepth(state)).toBe(1);

		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('rhi!')));
	});

	it('preserves appended transaction behaviour after a promotion', () => {
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);

		const appendedSource = state.tr;
		state = state.apply(state.tr.insertText('h', 3).setMeta('appendedTransaction', appendedSource));
		expect(state.doc).toEqualDocument(doc(p('a1h')));
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a1')));

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a')));
	});
});

describe('external history event: Branch-level guards', () => {
	it('ignores a partition with no transaction indexes', () => {
		// `applyTransaction` filters empty partitions out before it promotes anything, so this
		// guard is only reachable by calling the `Branch` method directly. It is kept because an
		// empty partition has no oldest index to bookmark, and `Math.min()` of nothing is Infinity.
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);
		const done = historyStateOf(state).done;

		const tr = state.tr;
		tr.step(insertStep(3, '2'));
		const { branch: promoted, events } = done.addDirectExternalEvents(
			tr,
			[partition('inv-1', [], 2, 3), partition('inv-1', [0], 3, 4)],
			state.selection.getBookmark(),
			TAB,
			{ depth: 100, newGroupDelay: 500 },
		);

		expect(promoted.eventCount).toBe(2);
		// Only the second partition contributes an event.
		expect(events).toBe(1);
		expect(externalMetadataOfBranch(promoted)).toEqual([
			{ editorInstanceId: 'tab-1', invocationId: 'inv-1' },
			{ editorInstanceId: 'tab-1', invocationId: 'inv-1' },
		]);
	});

	it('counts no event for a remapped item that the rebase does not put back', () => {
		// A mirror position below `remoteTransformRange.to` is not producible by `rebaseSteps`, but
		// if it ever were, the remapped item would be dropped (the promoted item occupies that map)
		// while its bookmark had already been counted. `eventCount > bookmarkCount` makes
		// `popEvent`'s unbounded backward scan run off the start of the branch and throw.
		let state = mkState(doc(p('a')));
		state = typeText(state, 'b');
		const done = historyStateOf(state).done;
		expect(done.eventCount).toBe(1);

		const localStep = insertStep(3, 'c');
		const tr = state.tr;
		tr.step(localStep);
		tr.step(insertStep(1, 'R'));
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tr.step(localStep.map(tr.mapping.slice(1))!);
		// Mirrors map index 0 onto 1 — inside the remote run rather than above it.
		// @ts-expect-error Internal ProseMirror types
		tr.mapping.setMirror(0, 1);

		const rebased = done.rebaseWithExternalEvents(
			tr,
			1,
			[partition('inv-1', [1], 1, 2)],
			{ from: 1, to: 2 },
			state.selection.getBookmark(),
			TAB,
			{ depth: 100, newGroupDelay: 500 },
		);

		expect(rebased.branch.eventCount).toBe(bookmarkCountOfBranch(rebased.branch));
		expect(rebased.branch.eventCount).toBe(1);
	});

	it('declines to promote transform indexes that do not exist rather than throwing', () => {
		// `remoteTransformRange` and `transactionIndexes` are transaction metadata, so a producer
		// regression can point past the end of the transform. That must degrade to "not promoted",
		// not to a `TypeError` inside `EditorState.apply`, which would fail the whole transaction.
		const state = mkState(doc(p('a')));
		const tr = state.tr;
		tr.step(insertStep(2, '1'));
		tr.step(insertStep(3, '2'));
		tr.step(insertStep(4, '3'));

		let rebased: ReturnType<Branch['rebaseWithExternalEvents']> | undefined;
		expect(() => {
			rebased = Branch.empty.rebaseWithExternalEvents(
				tr,
				1,
				[partition('inv-1', [1, 4], 1, 2)],
				{ from: 1, to: 5 },
				state.selection.getBookmark(),
				TAB,
				{ depth: 100, newGroupDelay: 500 },
			);
		}).not.toThrow();

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(rebased!.branch.eventCount).toBe(bookmarkCountOfBranch(rebased!.branch));
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(rebased!.branch.eventCount).toBe(1);
	});
});

/**
 * The batch identity of every scenario below, so a blocked-outcome expectation reads as one object.
 */
function blocked(operation: 'redo' | 'undo', reason: string): ExternalHistoryOutcomeMeta {
	return {
		editorInstanceId: TAB,
		operation,
		outcome: 'blocked',
		reason: reason as ExternalHistoryOutcomeMeta['reason'],
		// A refused event can never be applied, so history drops it.
		eventDiscarded: true,
	};
}

function succeeded(operation: 'redo' | 'undo'): ExternalHistoryOutcomeMeta {
	return { editorInstanceId: TAB, operation, outcome: 'succeeded' };
}

describe('external history event: atomic external undo', () => {
	it('maps a promoted event through a non-overlapping later remote edit', () => {
		let state = mkState(doc(p('hello'), p('world')));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		expect(state.doc).toEqualDocument(doc(p('heXYllo'), p('world')));

		// Well clear of the agent's range: the inverse only needs shifting, not rewriting.
		state = applyBuiltRemote(state, (tr) => tr.step(insertStep(12, '!')));
		expect(state.doc).toEqualDocument(doc(p('heXYllo'), p('wo!rld')));

		const { dispatched, handled, state: after } = runCommand(state, undo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(p('hello'), p('wo!rld')));
		expect(undoDepth(after)).toBe(0);
		expect(redoDepth(after)).toBe(1);
		expect(outcomeOf(dispatched[0])).toEqual(succeeded('undo'));
	});

	it('blocks an undo whose inverse step is overwritten by an overlapping remote edit', () => {
		let state = mkState(doc(p('hello')));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		// Deletes a strict superset of the agent's inserted range, so both ends of the inverse are
		// deleted across and `ReplaceStep.map` returns null.
		state = applyBuiltRemote(state, (tr) => tr.delete(2, 6));
		expect(state.doc).toEqualDocument(doc(p('hlo')));

		const { dispatched, handled, state: after } = runCommand(state, undo);

		expect(handled).toBe(true);
		// Before this task the event was popped anyway: the document stayed `hlo` while
		// `undoDepth` fell to 0, so the agent's edit became permanently unreachable.
		expect(after.doc).toEqualDocument(doc(p('hlo')));
		expect(undoDepth(after)).toBe(0);
		expect(redoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'required-step-unmappable'));
	});

	it('blocks an undo whose target node was removed', () => {
		let state = mkState(doc(p('hello'), p('tail')));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		// The whole paragraph the agent edited goes away.
		state = applyBuiltRemote(state, (tr) => tr.delete(0, 9));
		expect(state.doc).toEqualDocument(doc(p('tail')));

		const { dispatched, handled, state: after } = runCommand(state, undo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(p('tail')));
		expect(undoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'required-step-unmappable'));
	});

	it('blocks an undo when the text the agent marked has been deleted', () => {
		// Mark structure failure: the inverse is a `RemoveMarkStep`, and `RemoveMarkStep.map`
		// returns null once its range has collapsed.
		let state = mkState(doc(p('hello')));
		state = applyBuiltExternal(state, (tr) => tr.addMark(2, 5, schema.marks.strong.create()));
		state = applyBuiltRemote(state, (tr) => tr.delete(2, 5));
		expect(state.doc).toEqualDocument(doc(p('ho')));

		const { dispatched, handled, state: after } = runCommand(state, undo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(p('ho')));
		expect(undoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'required-step-unmappable'));
	});

	it('blocks an undo whose restored list content is deeper than the position it must go back to', () => {
		// List structure failure: the agent deleted across two list items, so its inverse slice is
		// open to depth 2. Once a collaborator lifts the content out of the list, the insertion
		// position is only one level deep and `ReplaceStep.apply` reports
		// "Inserted content deeper than insertion position".
		let state = mkState(doc(ul(li(p('ab')), li(p('cd')))));
		state = applyBuiltExternal(state, (tr) => tr.delete(4, 10));
		expect(state.doc).toEqualDocument(doc(ul(li(p('ad')))));

		state = remoteLift(state, 4);
		expect(state.doc).toEqualDocument(doc(p('ad')));

		const { dispatched, handled, state: after } = runCommand(state, undo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(p('ad')));
		expect(undoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'mapped-step-failed'));
	});

	it('blocks an undo that would restore a table where tables are not allowed', () => {
		// Table structure failure. The agent deleted a table; a collaborator then wrapped the
		// following paragraph in a blockquote, which moves the re-insertion point inside it, and
		// `blockquote` cannot hold a table.
		let state = mkState(doc(table()(row(td()(p('a')))), p('x')));
		const tableSize = state.doc.child(0).nodeSize;
		state = applyBuiltExternal(state, (tr) => tr.delete(0, tableSize));
		expect(state.doc).toEqualDocument(doc(p('x')));

		state = remoteWrap(state, 1, ['blockquote']);
		expect(state.doc).toEqualDocument(doc(blockquote(p('x'))));

		const { dispatched, handled, state: after } = runCommand(state, undo);

		expect(handled).toBe(true);
		// Before this task this case did not merely drop the step: `maybeStep` threw
		// `RangeError: Invalid content for node blockquote` straight out of the undo command.
		expect(after.doc).toEqualDocument(doc(blockquote(p('x'))));
		expect(undoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'mapped-step-failed'));
	});

	it('blocks an undo that would restore an inline extension into a code block', () => {
		// Extension structure failure: `codeBlock` holds text only.
		let state = mkState(
			doc(p('a', inlineExtension({ extensionKey: 'k', extensionType: 't' })(), 'b')),
		);
		state = applyBuiltExternal(state, (tr) => tr.delete(2, 3));
		expect(state.doc).toEqualDocument(doc(p('ab')));

		state = applyBuiltRemote(state, (tr) => tr.setBlockType(1, 1, schema.nodes.codeBlock));
		expect(state.doc).toEqualDocument(doc(code_block()('ab')));

		const { dispatched, handled, state: after } = runCommand(state, undo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(code_block()('ab')));
		expect(undoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'mapped-step-failed'));
	});

	it('leaves the document unchanged and drops the refused event from the done branch', () => {
		let state = mkState(doc(p('hello')));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		state = applyBuiltRemote(state, (tr) => tr.delete(2, 6));
		const beforeDoc = state.doc;

		const { state: after } = runCommand(state, undo);

		expect(after.doc).toBe(beforeDoc);
		expect(undoDepth(after)).toBe(0);
		// A refused event is not moved to the redo branch: it was never undone.
		expect(redoDepth(after)).toBe(0);
	});

	it('reports a blocked undo as handled and dispatches only outcome metadata', () => {
		let state = mkState(doc(p('hello')));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		state = applyBuiltRemote(state, (tr) => tr.delete(2, 6));

		const { dispatched, handled } = runCommand(state, undo);

		// `true` keeps the browser's own DOM undo from running on top of ours.
		expect(handled).toBe(true);
		expect(dispatched).toHaveLength(1);
		expect(dispatched[0].steps).toHaveLength(0);
		expect(dispatched[0].docChanged).toBe(false);
		expect(dispatched[0].getMeta('addToHistory')).toBe(false);
		// No history meta, so nothing moves between branches.
		expect(dispatched[0].getMeta(historyKey)).toBeUndefined();
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'required-step-unmappable'));
	});

	it('blocks under preserveItems too', () => {
		// With `preserveItems` the remapping is built up front rather than lazily at the first
		// map-only item, so the blocking path is reached through different code.
		let state = mkState(doc(p('hello')), { preserveItems: true });
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		state = applyBuiltRemote(state, (tr) => tr.delete(2, 6));

		const { dispatched, state: after } = runCommand(state, undo);

		expect(after.doc).toEqualDocument(doc(p('hlo')));
		expect(undoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'required-step-unmappable'));
	});

	it('leaves ordinary human undo on the inherited path', () => {
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);
		state = state.apply(state.tr.insertText('h', 3));
		expect(undoDepth(state)).toBe(2);

		const { dispatched, state: after } = runCommand(state, undo);

		expect(after.doc).toEqualDocument(doc(p('a1')));
		expect(undoDepth(after)).toBe(1);
		// A human event carries no external metadata, so no outcome is reported for it.
		expect(outcomeOf(dispatched[0])).toBeUndefined();
	});
});

describe('external history event: atomic external redo', () => {
	it('maps a redone event through a non-overlapping later remote edit', () => {
		let state = mkState(doc(p('hello'), p('world')));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('hello'), p('world')));

		state = applyBuiltRemote(state, (tr) => tr.step(insertStep(10, '!')));
		expect(state.doc).toEqualDocument(doc(p('hello'), p('wo!rld')));

		const { dispatched, handled, state: after } = runCommand(state, redo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(p('heXYllo'), p('wo!rld')));
		expect(undoDepth(after)).toBe(1);
		expect(redoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(succeeded('redo'));
	});

	it('blocks a redo whose forward step is overwritten by an overlapping remote edit', () => {
		let state = mkState(doc(p('hello')));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		state = command(state, undo);
		state = applyBuiltRemote(state, (tr) => tr.delete(1, 5));
		expect(state.doc).toEqualDocument(doc(p('o')));
		expect(redoDepth(state)).toBe(1);

		const { dispatched, handled, state: after } = runCommand(state, redo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(p('o')));
		expect(redoDepth(after)).toBe(0);
		expect(undoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('redo', 'required-step-unmappable'));
	});

	it('blocks a redo whose target node was removed', () => {
		let state = mkState(doc(p('hello'), p('tail')));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		state = command(state, undo);
		state = applyBuiltRemote(state, (tr) => tr.delete(0, 7));
		expect(state.doc).toEqualDocument(doc(p('tail')));

		const { dispatched, handled, state: after } = runCommand(state, redo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(p('tail')));
		expect(redoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('redo', 'required-step-unmappable'));
	});

	it('blocks a redo when the text the agent marked has been deleted', () => {
		let state = mkState(doc(p('hello')));
		state = applyBuiltExternal(state, (tr) => tr.addMark(2, 5, schema.marks.strong.create()));
		state = command(state, undo);
		state = applyBuiltRemote(state, (tr) => tr.delete(1, 6));
		expect(state.doc).toEqualDocument(doc(p()));

		const { dispatched, handled, state: after } = runCommand(state, redo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(p()));
		expect(redoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('redo', 'required-step-unmappable'));
	});

	it('blocks a redo that would put a table inside a list item', () => {
		// List structure failure in the redo direction: the position the agent's table has to go
		// back to is now inside a `listItem`, which cannot hold a table.
		let state = mkState(doc(p('x')));
		state = applyBuiltExternal(state, (tr) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			tr.insert(0, schema.nodes.table.createAndFill()!);
		});
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('x')));

		state = remoteWrap(state, 1, ['bulletList', 'listItem']);
		expect(state.doc).toEqualDocument(doc(ul(li(p('x')))));

		const { dispatched, handled, state: after } = runCommand(state, redo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(ul(li(p('x')))));
		expect(redoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('redo', 'mapped-step-failed'));
	});

	it('blocks a redo that would put a table where tables are not allowed', () => {
		let state = mkState(doc(p('x')));
		state = applyBuiltExternal(state, (tr) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			tr.insert(0, schema.nodes.table.createAndFill()!);
		});
		state = command(state, undo);
		state = remoteWrap(state, 1, ['blockquote']);
		expect(state.doc).toEqualDocument(doc(blockquote(p('x'))));

		const { dispatched, handled, state: after } = runCommand(state, redo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(blockquote(p('x'))));
		expect(redoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('redo', 'mapped-step-failed'));
	});

	it('blocks a redo that would put an inline extension into a code block', () => {
		let state = mkState(doc(p('ab')));
		state = applyBuiltExternal(state, (tr) => {
			tr.insert(
				2,
				schema.nodes.inlineExtension.createChecked({
					extensionKey: 'k',
					extensionType: 't',
				}),
			);
		});
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('ab')));

		state = applyBuiltRemote(state, (tr) => tr.setBlockType(1, 1, schema.nodes.codeBlock));

		const { dispatched, handled, state: after } = runCommand(state, redo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(code_block()('ab')));
		expect(redoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('redo', 'mapped-step-failed'));
	});

	it('leaves the document unchanged and drops the refused event from the undone branch', () => {
		let state = mkState(doc(p('hello')));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		state = command(state, undo);
		state = applyBuiltRemote(state, (tr) => tr.delete(1, 5));
		const beforeDoc = state.doc;

		const { state: after } = runCommand(state, redo);

		expect(after.doc).toBe(beforeDoc);
		expect(redoDepth(after)).toBe(0);
		expect(undoDepth(after)).toBe(0);
	});

	it('reports a blocked redo as handled and dispatches only outcome metadata', () => {
		let state = mkState(doc(p('hello')));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		state = command(state, undo);
		state = applyBuiltRemote(state, (tr) => tr.delete(1, 5));

		const { dispatched, handled } = runCommand(state, redo);

		expect(handled).toBe(true);
		expect(dispatched).toHaveLength(1);
		expect(dispatched[0].steps).toHaveLength(0);
		expect(dispatched[0].docChanged).toBe(false);
		expect(dispatched[0].getMeta('addToHistory')).toBe(false);
		expect(dispatched[0].getMeta(historyKey)).toBeUndefined();
		expect(outcomeOf(dispatched[0])).toEqual(blocked('redo', 'required-step-unmappable'));
	});

	it('carries the event identity onto the redo branch and back', () => {
		// Without this the redo branch holds ordinary, anonymous history: `canMerge` stops refusing
		// cross-boundary merges into it (T4-L2), and a redo can never be preflighted atomically.
		const identity = { editorInstanceId: TAB, invocationId: 'inv-1' };
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);
		expect(externalMetadataOf(state)).toEqual([identity]);

		state = command(state, undo);
		expect(externalMetadataOf(state)).toEqual([]);
		expect(externalMetadataOfUndone(state)).toEqual([identity]);

		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('a1')));
		expect(externalMetadataOf(state)).toEqual([identity]);
		expect(externalMetadataOfUndone(state)).toEqual([]);
	});

	it('keeps a redone event atomic, so a later conflict blocks its undo', () => {
		let state = mkState(doc(p('hello')));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		state = command(state, undo);
		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('heXYllo')));
		expect(undoDepth(state)).toBe(1);

		state = applyBuiltRemote(state, (tr) => tr.delete(2, 6));

		const { dispatched, state: after } = runCommand(state, undo);

		expect(after.doc).toEqualDocument(doc(p('hlo')));
		expect(undoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'required-step-unmappable'));
	});

	it('keeps a redone agent run out of the next human event when compressed', () => {
		// T4-L2: `compress`'s merge is cross-event and is refused only on the *older* item's
		// bookmark, so an item of a redone agent run that has no bookmark of its own can be
		// absorbed into the human event above it unless it still carries external metadata. Two
		// inserts at non-adjacent positions, so `addTransform` cannot merge the run into one item
		// when it lands back on `done`.
		let state = mkState(doc(p('abcdef')));
		state = applyExternal(
			state,
			[
				{ pos: 2, text: '1' },
				{ pos: 5, text: '2' },
			],
			externalMeta({
				partitions: [partition('inv-1', [0, 1], 1, 2)],
				remoteTransformRange: { from: 0, to: 2 },
			}),
		);
		expect(state.doc).toEqualDocument(doc(p('a1bc2def')));
		expect(undoDepth(state)).toBe(1);

		state = command(state, undo);
		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('a1bc2def')));
		expect(doneItemCount(state)).toBe(2);
		expect(externalMetadataOf(state)).toHaveLength(2);

		// Immediately after the agent's first insert, so the human's inverse is adjacent to the
		// agent item's and `ReplaceStep.merge` would otherwise join them inside `compress`.
		state = state.apply(state.tr.insertText('h', 3));
		expect(state.doc).toEqualDocument(doc(p('a1hbc2def')));
		expect(undoDepth(state)).toBe(2);

		compress(state);

		// Both agent items keep their identity, so neither can be folded into the human event.
		expect(externalMetadataOf(state)).toHaveLength(2);
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a1bc2def')));

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('abcdef')));
		expect(undoDepth(state)).toBe(0);
	});
});

describe('external history event: a blocked operation during a history slice', () => {
	/**
	 * A single receive whose owned step is made unmappable by an unowned step in the *same*
	 * transaction, applied during an active history slice. The slice matters because the
	 * history-slice branch of `applyTransaction` rebuilds the state for every transaction it sees,
	 * so only the step-free outcome guard keeps the state object untouched there.
	 */
	function stateWithSelfConflictingBatch(invocationId = 'inv-1') {
		let state = mkState(doc(p('hello')));
		state = state.apply(state.tr.setMeta('startHistorySlice', true));
		return applyBuiltExternal(
			state,
			(tr) => {
				tr.step(insertStep(3, 'XY'));
				tr.delete(2, 6);
			},
			{ invocationId, ownedIndexes: [0] },
		);
	}

	it('drops the refused event and keeps the slice state when a blocked undo happens mid-slice', () => {
		const state = stateWithSelfConflictingBatch();
		expect(state.doc).toEqualDocument(doc(p('hlo')));
		expect(undoDepth(state)).toBe(1);
		const before = historyStateOf(state);

		const { dispatched, state: after } = runCommand(state, undo);

		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'required-step-unmappable'));
		expect(undoDepth(after)).toBe(0);
		expect(historyStateOf(after).historySliceActive).toBe(before.historySliceActive);
		expect(historyStateOf(after).trackedSteps).toBe(before.trackedSteps);
	});
});

describe('external history event: preflight guards', () => {
	it('blocks an external pop whose event mixes invocation identities', () => {
		// `promoteExternalEvent` will not build this — every partition starts its own event — so
		// it is only reachable by appending bookmark-less items with a different identity onto an
		// external event directly, as `addTransform` does for the opposite branch on undo and redo.
		// It is guarded because the outcome metadata reports a single batch identity, which would
		// be a lie for an event assembled from two.
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);

		const tr = state.tr;
		tr.step(insertStep(3, '2'));
		const mixed = historyStateOf(state).done.addTransform(
			tr,
			undefined,
			{ depth: 100, newGroupDelay: 500 },
			false,
			{ editorInstanceId: TAB, invocationId: 'inv-2' },
		);
		expect(mixed.eventCount).toBe(1);

		const result = mixed.popExternalEvent(state.apply(tr), false);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(result!.ok).toBe(false);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(result!.ok === false && result!.reason).toBe('inconsistent-metadata');
	});

	it('blocks an external pop whose selection bookmark cannot be resolved', () => {
		// A bookmark recorded against a longer document. `SelectionBookmark.resolve` throws a
		// RangeError for a position past the end of the document, which before this task escaped
		// `histTransaction` and took the whole command with it.
		const wide = mkState(doc(p('hello world')));
		const staleBookmark = TextSelection.create(wide.doc, 12).getBookmark();

		let state = mkState(doc(p('a')));
		const tr = state.tr;
		tr.step(insertStep(2, 'Z'));
		const { branch } = Branch.empty.addDirectExternalEvents(
			tr,
			[partition('inv-1', [0], 1, 2)],
			staleBookmark,
			TAB,
			{ depth: 100, newGroupDelay: 500 },
		);
		state = state.apply(tr);

		const result = branch.popExternalEvent(state, false);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(result!.ok).toBe(false);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(result!.ok === false && result!.reason).toBe('selection-unresolvable');
	});

	it('blocks an external pop whose selection bookmark cannot be mapped', () => {
		// A bookmark is an interface, not a fixed set of classes: editor plugins ship their own
		// (prosemirror-tables' cell selection, for one), and mapping one is allowed to throw. The
		// three bookmarks in prosemirror-state cannot, so this uses a stub — without it the throw
		// would escape `popExternalEvent`, `histTransaction` and the command, which is the exact
		// failure mode this task exists to remove.
		const unmappable: SelectionBookmark = {
			map: () => {
				throw new RangeError('this bookmark cannot be mapped');
			},
			resolve: (docNode) => TextSelection.create(docNode, 1),
		};
		// `buildExternalItems` maps the bookmark once as it records it, so the throwing one has to
		// be what that mapping produces.
		const throwingBookmark: SelectionBookmark = {
			map: () => unmappable,
			resolve: (docNode) => TextSelection.create(docNode, 1),
		};

		let state = mkState(doc(p('a')), { preserveItems: true });
		const tr = state.tr;
		tr.step(insertStep(2, 'Z'));
		const { branch } = Branch.empty.addDirectExternalEvents(
			tr,
			[partition('inv-1', [0], 1, 2)],
			throwingBookmark,
			TAB,
			{ depth: 100, newGroupDelay: 500 },
		);
		state = state.apply(tr);

		// `preserveItems` builds the remapping up front, so the bookmark is mapped rather than used
		// as recorded.
		const result = branch.popExternalEvent(state, true);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(result!.ok).toBe(false);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(result!.ok === false && result!.reason).toBe('selection-unresolvable');
	});

	it('blocks an external pop whose step cannot apply to the document it is given', () => {
		// The only case that reaches the non-`preserveItems` arm of the walk with a failing step:
		// every conflict produced through the plugin puts map-only items above the event (a later
		// remote edit, or `addMaps` for an `addToHistory: false` change), and the first of those
		// builds the remapping — after which every step goes through the mapped arm instead. So
		// this arm is only reachable by a direct caller handing the branch a document it never saw.
		let state = mkState(doc(p('hello')));
		const tr = state.tr;
		tr.step(insertStep(2, 'Z'));
		const { branch } = Branch.empty.addDirectExternalEvents(
			tr,
			[partition('inv-1', [0], 1, 2)],
			state.selection.getBookmark(),
			TAB,
			{ depth: 100, newGroupDelay: 500 },
		);
		state = state.apply(tr);
		expect(branch.eventCount).toBe(1);

		// The event's inverse deletes 2..3, which does not exist in an empty paragraph.
		const result = branch.popExternalEvent(mkState(doc(p())), false);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(result!.ok).toBe(false);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(result!.ok === false && result!.reason).toBe('mapped-step-failed');
	});

	it('declines a branch whose event count does not match its bookmarks', () => {
		// `popEvent`'s `for (;; end--)` walks off the start of the rope and throws on a branch like
		// this. `popExternalEvent` is reachable from a direct `Branch` caller, so it is bounded and
		// declines instead: it survives the `eventCount === bookmarkCount` invariant being broken
		// rather than relying on it.
		const state = mkState(doc(p('a')));
		const mapsOnly = Branch.empty.addMaps([insertStep(2, 'Z').getMap()]);
		const corrupt = new Branch(mapsOnly.items, 1);

		expect(corrupt.popExternalEvent(state, false)).toBeNull();
	});

	it('declines an event that is not external so the inherited pop still runs it', () => {
		let state = mkState(doc(p('a')));
		state = typeText(state, 'b');
		expect(undoDepth(state)).toBe(1);

		expect(historyStateOf(state).done.popExternalEvent(state, false)).toBeNull();
		expect(Branch.empty.popExternalEvent(state, false)).toBeNull();
	});

	it('reports the popped event metadata and a remaining branch on success', () => {
		let state = mkState(doc(p('a')));
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);
		const done = historyStateOf(state).done;

		const result = done.popExternalEvent(state, false);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		expect(result!.ok).toBe(true);
		if (result && result.ok) {
			expect(result.externalMetadata).toEqual({
				editorInstanceId: TAB,
				invocationId: 'inv-1',
			});
			expect(result.transform.doc).toEqualDocument(doc(p('a')));
			expect(result.remaining.eventCount).toBe(0);
			// The branch it was asked to pop from is untouched.
			expect(done.eventCount).toBe(1);
		}
	});
});

describe('external history event: with preserveItems', () => {
	it('promotes and undoes a direct batch', () => {
		let state = mkState(doc(p('AB')), { preserveItems: true });

		state = applyExternal(
			state,
			[
				{ pos: 1, text: 'x' },
				{ pos: 4, text: '1' },
				{ pos: 5, text: '2' },
				{ pos: 1, text: 'y' },
			],
			externalMeta({
				partitions: [partition('inv-1', [1, 2], 1, 2)],
				remoteTransformRange: { from: 1, to: 3 },
			}),
		);
		expect(state.doc).toEqualDocument(doc(p('yxAB12')));
		expect(undoDepth(state)).toBe(1);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('yxAB')));

		state = command(state, redo);
		expect(state.doc).toEqualDocument(doc(p('yxAB12')));
	});

	it('promotes consecutive same-invocation batches as separate events', () => {
		let state = mkState(doc(p('a')), { preserveItems: true });
		state = applyBatch(state, 2, '1', 'inv-1', 1, 2);
		state = applyBatch(state, 3, '2', 'inv-1', 2, 3);

		expect(state.doc).toEqualDocument(doc(p('a12')));
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a1')));

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('a')));
	});

	it('promotes on the rebased route', () => {
		let state = stateWithRebasedPromotion({ preserveItems: true });

		expect(state.doc).toEqualDocument(doc(p('left base right')));
		expect(undoDepth(state)).toBe(3);

		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('left base')));
	});
});

describe('external history event: compression keeps an unmappable event refused', () => {
	/**
	 * Two owned inserts, then a collaborator deletes a strict superset of the second one so its
	 * inverse can no longer be mapped. `compress` must not turn this into a smaller event that
	 * undoes only the first insert.
	 */
	function stateWithUnmappableTail() {
		let state = mkState(doc(p('abcd')));
		state = applyBuiltExternal(state, (tr) => {
			tr.step(insertStep(2, 'X'));
			tr.step(insertStep(5, 'Y'));
		});
		expect(state.doc).toEqualDocument(doc(p('aXbcYd')));
		state = applyBuiltRemote(state, (tr) => tr.delete(4, 7));
		expect(state.doc).toEqualDocument(doc(p('aXb')));
		return state;
	}

	function compressUndone(state: EditorState) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(plugin.getState(state) as any).undone = (plugin.getState(state) as any).undone.compress();
	}

	it('still refuses the undo after an explicit compression', () => {
		const state = stateWithUnmappableTail();
		expect(outcomeOf(runCommand(state, undo).dispatched[0])).toEqual(
			blocked('undo', 'required-step-unmappable'),
		);

		compress(state);
		const { dispatched, handled, state: after } = runCommand(state, undo);

		expect(handled).toBe(true);
		expect(after.doc).toEqualDocument(doc(p('aXb')));
		expect(undoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'required-step-unmappable'));
	});

	it('keeps the event boundary when the unmappable step carried the bookmark', () => {
		let state = mkState(doc(p('abcd')));
		state = state.apply(state.tr.insertText('Z', 5));
		state = state.apply(closeHistory(state.tr));
		state = applyBuiltExternal(state, (tr) => {
			tr.step(insertStep(2, 'X'));
			tr.step(insertStep(5, 'Y'));
		});
		expect(state.doc).toEqualDocument(doc(p('aXbcYdZ')));
		// Deletes a strict superset of the first owned insert, which holds the event's bookmark.
		state = applyBuiltRemote(state, (tr) => tr.delete(1, 4));
		expect(state.doc).toEqualDocument(doc(p('cYdZ')));
		expect(undoDepth(state)).toBe(2);

		compress(state);
		const { dispatched, state: after } = runCommand(state, undo);

		// Losing the bookmark would fold the agent's surviving step into the human event below,
		// and an ordinary undo would then revert `Y` and `Z` together.
		expect(after.doc).toEqualDocument(doc(p('cYdZ')));
		expect(undoDepth(after)).toBe(1);
		expect(bookmarkCount(after)).toBe(1);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'required-step-unmappable'));
		// The human event below is intact and is the next thing undone, on its own.
		expect(command(after, undo).doc).toEqualDocument(doc(p('cYd')));
	});

	it('survives a second compression', () => {
		const state = stateWithUnmappableTail();
		compress(state);
		compress(state);
		const { dispatched, state: after } = runCommand(state, undo);

		expect(after.doc).toEqualDocument(doc(p('aXb')));
		expect(undoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'required-step-unmappable'));
	});

	it('still refuses the undo after the automatic compression triggered by a rebase', () => {
		let state = stateWithUnmappableTail();
		// 500 more map-only items on top of the delete pushes `emptyItemCount` past the threshold
		// that `rebased` compresses at.
		for (let i = 0; i < 500; i++) {
			state = applyUnownedRemote(state, [{ pos: state.doc.content.size - 1, text: '.' }]);
		}
		const docBefore = state.doc;
		const localStep = insertStep(1, 'L');
		state = state.apply(state.tr.step(localStep));

		const tr = state.tr;
		tr.step(localStep.invert(docBefore));
		tr.step(insertStep(tr.doc.content.size - 1, 'R'));
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tr.step(localStep.map(tr.mapping.slice(1))!);
		// @ts-expect-error Internal ProseMirror types
		tr.mapping.setMirror(0, tr.steps.length - 1);
		tr.setMeta('addToHistory', false);
		tr.setMeta('isRemote', true);
		tr.setMeta('rebased', 1);
		state = state.apply(tr);
		expect(doneItemCount(state)).toBeLessThan(100);
		expect(undoDepth(state)).toBe(2);

		state = command(state, undo);
		expect(state.doc.textContent.startsWith('aXb')).toBe(true);
		expect(undoDepth(state)).toBe(1);

		const { dispatched, state: after } = runCommand(state, undo);
		expect(after.doc).toEqual(state.doc);
		expect(undoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('undo', 'required-step-unmappable'));
	});

	it('still refuses the redo after the redo branch is compressed', () => {
		let state = mkState(doc(p('hello')));
		state = applyBuiltExternal(state, (tr) => {
			tr.step(insertStep(2, 'X'));
			tr.step(insertStep(5, 'Y'));
		});
		expect(state.doc).toEqualDocument(doc(p('hXelYlo')));
		state = command(state, undo);
		expect(state.doc).toEqualDocument(doc(p('hello')));
		// Deletes across the position the second insert would go back to, but not the first.
		state = applyBuiltRemote(state, (tr) => tr.delete(3, 6));
		expect(state.doc).toEqualDocument(doc(p('he')));
		expect(outcomeOf(runCommand(state, redo).dispatched[0])).toEqual(
			blocked('redo', 'required-step-unmappable'),
		);

		compressUndone(state);
		const { dispatched, state: after } = runCommand(state, redo);

		expect(after.doc).toEqualDocument(doc(p('he')));
		expect(redoDepth(after)).toBe(0);
		expect(outcomeOf(dispatched[0])).toEqual(blocked('redo', 'required-step-unmappable'));
	});
});

describe('external history event: a refused event does not wedge the stack', () => {
	function stateWithHumanThenAgentThenCollaboratorDelete() {
		let state = mkState(doc(p('hello')));
		state = state.apply(state.tr.insertText('H', 1));
		state = state.apply(closeHistory(state.tr));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(4, 'XY')));
		// A collaborator deletes the text the agent wrote and some around it.
		return applyBuiltRemote(state, (tr) => tr.delete(3, 7));
	}

	it('reaches the human event beneath on the next undo', () => {
		const state = stateWithHumanThenAgentThenCollaboratorDelete();
		expect(undoDepth(state)).toBe(2);

		const first = runCommand(state, undo);

		// First press: the agent event cannot be applied, so it is dropped and nothing changes.
		expect(first.handled).toBe(true);
		expect(first.state.doc).toBe(state.doc);
		expect(undoDepth(first.state)).toBe(1);

		// Second press: the human typing beneath it is undone.
		const second = runCommand(first.state, undo);

		expect(outcomeOf(second.dispatched[0])).toBeUndefined();
		expect(second.state.doc).not.toBe(state.doc);
		expect(undoDepth(second.state)).toBe(0);
	});

	it('does not drop an event that can still be applied', () => {
		let state = mkState(doc(p('hello')));
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));

		const { state: after } = runCommand(state, undo);

		expect(after.doc).toEqualDocument(doc(p('hello')));
		expect(redoDepth(after)).toBe(1);
	});

	it('never drops a human event when an undo is refused above it', () => {
		const state = stateWithHumanThenAgentThenCollaboratorDelete();

		const { state: after } = runCommand(state, undo);

		expect(undoDepth(after)).toBe(1);
		expect(bookmarkCount(after)).toBe(1);
	});
});

function mirrorLinkedItemCount(state: EditorState) {
	let count = 0;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	historyStateOf(state).done.items.forEach((item: any) => {
		if (item.mirrorOffset !== undefined) {
			count++;
		}
	});
	return count;
}

describe('external history event: review fixes', () => {
	describe('depth trimming covers every event a receive creates', () => {
		const manyInserts = (count: number) =>
			Array.from({ length: count }, (_unused, i) => ({ pos: 2 + i, text: 'x' }));
		const manyPartitions = (count: number, first = 0) =>
			Array.from({ length: count }, (_unused, i) =>
				partition(`inv-${i}`, [first + i], i + 1, i + 2),
			);

		it('trims a single direct receive that promotes far more events than the depth', () => {
			let state = mkState(doc(p('a')), { depth: 2 });

			state = applyExternal(
				state,
				manyInserts(23),
				externalMeta({ partitions: manyPartitions(23), remoteTransformRange: { from: 0, to: 23 } }),
			);

			const done = historyStateOf(state).done;
			expect(done.eventCount).toBe(bookmarkCountOfBranch(done));
			expect(undoDepth(state)).toBe(2);
			state = command(state, undo);
			state = command(state, undo);
			// Nothing is retained that undo cannot reach.
			expect(undoDepth(state)).toBe(0);
			expect(bookmarkCount(state)).toBe(0);
		});

		it('trims when the old branch holds fewer events than the overflow', () => {
			let state = mkState(doc(p('a')), { depth: 2 });
			state = applyBatch(state, 2, 'o', 'old-1', 1, 2);
			state = applyBatch(state, 3, 'o', 'old-2', 2, 3);

			state = applyExternal(
				state,
				manyInserts(23).map((insert) => ({ ...insert, pos: insert.pos + 2 })),
				externalMeta({ partitions: manyPartitions(23), remoteTransformRange: { from: 0, to: 23 } }),
			);

			const done = historyStateOf(state).done;
			expect(done.eventCount).toBe(bookmarkCountOfBranch(done));
			expect(done.eventCount).toBe(2);
		});

		it('trims a single rebased receive that promotes far more events than the depth', () => {
			let state = mkState(doc(p('a')), { depth: 2 });
			const baseDoc = state.doc;
			const localStep = insertStep(1, 'L');
			state = state.apply(state.tr.step(localStep).setMeta('addToHistory', false));

			const tr = state.tr;
			tr.step(localStep.invert(baseDoc));
			for (let i = 0; i < 23; i++) {
				tr.step(insertStep(1, 'x'));
			}
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			tr.step(localStep.map(tr.mapping.slice(1))!);
			// @ts-expect-error Internal ProseMirror types
			tr.mapping.setMirror(0, tr.steps.length - 1);
			tr.setMeta('addToHistory', false);
			tr.setMeta('isRemote', true);
			tr.setMeta('rebased', 1);
			tr.setMeta(
				EXTERNAL_HISTORY_EVENT_META,
				externalMeta({
					route: 'rebased',
					partitions: manyPartitions(23, 1),
					remoteTransformRange: { from: 1, to: 24 },
				}),
			);
			state = state.apply(tr);

			const done = historyStateOf(state).done;
			expect(done.eventCount).toBe(bookmarkCountOfBranch(done));
			expect(done.eventCount).toBe(2);
		});
	});

	describe('an external event that lost an item to collaboration', () => {
		// An agent event of two steps, as redo leaves it: unconfirmed local items on top of the branch.
		const build = (withHumanBelow: boolean) => {
			let state = mkState(doc(p('a')));
			if (withHumanBelow) {
				state = typeText(state, 'b');
			}
			const stepA = insertStep(2, 'X');
			const stepB = insertStep(3, 'Y');
			const before = state.doc;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const afterA = stepA.apply(before).doc!;
			state = applyBuiltExternal(state, (tr) => {
				tr.step(stepA);
				tr.step(stepB);
			});
			return { afterA, before, state, stepA, stepB };
		};
		// Invert both steps, apply a remote step, and reapply only the second: the first was dropped.
		const dropFirst = ({ afterA, before, state, stepA, stepB }: ReturnType<typeof build>) => {
			const tr = state.tr;
			tr.step(stepB.invert(afterA));
			tr.step(stepA.invert(before));
			tr.step(insertStep(1, 'R'));
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			tr.step(stepB.map(tr.mapping.slice(1))!);
			// @ts-expect-error Internal ProseMirror types
			tr.mapping.setMirror(0, tr.steps.length - 1);
			return tr;
		};

		it('does not fold the surviving sibling into the human event beneath (rebased)', () => {
			const ctx = build(true);
			const done = historyStateOf(ctx.state).done;
			expect(done.eventCount).toBe(2);

			const rebased = done.rebased(dropFirst(ctx), 2);

			expect(rebased.eventCount).toBe(bookmarkCountOfBranch(rebased));
			expect(rebased.eventCount).toBe(1);
			expect(externalMetadataOfBranch(rebased)).toEqual([]);
		});

		it('does not fold the surviving sibling into the human event beneath (rebased route)', () => {
			const ctx = build(true);
			const done = historyStateOf(ctx.state).done;

			const result = done.rebaseWithExternalEvents(
				dropFirst(ctx),
				2,
				[],
				{ from: 2, to: 3 },
				ctx.state.selection.getBookmark(),
				TAB,
				{ depth: 100, newGroupDelay: 500 },
			);

			expect(result.branch.eventCount).toBe(bookmarkCountOfBranch(result.branch));
			expect(result.branch.eventCount).toBe(1);
			expect(externalMetadataOfBranch(result.branch)).toEqual([]);
		});

		it('neuters an event whose bookmark is already confirmed when an unconfirmed item is dropped', () => {
			let state = mkState(doc(p('a')));
			state = typeText(state, 'b');
			const stepA = insertStep(2, 'X');
			const stepB = insertStep(3, 'Y');
			const stepC = insertStep(4, 'Z');
			const d0 = state.doc;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const dA = stepA.apply(d0).doc!;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const dB = stepB.apply(dA).doc!;
			state = applyBuiltExternal(state, (tr) => {
				tr.step(stepA);
				tr.step(stepB);
				tr.step(stepC);
			});
			const done = historyStateOf(state).done;
			expect(done.eventCount).toBe(2);

			// Only the top two items (B, C) are unconfirmed; collaboration drops B and keeps C.
			const tr = state.tr;
			tr.step(stepC.invert(dB));
			tr.step(stepB.invert(dA));
			tr.step(insertStep(1, 'R'));
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			tr.step(stepC.map(tr.mapping.slice(1))!);
			// @ts-expect-error Internal ProseMirror types
			tr.mapping.setMirror(0, tr.steps.length - 1);

			const rebased = done.rebased(tr, 2);

			expect(rebased.eventCount).toBe(bookmarkCountOfBranch(rebased));
			expect(rebased.eventCount).toBe(1);
			expect(externalMetadataOfBranch(rebased)).toEqual([]);
		});

		it('leaves an event that lost no item untouched', () => {
			const ctx = build(false);
			const done = historyStateOf(ctx.state).done;
			const tr = ctx.state.tr;
			tr.step(ctx.stepB.invert(ctx.afterA));
			tr.step(ctx.stepA.invert(ctx.before));
			tr.step(insertStep(1, 'R'));
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const reA = ctx.stepA.map(tr.mapping.slice(1))!;
			tr.step(reA);
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			tr.step(ctx.stepB.map(tr.mapping.slice(1))!);
			// @ts-expect-error Internal ProseMirror types
			tr.mapping.setMirror(0, tr.steps.length - 1);
			// @ts-expect-error Internal ProseMirror types
			tr.mapping.setMirror(1, tr.steps.length - 2);

			const rebased = done.rebased(tr, 2);

			expect(rebased.eventCount).toBe(1);
			expect(externalMetadataOfBranch(rebased)).toHaveLength(2);
		});
	});

	it('keeps map-pair links when a refused event is discarded', () => {
		let state = mkState(doc(p('hello')), { preserveItems: true });
		state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
		state = typeText(state, 'Z');
		state = command(state, undo);
		const linkedBefore = mirrorLinkedItemCount(state);
		expect(linkedBefore).toBeGreaterThan(0);
		state = applyBuiltRemote(state, (tr) => tr.delete(2, 6));

		const { state: after } = runCommand(state, undo);

		expect(undoDepth(after)).toBe(0);
		expect(mirrorLinkedItemCount(after)).toBe(linkedBefore);
	});
});
