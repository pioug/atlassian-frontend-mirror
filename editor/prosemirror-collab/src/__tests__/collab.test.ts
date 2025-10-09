import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { Slice } from '@atlaskit/editor-prosemirror/model';
import type { Plugin, Transaction } from '@atlaskit/editor-prosemirror/state';
import { EditorState, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, panel } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { defaultSchema as schema } from '@atlaskit/editor-test-helpers/schema';
import { closeHistory, history, redo, undo } from '@atlaskit/prosemirror-history';

import {
	collab,
	getDocBeforeUnconfirmedSteps,
	receiveTransaction,
	sendableSteps,
	syncFromAnotherSource,
} from '../index';

const histPlugin = history();

class DummyServer {
	states: EditorState[] = [];
	plugins: Plugin[] = [];
	steps: Step[] = [];
	clientIDs: number[] = [];
	delayed: number[] = [];

	constructor(doc?: Node, n = 2) {
		for (let i = 0; i < n; i++) {
			const plugin = collab();
			this.plugins.push(plugin);
			this.states.push(
				EditorState.create({
					doc,
					schema,
					plugins: [histPlugin, plugin],
				}),
			);
		}
	}

	sync(n: number, opts: { mapSelectionBackward?: boolean } = {}) {
		const state = this.states[n],
			version = this.plugins[n].getState(state).version;
		if (version !== this.steps.length) {
			this.states[n] = state.apply(
				receiveTransaction(state, this.steps.slice(version), this.clientIDs.slice(version), opts),
			);
		}
	}

	send(n: number) {
		const sendable = sendableSteps(this.states[n]);
		if (sendable && sendable.version === this.steps.length) {
			this.steps = this.steps.concat(sendable.steps);
			for (let i = 0; i < sendable.steps.length; i++) {
				this.clientIDs.push(sendable.clientID as number);
			}
		}
	}

	broadcast(n: number, opts: { mapSelectionBackward?: boolean } = {}) {
		if (this.delayed.indexOf(n) > -1) {
			return;
		}
		this.sync(n, opts);
		this.send(n);
		for (let i = 0; i < this.states.length; i++) {
			if (i !== n) {
				this.sync(i, opts);
			}
		}
	}

	update(
		n: number,
		f: (state: EditorState) => Transaction,
		opts: { mapSelectionBackward?: boolean } = {},
	) {
		this.states[n] = this.states[n].apply(f(this.states[n]));
		this.broadcast(n, opts);
	}

	type(n: number, text: string, pos?: number) {
		this.update(n, (s) => s.tr.insertText(text, pos === null ? s.selection.head : pos));
	}

	undo(n: number) {
		undo(this.states[n], (tr) => this.update(n, () => tr));
	}

	redo(n: number) {
		redo(this.states[n], (tr) => this.update(n, () => tr));
	}

	conv(d: Node | string) {
		if (typeof d === 'string') {
			d = doc(p(d))(schema);
		}
		this.states.forEach((state) => expect(state.doc).toEqualDocument(d));
	}

	delay(n: number, f: () => void) {
		this.delayed.push(n);
		f();
		this.delayed.pop();
		this.broadcast(n);
	}
}

function sel(near: number) {
	return (s: EditorState) => s.tr.setSelection(Selection.near(s.doc.resolve(near)));
}

describe('collab', () => {
	it('converges for simple changes', () => {
		const s = new DummyServer();
		s.type(0, 'hi');
		s.type(1, 'ok', 3);
		s.type(0, '!', 5);
		s.type(1, '...', 1);
		s.conv('...hiok!');
	});

	it('converges for multiple local changes', () => {
		const s = new DummyServer();
		s.type(0, 'hi');
		s.delay(0, () => {
			s.type(0, 'A');
			s.type(1, 'X');
			s.type(0, 'B');
			s.type(1, 'Y');
		});
		s.conv('hiXYAB');
	});

	it('converges with three peers', () => {
		const s = new DummyServer(undefined, 3);
		s.type(0, 'A');
		s.type(1, 'U');
		s.type(2, 'X');
		s.type(0, 'B');
		s.type(1, 'V');
		s.type(2, 'C');
		s.conv('AUXBVC');
	});

	it('converges with three peers with multiple steps', () => {
		const s = new DummyServer(undefined, 3);
		s.type(0, 'A');
		s.delay(1, () => {
			s.type(1, 'U');
			s.type(2, 'X');
			s.type(0, 'B');
			s.type(1, 'V');
			s.type(2, 'C');
		});
		s.conv('AXBCUV');
	});

	it('supports undo', () => {
		const s = new DummyServer();
		s.type(0, 'A');
		s.type(1, 'B');
		s.type(0, 'C');
		s.undo(1);
		s.conv('AC');
		s.type(1, 'D');
		s.type(0, 'E');
		s.conv('ACDE');
	});

	it('supports redo', () => {
		const s = new DummyServer();
		s.type(0, 'A');
		s.type(1, 'B');
		s.type(0, 'C');
		s.undo(1);
		s.redo(1);
		s.type(1, 'D');
		s.type(0, 'E');
		s.conv('ABCDE');
	});

	it('supports deep undo', () => {
		const s = new DummyServer(doc(p('hello'), p('bye'))(schema));
		s.update(0, sel(6));
		s.update(1, sel(11));
		s.type(0, '!');
		s.type(1, '!');
		s.update(0, (s) => closeHistory(s.tr));
		s.delay(0, () => {
			s.type(0, ' ...');
			s.type(1, ' ,,,');
		});
		s.update(0, (s) => closeHistory(s.tr));
		s.type(0, '*');
		s.type(1, '*');
		s.undo(0);
		s.conv(doc(p('hello! ...'), p('bye! ,,,*'))(schema));
		s.undo(0);
		s.undo(0);
		s.conv(doc(p('hello'), p('bye! ,,,*'))(schema));
		s.redo(0);
		s.redo(0);
		s.redo(0);
		s.conv(doc(p('hello! ...*'), p('bye! ,,,*'))(schema));
		s.undo(0);
		s.undo(0);
		s.conv(doc(p('hello!'), p('bye! ,,,*'))(schema));
		s.undo(1);
		s.conv(doc(p('hello!'), p('bye'))(schema));
	});

	it('support undo with clashing events', () => {
		const s = new DummyServer(doc(p('hello'))(schema));
		s.update(0, sel(6));
		s.type(0, 'A');
		s.delay(0, () => {
			s.type(0, 'B', 4);
			s.type(0, 'C', 5);
			s.type(0, 'D', 1);
			s.update(1, (s) => s.tr.delete(2, 5));
		});
		s.conv('DhoA');
		s.undo(0);
		s.undo(0);
		s.conv('ho');
		expect(s.states[0].selection.head).toBe(3);
	});

	it('handles conflicting steps', () => {
		const s = new DummyServer(doc(p('abcde'))(schema));
		s.delay(0, () => {
			s.update(0, (s) => s.tr.delete(3, 4));
			s.type(0, 'x');
			s.update(1, (s) => s.tr.delete(2, 5));
		});
		s.undo(0);
		s.undo(0);
		s.conv(doc(p('ae'))(schema));
	});

	it('can undo simultaneous typing', () => {
		const s = new DummyServer(doc(p('A'), p('B'))(schema));
		s.update(0, sel(2));
		s.update(1, sel(5));
		s.delay(0, () => {
			s.type(0, '1');
			s.type(0, '2');
			s.type(1, 'x');
			s.type(1, 'y');
		});
		s.conv(doc(p('A12'), p('Bxy'))(schema));
		s.undo(0);
		s.conv(doc(p('A'), p('Bxy'))(schema));
		s.undo(1);
		s.conv(doc(p('A'), p('B'))(schema));
	});

	describe('Atlassian custom behaviour', () => {
		it.skip("don't send analytics steps to the collab service", () => {
			const s = new DummyServer();
			const analyticsStep = new AnalyticsStep(
				[
					{
						payload: {
							action: 'any',
							actionSubject: 'any',
							eventType: 'any',
						},
						channel: 'some-channel',
					},
				],
				[],
			);
			const replaceStep = new ReplaceStep(0, 0, Slice.empty);

			const transaction = s.states[0].tr;
			transaction.step(replaceStep);
			transaction.step(analyticsStep);
			s.states[0] = s.states[0].apply(transaction);

			expect(sendableSteps(s.states[0])?.steps).toEqual([replaceStep]);
		});

		describe('getDocBeforeUnconfirmedSteps', () => {
			it('returns the document before unconfirmed steps with multiple steps', () => {
				const s = new DummyServer(doc(p('A'))(schema), 1);
				s.type(0, 'BC', 2);
				s.conv(doc(p('ABC'))(schema));
				const docBeforeUnconfirmedSteps = getDocBeforeUnconfirmedSteps(s.states[0]);
				expect(docBeforeUnconfirmedSteps).toEqualDocument(doc(p('A')));
			});
		});

		describe('syncFromAnotherSource', () => {
			it('returns a transaction that updates the CollabState with the steps and version from another source', () => {
				const s = new DummyServer(doc(p('A'))(schema), 1);
				const steps = [new ReplaceStep(1, 1, Slice.empty)];
				const tr = syncFromAnotherSource(s.states[0], 123, doc(p('ABC'))(schema).toJSON(), steps);

				const collabKey = 'collab$';
				expect(tr.getMeta(collabKey).version).toEqual(123);
				expect(tr.getMeta(collabKey).unconfirmed.length).toEqual(steps.length);
				expect(tr.getMeta(collabKey).unconfirmed).toEqual([
					expect.objectContaining({ step: steps[0] }),
				]);
				expect(tr.getMeta('addToHistory')).toBe(false);
			});

			it('preserves selection when within document bounds', () => {
				const s = new DummyServer(doc(p('ABCDEF'))(schema), 1);
				s.update(0, (state) => state.tr.setSelection(TextSelection.create(state.doc, 1, 3))); // Select 'BC'
				const tr = syncFromAnotherSource(s.states[0], 123, doc(p('ABCDEF'))(schema).toJSON(), []);
				expect(tr.selection.from).toEqual(1);
				expect(tr.selection.to).toEqual(3);
			});

			it('maps selection to end of document when beyond bounds', () => {
				const s = new DummyServer(doc(p('ABCDEF'))(schema), 1);
				s.update(0, (state) => state.tr.setSelection(TextSelection.create(state.doc, 6, 8))); // Select beyond end
				const tr = syncFromAnotherSource(s.states[0], 123, doc(p('ABC'))(schema).toJSON(), []);
				expect(tr.selection.from).toEqual(5);
				expect(tr.selection.to).toEqual(5);
			});
		});

		it('preserves range selection with mapSelectionBackward when another user updates the document', () => {
			const s = new DummyServer(doc(panel()(p('')), p('hello'))(schema));

			// User 0 sets a range selection to pos 0
			s.update(0, (state) => {
				const $anchor = state.doc.resolve(10);
				const $head = state.doc.resolve(0);
				const selection = new TextSelection($anchor, $head);
				return state.tr.setSelection(selection);
			});

			// Verify User 0's initial selection
			expect(s.states[0].selection).toBeInstanceOf(TextSelection);
			expect(s.states[0].selection.from).toBe(0);
			expect(s.states[0].selection.to).toBe(10);
			expect(s.states[0].selection.$from.pos).toBe(0);
			expect(s.states[0].selection.$to.pos).toBe(10);

			// User 1 makes a single document change
			s.update(
				1,
				(state) => {
					const tr = state.tr;
					tr.insertText(' ', 11);
					return tr;
				},
				{ mapSelectionBackward: true },
			);

			const user0State = s.states[0];
			expect(user0State.selection.from).toBe(0);
			expect(user0State.selection.to).toBe(10);
			expect(user0State.selection.$from.pos).toBe(0);
			expect(user0State.selection.$to.pos).toBe(10);
		});
	});
});
