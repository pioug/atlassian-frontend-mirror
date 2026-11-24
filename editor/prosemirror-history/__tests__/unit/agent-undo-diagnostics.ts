import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import type { DocBuilder } from '@atlaskit/editor-common/types/doc-builder';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { EditorState as PMEditorState } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { history, redo, undo } from '../../src';
import {
	AGENT_UNDO_DIAGNOSTIC_MAX_ALIASES,
	AGENT_UNDO_DIAGNOSTIC_MAX_EVENTS,
	AGENT_UNDO_DIAGNOSTIC_SCHEMA_VERSION,
	agentUndoDiagnostics,
} from '../../src/diagnostics/agent-undo-diagnostics';
import type { AgentUndoDiagnosticEvent } from '../../src/diagnostics/agent-undo-diagnostics';
import { EXTERNAL_HISTORY_EVENT_META } from '../../src/external-history-event';
import type { ExternalHistoryTransactionMeta } from '../../src/external-history-event';
import { historyKey } from '../../src/historyKey';

const TAB = 'agent-undo-ownership-1712345678901-7';

const enableDiagnostics = () => {
	window.__EDITOR_AGENT_UNDO_DEBUG__ = true;
};

/**
 * Restores the module-level recorder to its default-off, empty state. Both halves matter: the
 * buffer and the alias tables are module singletons shared by every test in this file, and the
 * window flag is what the recorder reads on each call.
 */
const resetDiagnostics = () => {
	agentUndoDiagnostics.disable();
	delete window.__EDITOR_AGENT_UNDO_DEBUG__;
};

beforeEach(resetDiagnostics);
afterEach(resetDiagnostics);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mkState = (docBuilder?: DocBuilder, config?: any) =>
	PMEditorState.create({
		schema,
		plugins: [history(config)],
		doc: docBuilder?.(schema),
	});

const insertStep = (pos: number, text: string) =>
	new ReplaceStep(pos, pos, new Slice(Fragment.from(schema.text(text)), 0, 0));

const externalMeta = (
	overrides: Partial<ExternalHistoryTransactionMeta> = {},
): ExternalHistoryTransactionMeta => ({
	editorInstanceId: TAB,
	partitions: [],
	rejections: [],
	remoteTransformRange: { from: 0, to: 0 },
	route: 'direct',
	...overrides,
});

/** An owned agent batch whose steps are built by `build`, all owned by `invocationId`. */
const applyBuiltExternal = (
	state: EditorState,
	build: (tr: Transaction) => void,
	invocationId: string = 'inv-1',
) => {
	const tr = state.tr;
	build(tr);
	tr.setMeta('addToHistory', false);
	tr.setMeta('isRemote', true);
	tr.setMeta(
		EXTERNAL_HISTORY_EVENT_META,
		externalMeta({
			partitions: [
				{
					batch: { fromVersion: 1, toVersion: 2 },
					invocationId,
					transactionIndexes: tr.steps.map((_step, index) => index),
				},
			],
			remoteTransformRange: { from: 0, to: tr.steps.length },
		}),
	);
	return state.apply(tr);
};

/** An unowned remote (other collaborator) transaction whose steps are built by `build`. */
const applyBuiltRemote = (state: EditorState, build: (tr: Transaction) => void) => {
	const tr = state.tr;
	build(tr);
	tr.setMeta('addToHistory', false);
	tr.setMeta('isRemote', true);
	return state.apply(tr);
};

type CommandDispatch = (tr: Transaction) => void;
// Duplicated type to avoid a circular dependency, as elsewhere in this test folder.
type Command = (state: EditorState, dispatch?: CommandDispatch, view?: EditorView) => boolean;

const runCommand = (state: EditorState, cmd: Command) => {
	let next = state;
	cmd(state, (transaction) => {
		next = next.apply(transaction);
	});
	return next;
};

const stages = () => agentUndoDiagnostics.exportArtifact().events.map((event) => event.stage);

describe('agent undo diagnostics', () => {
	it('does not hide real edits accidentally marked as observability transactions', () => {
		const state = mkState(doc(p('hello')));
		const next = state.apply(
			state.tr.insertText('X', 1).setMeta('externalHistoryObservability', true),
		);
		expect(historyKey.getState(next)?.done.eventCount).toBe(1);
		expect(runCommand(next, undo).doc).toEqualDocument(doc(p('hello')));
	});

	it('deeply clones allowlisted context and never reads disabled context getters', () => {
		const inspect = jest.fn(() => ({ fromVersion: 1, toVersion: 2 }));
		const disabled = {
			get batch() {
				return inspect();
			},
		};
		agentUndoDiagnostics.record('batch-promoted', TAB, 'inv-1', undefined, disabled);
		expect(inspect).not.toHaveBeenCalled();
		enableDiagnostics();
		const context = {
			batch: { fromVersion: 1, toVersion: 2, text: 'SECRET' },
			transactionIndexes: [0, 1],
			history: {
				before: { doneItems: 0, doneEvents: 0, undoneItems: 0, undoneEvents: 0, token: 'SECRET' },
				after: { doneItems: 2, doneEvents: 1, undoneItems: 0, undoneEvents: 0 },
			},
			prompt: 'SECRET',
		};
		agentUndoDiagnostics.record('batch-promoted', TAB, 'inv-1', undefined, context);
		context.transactionIndexes.push(99);
		context.batch.toVersion = 999;
		const artifact = agentUndoDiagnostics.exportArtifact();
		expect(artifact.events[0]).toMatchObject({
			batch: { fromVersion: 1, toVersion: 2 },
			transactionIndexes: [0, 1],
		});
		expect(JSON.stringify(artifact)).not.toContain('SECRET');
		artifact.events[0].transactionIndexes?.push(88);
		if (artifact.events[0].history) artifact.events[0].history.after.doneItems = 999;
		expect(agentUndoDiagnostics.exportArtifact().events[0]).toMatchObject({
			transactionIndexes: [0, 1],
			history: { after: { doneItems: 2 } },
		});
	});

	it('reports successful and blocked preflight with branch counts', () => {
		enableDiagnostics();
		let state = applyBuiltExternal(mkState(doc(p('hello'))), (tr) => tr.step(insertStep(3, 'XY')));
		state = runCommand(state, undo);
		expect(agentUndoDiagnostics.exportArtifact().events[1]).toMatchObject({
			preflight: 'succeeded',
			history: {
				before: { doneEvents: 1, undoneEvents: 0 },
				after: { doneEvents: 0, undoneEvents: 1 },
			},
		});
		state = applyBuiltRemote(state, (tr) => tr.delete(0, 7));
		runCommand(state, redo);
		const blocked = agentUndoDiagnostics.exportArtifact().events[2];
		expect(blocked).toMatchObject({
			preflight: 'blocked',
			blockedReason: 'required-step-unmappable',
		});
		expect(blocked.history?.before).toEqual(blocked.history?.after);
	});

	it('attaches real promotion counts independently of debug opt-in', () => {
		let state = mkState(doc(p('hello')));
		const apply = (indexes: number[]) => {
			const tr = state.tr
				.insertText('X', 3)
				.setMeta('addToHistory', false)
				.setMeta('isRemote', true);
			tr.setMeta(
				EXTERNAL_HISTORY_EVENT_META,
				externalMeta({
					partitions: [
						{
							invocationId: 'inv',
							batch: { fromVersion: 1, toVersion: 2 },
							transactionIndexes: indexes,
						},
					],
				}),
			);
			state = state.apply(tr);
			return tr.getMeta('externalHistoryPromotion');
		};
		expect(apply([0])).toMatchObject({
			promotedEventCount: 1,
			promotedItemCount: 1,
			route: 'direct',
		});
		// A second batch of the same invocation is a second event, not an extension.
		expect(apply([0])).toMatchObject({
			promotedEventCount: 1,
			promotedItemCount: 1,
		});
		expect(apply([99])).toMatchObject({
			promotedEventCount: 0,
			promotedItemCount: 0,
		});
		expect(agentUndoDiagnostics.exportArtifact().events).toHaveLength(0);
	});

	it('exports schema v3 and a deterministic content-free build identifier', () => {
		expect(agentUndoDiagnostics.exportArtifact()).toMatchObject({
			schemaVersion: 3,
			build: { packageName: '@atlaskit/prosemirror-history' },
		});
	});

	it('keeps timestamps ordered when the wall clock goes backward', () => {
		enableDiagnostics();
		const now = jest.spyOn(Date, 'now').mockReturnValueOnce(100).mockReturnValueOnce(90);
		agentUndoDiagnostics.record('batch-promoted', TAB);
		agentUndoDiagnostics.record('batch-promoted', TAB);
		expect(agentUndoDiagnostics.exportArtifact().events.map((event) => event.timestamp)).toEqual([
			100, 101,
		]);
		now.mockRestore();
	});

	it('records actual history route, owned indexes, batch versions and branch count units', () => {
		enableDiagnostics();
		applyBuiltExternal(mkState(doc(p('hello'))), (tr) => tr.step(insertStep(3, 'X')));
		expect(agentUndoDiagnostics.exportArtifact().events[0]).toMatchObject({
			gate: 'enabled-by-producer',
			route: 'direct',
			batch: { fromVersion: 1, toVersion: 2 },
			transactionIndexes: [0],
			history: {
				before: { doneItems: 0, doneEvents: 0, undoneItems: 0, undoneEvents: 0 },
				after: { doneItems: 1, doneEvents: 1, undoneItems: 0, undoneEvents: 0 },
			},
		});
	});

	describe('default-off recording', () => {
		it('is disabled by default', () => {
			expect(agentUndoDiagnostics.isEnabled()).toBe(false);
		});

		it('records nothing while disabled', () => {
			agentUndoDiagnostics.record('batch-promoted', TAB, 'inv-1');

			expect(agentUndoDiagnostics.exportArtifact()).toMatchObject({
				events: [],
				schemaVersion: AGENT_UNDO_DIAGNOSTIC_SCHEMA_VERSION,
			});
		});

		it('is not enabled by a truthy-but-not-true debug flag', () => {
			// The contract is `=== true`, so a stray string left on `window` by some other tool
			// must not silently start recording.
			// @ts-expect-error deliberately wrong type for the flag
			window.__EDITOR_AGENT_UNDO_DEBUG__ = 'yes';

			expect(agentUndoDiagnostics.isEnabled()).toBe(false);
			agentUndoDiagnostics.record('batch-promoted', TAB, 'inv-1');
			expect(agentUndoDiagnostics.exportArtifact().events).toHaveLength(0);
		});

		it('allocates nothing — not even an alias — while disabled', () => {
			// Aliases are minted in first-seen order, so if the disabled calls below had interned
			// anything the enabled call would be handed `editor-2` / `invocation-2`.
			agentUndoDiagnostics.record('batch-promoted', 'editor-while-disabled', 'inv-while-disabled');
			agentUndoDiagnostics.record('undo-succeeded', 'editor-while-disabled', 'inv-while-disabled');

			enableDiagnostics();
			agentUndoDiagnostics.record('batch-promoted', 'editor-while-enabled', 'inv-while-enabled');

			expect(agentUndoDiagnostics.exportArtifact().events).toEqual([
				{
					editorAlias: 'editor-1',
					invocationAlias: 'invocation-1',
					stage: 'batch-promoted',
					timestamp: expect.any(Number),
				},
			]);
		});
	});

	describe('artifact envelope', () => {
		it('reports schema version 3 even when empty', () => {
			expect(agentUndoDiagnostics.exportArtifact()).toMatchObject({ events: [], schemaVersion: 3 });
		});

		it('reports schema version 3 alongside recorded events', () => {
			enableDiagnostics();
			agentUndoDiagnostics.record('batch-promoted', TAB, 'inv-1');

			expect(agentUndoDiagnostics.exportArtifact().schemaVersion).toBe(3);
		});

		it('exports a detached clone that later exports do not observe', () => {
			enableDiagnostics();
			agentUndoDiagnostics.record('batch-promoted', TAB, 'inv-1');

			const artifact = agentUndoDiagnostics.exportArtifact();
			(artifact.events as AgentUndoDiagnosticEvent[]).push({
				editorAlias: 'editor-999',
				stage: 'undo-blocked',
				timestamp: 0,
			});
			(artifact.events[0] as AgentUndoDiagnosticEvent).stage = 'batch-rejected';

			expect(agentUndoDiagnostics.exportArtifact().events).toEqual([
				{
					editorAlias: 'editor-1',
					invocationAlias: 'invocation-1',
					stage: 'batch-promoted',
					timestamp: expect.any(Number),
				},
			]);
		});
	});

	describe('bounded buffer', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('pins the cap to 200 entries', () => {
			// Without this the cap assertions below are expressed purely in terms of the constant,
			// so the bound itself could be changed to any value and stay green.
			expect(AGENT_UNDO_DIAGNOSTIC_MAX_EVENTS).toBe(200);
		});

		it('keeps only the newest 200 entries, dropping the oldest', () => {
			jest.setSystemTime(1_000_000);
			enableDiagnostics();

			const total = AGENT_UNDO_DIAGNOSTIC_MAX_EVENTS + 50;
			for (let i = 0; i < total; i++) {
				agentUndoDiagnostics.record('batch-promoted', TAB, 'inv-1');
				jest.advanceTimersByTime(1);
			}

			const { events } = agentUndoDiagnostics.exportArtifact();
			expect(events).toHaveLength(AGENT_UNDO_DIAGNOSTIC_MAX_EVENTS);
			// Timestamps identify which records survived without relying on aliasing: the first 50
			// were dropped, so the oldest survivor is the 51st.
			expect(events[0].timestamp).toBe(1_000_000 + 50);
			expect(events[events.length - 1].timestamp).toBe(1_000_000 + total - 1);
		});
	});

	describe('aliasing', () => {
		it('gives one raw value one stable alias across events', () => {
			enableDiagnostics();
			agentUndoDiagnostics.record('batch-promoted', TAB, 'inv-1');
			agentUndoDiagnostics.record('undo-succeeded', TAB, 'inv-1');

			const { events } = agentUndoDiagnostics.exportArtifact();
			expect(events.map((event) => event.editorAlias)).toEqual(['editor-1', 'editor-1']);
			expect(events.map((event) => event.invocationAlias)).toEqual([
				'invocation-1',
				'invocation-1',
			]);
		});

		it('gives distinct editors distinct aliases', () => {
			enableDiagnostics();
			agentUndoDiagnostics.record('batch-promoted', 'tab-a', 'inv-a');
			agentUndoDiagnostics.record('batch-promoted', 'tab-b', 'inv-b');
			agentUndoDiagnostics.record('batch-promoted', 'tab-a', 'inv-b');

			expect(agentUndoDiagnostics.exportArtifact().events).toEqual([
				expect.objectContaining({ editorAlias: 'editor-1', invocationAlias: 'invocation-1' }),
				expect.objectContaining({ editorAlias: 'editor-2', invocationAlias: 'invocation-2' }),
				expect.objectContaining({ editorAlias: 'editor-1', invocationAlias: 'invocation-2' }),
			]);
		});

		it('omits the invocation alias when there is no invocation', () => {
			enableDiagnostics();
			agentUndoDiagnostics.record('undo-blocked', TAB, undefined, 'mapped-step-failed');

			const [event] = agentUndoDiagnostics.exportArtifact().events;
			expect(event).toEqual({
				blockedReason: 'mapped-step-failed',
				editorAlias: 'editor-1',
				stage: 'undo-blocked',
				timestamp: expect.any(Number),
			});
			expect('invocationAlias' in event).toBe(false);
		});

		it('stops minting new aliases past the alias cap instead of growing without bound', () => {
			enableDiagnostics();

			for (let i = 0; i < AGENT_UNDO_DIAGNOSTIC_MAX_ALIASES + 1; i++) {
				agentUndoDiagnostics.record('batch-promoted', `tab-${i}`, `inv-${i}`);
			}

			const { events } = agentUndoDiagnostics.exportArtifact();
			const last = events[events.length - 1];
			expect(last.editorAlias).toBe('editor-overflow');
			expect(last.invocationAlias).toBe('invocation-overflow');
			// The alias immediately below the cap is still a real, minted one.
			expect(events[events.length - 2].editorAlias).toBe(
				`editor-${AGENT_UNDO_DIAGNOSTIC_MAX_ALIASES}`,
			);
		});
	});

	describe('redaction', () => {
		const DENYLISTED = [
			TAB,
			'inv-01HZXSECRET',
			'contentId-98765',
			'Write me a poem about kittens',
			'hello world document text',
			'{"stepType":"replace","from":1,"to":2}',
			'TypeError: cannot read property of undefined',
			'eyJhbGciOiJIUzI1NiJ9.token',
			'557057:1a2b3c4d-aaid',
			'session-abc',
			'client-xyz',
		];

		it('never lets a raw identifier reach the artifact', () => {
			enableDiagnostics();
			agentUndoDiagnostics.record('batch-promoted', TAB, 'inv-01HZXSECRET');
			agentUndoDiagnostics.record('undo-blocked', TAB, 'inv-01HZXSECRET', 'selection-unresolvable');

			const serialised = JSON.stringify(agentUndoDiagnostics.exportArtifact());
			DENYLISTED.forEach((value) => {
				expect(serialised).not.toContain(value);
			});
		});

		it('exposes no field outside the versioned schema', () => {
			enableDiagnostics();
			agentUndoDiagnostics.record('undo-blocked', TAB, 'inv-1', 'required-step-unmappable');
			agentUndoDiagnostics.record('redo-succeeded', TAB, 'inv-1');

			const artifact = agentUndoDiagnostics.exportArtifact();
			expect(Object.keys(artifact).sort()).toEqual(['build', 'events', 'schemaVersion']);
			artifact.events.forEach((event) => {
				// A denylist can only reject the leaks we thought of; an allowlist rejects every
				// future field — prompt, content, step JSON, error, token, AAID, session, client —
				// unless it is deliberately added to the schema here.
				expect(
					Object.keys(event).every((key) =>
						['blockedReason', 'editorAlias', 'invocationAlias', 'stage', 'timestamp'].includes(key),
					),
				).toBe(true);
			});
		});
	});

	describe('browser globals', () => {
		it('installs the debug entry points on window once recording is checked while enabled', () => {
			enableDiagnostics();
			expect(agentUndoDiagnostics.isEnabled()).toBe(true);
			expect(typeof window.__EDITOR_AGENT_UNDO_DEBUG_EXPORT__).toBe('function');
			expect(typeof window.__EDITOR_AGENT_UNDO_DEBUG_CLEAR__).toBe('function');
			expect(typeof window.__EDITOR_AGENT_UNDO_DEBUG_DISABLE__).toBe('function');
		});

		it('exports through the window entry point', () => {
			enableDiagnostics();
			agentUndoDiagnostics.record('batch-promoted', TAB, 'inv-1');

			expect(window.__EDITOR_AGENT_UNDO_DEBUG_EXPORT__?.()).toMatchObject({
				events: [
					{
						editorAlias: 'editor-1',
						invocationAlias: 'invocation-1',
						stage: 'batch-promoted',
						timestamp: expect.any(Number),
					},
				],
				schemaVersion: 3,
			});
		});

		it('clears the buffer and the alias tables through the window entry point', () => {
			enableDiagnostics();
			agentUndoDiagnostics.record('batch-promoted', 'tab-a', 'inv-a');
			agentUndoDiagnostics.record('batch-promoted', 'tab-b', 'inv-b');

			window.__EDITOR_AGENT_UNDO_DEBUG_CLEAR__?.();

			expect(agentUndoDiagnostics.exportArtifact().events).toEqual([]);
			// Still enabled after a clear, and aliasing restarts from scratch.
			expect(agentUndoDiagnostics.isEnabled()).toBe(true);
			agentUndoDiagnostics.record('batch-promoted', 'tab-b', 'inv-b');
			expect(agentUndoDiagnostics.exportArtifact().events).toEqual([
				expect.objectContaining({ editorAlias: 'editor-1', invocationAlias: 'invocation-1' }),
			]);
		});

		it('stops recording and empties the buffer through the disable entry point', () => {
			enableDiagnostics();
			agentUndoDiagnostics.record('batch-promoted', TAB, 'inv-1');

			window.__EDITOR_AGENT_UNDO_DEBUG_DISABLE__?.();

			expect(agentUndoDiagnostics.isEnabled()).toBe(false);
			expect(window.__EDITOR_AGENT_UNDO_DEBUG__).toBe(false);
			expect(agentUndoDiagnostics.exportArtifact().events).toEqual([]);

			agentUndoDiagnostics.record('batch-promoted', TAB, 'inv-1');
			expect(agentUndoDiagnostics.exportArtifact().events).toEqual([]);
		});

		it('leaves editor state untouched when exporting, clearing and disabling', () => {
			enableDiagnostics();
			let state = mkState(doc(p('hello')));
			state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));

			const historyStateBefore = historyKey.getState(state);
			const docBefore = state.doc;

			agentUndoDiagnostics.exportArtifact();
			agentUndoDiagnostics.clear();
			agentUndoDiagnostics.disable();

			expect(historyKey.getState(state)).toBe(historyStateBefore);
			expect(state.doc).toBe(docBefore);
			expect(state.doc).toEqualDocument(doc(p('heXYllo')));
		});
	});

	describe('history stage recording', () => {
		it('records nothing at all while diagnostics are disabled', () => {
			let state = mkState(doc(p('hello')));
			state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
			state = runCommand(state, undo);
			state = runCommand(state, redo);

			expect(agentUndoDiagnostics.exportArtifact().events).toEqual([]);
		});

		it('records a promoted batch', () => {
			enableDiagnostics();
			let state = mkState(doc(p('hello')));
			state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));

			expect(agentUndoDiagnostics.exportArtifact().events).toEqual([
				expect.objectContaining({
					editorAlias: 'editor-1',
					invocationAlias: 'invocation-1',
					stage: 'batch-promoted',
					timestamp: expect.any(Number),
				}),
			]);
		});

		it('records a second same-invocation batch as a second promotion', () => {
			enableDiagnostics();
			let state = mkState(doc(p('hello')));
			state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'X')));
			state = applyBuiltExternal(state, (tr) => tr.step(insertStep(4, 'Y')));

			expect(stages()).toEqual(['batch-promoted', 'batch-promoted']);
		});

		it('records a different invocation as a second promotion', () => {
			enableDiagnostics();
			let state = mkState(doc(p('hello')));
			state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'X')), 'inv-1');
			state = applyBuiltExternal(state, (tr) => tr.step(insertStep(4, 'Y')), 'inv-2');

			expect(stages()).toEqual(['batch-promoted', 'batch-promoted']);
			expect(
				agentUndoDiagnostics.exportArtifact().events.map((event) => event.invocationAlias),
			).toEqual(['invocation-1', 'invocation-2']);
		});

		it('records a successful undo and redo', () => {
			enableDiagnostics();
			let state = mkState(doc(p('hello')));
			state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
			state = runCommand(state, undo);
			expect(state.doc).toEqualDocument(doc(p('hello')));
			state = runCommand(state, redo);
			expect(state.doc).toEqualDocument(doc(p('heXYllo')));

			expect(stages()).toEqual(['batch-promoted', 'undo-succeeded', 'redo-succeeded']);
			expect(
				agentUndoDiagnostics.exportArtifact().events.every((event) => !('blockedReason' in event)),
			).toBe(true);
		});

		it('records a blocked undo together with its reason', () => {
			enableDiagnostics();
			let state = mkState(doc(p('hello')));
			state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
			// Deletes a strict superset of the agent's inserted range, so the inverse step cannot
			// be mapped and the undo is refused.
			state = applyBuiltRemote(state, (tr) => tr.delete(2, 6));

			state = runCommand(state, undo);

			expect(state.doc).toEqualDocument(doc(p('hlo')));
			expect(agentUndoDiagnostics.exportArtifact().events[1]).toMatchObject({
				blockedReason: 'required-step-unmappable',
				editorAlias: 'editor-1',
				invocationAlias: 'invocation-1',
				stage: 'undo-blocked',
				timestamp: expect.any(Number),
			});
		});

		it('records a blocked redo together with its reason', () => {
			enableDiagnostics();
			let state = mkState(doc(p('hello')));
			state = applyBuiltExternal(state, (tr) => tr.step(insertStep(3, 'XY')));
			state = runCommand(state, undo);
			// Removes the paragraph the redo would have to reapply into.
			state = applyBuiltRemote(state, (tr) => tr.delete(0, 7));

			state = runCommand(state, redo);

			expect(stages()).toEqual(['batch-promoted', 'undo-succeeded', 'redo-blocked']);
			expect(agentUndoDiagnostics.exportArtifact().events[2].blockedReason).toBe(
				'required-step-unmappable',
			);
		});

		it('records nothing for a map-only receive that promoted no partition', () => {
			enableDiagnostics();
			let state = mkState(doc(p('hello')));
			const tr = state.tr;
			tr.step(insertStep(3, 'XY'));
			tr.setMeta('addToHistory', false);
			tr.setMeta('isRemote', true);
			tr.setMeta(EXTERNAL_HISTORY_EVENT_META, externalMeta());
			state = state.apply(tr);

			expect(state.doc).toEqualDocument(doc(p('heXYllo')));
			expect(agentUndoDiagnostics.exportArtifact().events).toEqual([]);
		});

		it('records nothing for an ordinary local undo', () => {
			enableDiagnostics();
			let state = mkState(doc(p('hello')));
			state = state.apply(state.tr.insertText('!', 6));
			state = runCommand(state, undo);

			expect(state.doc).toEqualDocument(doc(p('hello')));
			expect(agentUndoDiagnostics.exportArtifact().events).toEqual([]);
		});
	});
});
