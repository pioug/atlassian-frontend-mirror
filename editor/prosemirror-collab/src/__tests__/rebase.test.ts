import type { Node } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import { Transform } from '@atlaskit/editor-prosemirror/transform';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
	blockquote,
	code,
	doc,
	em,
	li,
	mention,
	p,
	strong,
	ul,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { defaultSchema as schema } from '@atlaskit/editor-test-helpers/schema';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import { rebaseSteps } from '../index';

function runRebase(transforms: readonly Transform[], expected: Node) {
	const start = transforms[0].before,
		full = new Transform(start);
	transforms.forEach((transform) => {
		const rebased = new Transform(transform.doc);
		const start = transform.steps.length + full.steps.length;
		rebaseSteps(
			transform.steps.map((s, i) => ({
				step: s,
				inverted: s.invert(transform.docs[i]),
				origin: transform,
			})),
			full.steps,
			rebased,
		);
		for (let i = start; i < rebased.steps.length; i++) {
			full.step(rebased.steps[i]);
		}
	});

	expect(full.doc).toEqualDocument(expected);

	// eslint-disable-next-line guard-for-in
	for (const tag in (start as any).tag) {
		const mapped = full.mapping.mapResult((start as any).tag[tag]);

		const exp = (expected as any).tag[tag];
		if (mapped.deleted) {
			if (exp) {
				throw new Error('Tag ' + tag + ' was unexpectedly deleted');
			}
		} else {
			if (!exp) {
				throw new Error('Tag ' + tag + ' is not actually deleted');
			}
			expect(mapped.pos).toEqual(exp);
		}
	}
}

function permute<T>(array: readonly T[]): readonly (readonly T[])[] {
	if (array.length < 2) {
		return [array];
	}
	const result = [];
	for (let i = 0; i < array.length; i++) {
		const others = permute(array.slice(0, i).concat(array.slice(i + 1)));
		for (let j = 0; j < others.length; j++) {
			result.push([array[i]].concat(others[j]));
		}
	}
	return result;
}

function rebase(doc: Node, ...clients: (((tr: Transform) => Transform) | Node)[]) {
	const expected = clients.pop() as Node;
	runRebase(
		(clients as ((tr: Transform) => Transform)[]).map((cl) => cl(new Transform(doc))),
		expected,
	);
}

function rebase$(doc: Node, ...clients: (((tr: Transform) => Transform) | Node)[]) {
	const expected = clients.pop() as Node;
	permute(
		(clients as ((tr: Transform) => Transform)[]).map((cl) => cl(new Transform(doc))),
	).forEach((transforms) => runRebase(transforms, expected));
}

function type(tr: Transform, pos: number, text: string) {
	return tr.replaceWith(pos, pos, schema.text(text));
}

function wrap(tr: Transform, pos: number, type: string) {
	const $pos = tr.doc.resolve(pos);
	return tr.wrap($pos.blockRange($pos)!, [{ type: schema.nodes[type] }]);
}

type Pos = {
	from: number;
	to: number;
};

function move(tr: Transform, before: Pos, after: Pick<Pos, 'from'>) {
	const slice = tr.doc.slice(before.from, before.to);
	return tr.delete(before.from, before.to).replace(after.from, undefined, slice);
}

describe('rebaseSteps', () => {
	it('supports concurrent typing', () => {
		rebase$(
			doc(p('h', strong('ell'), 'o'))(schema),
			(tr) => type(tr, 2, 'X'),
			(tr) => type(tr, 5, 'Y'),
			doc(p('hX', strong('ell'), 'Yo'))(schema),
		);
	});

	it('support multiple concurrently typed chars', () => {
		rebase$(
			doc(p('h', em('ell'), 'o'))(schema),
			(tr) => type(type(type(tr, 2, 'X'), 3, 'Y'), 4, 'Z'),
			(tr) => type(type(tr, 5, 'U'), 6, 'V'),
			doc(p('hXYZ', em('ell'), 'UVo'))(schema),
		);
	});

	it('supports three concurrent typers', () => {
		rebase$(
			doc(p('hello there'))(schema),
			(tr) => type(tr, 2, 'X'),
			(tr) => type(tr, 5, 'Y'),
			(tr) => type(tr, 9, 'Z'),
			doc(p('hXellYo thZere'))(schema),
		);
	});

	it('handles wrapping of changed blocks', () => {
		rebase$(
			doc(p('hello'))(schema),
			(tr) => type(tr, 5, 'X'),
			(tr) => wrap(tr, 1, 'blockquote'),
			doc(blockquote(p('hellXo')))(schema),
		);
	});

	it('handles insertions in deleted content', () => {
		rebase$(
			doc(p('hello world!'))(schema),
			(tr) => tr.delete(6, 12),
			(tr) => type(tr, 9, 'X'),
			doc(p('hello!'))(schema),
		);
	});

	it('allows deleting the same content twice', () => {
		rebase(
			doc(p('hello', strong(' wo'), 'rld!'))(schema),
			(tr) => tr.delete(6, 12),
			(tr) => tr.delete(6, 12),
			doc(p('hello!'))(schema),
		);
	});

	it("isn't confused by joining a block that's being edited", () => {
		rebase$(
			doc(ul(li(p('one')), li(p('tw', mention({ id: '2' })(), 'o'))))(schema),
			(tr) => type(tr, 12, 'A'),
			(tr) => tr.join(8),
			doc(ul(li(p('one'), p('twA', mention({ id: '2' })(), 'o'))))(schema),
		);
	});

	it('supports typing concurrently with marking', () => {
		rebase(
			doc(p('hello ', mention({ id: '1' })(), 'wo', mention({ id: '2' })(), 'rld'))(schema),
			(tr) => tr.addMark(8, 14, schema.mark('em')),
			(tr) => type(tr, 10, '_'),
			doc(p('hello ', mention({ id: '1' })(), em('wo'), '_', em(mention({ id: '2' })(), 'rld')))(
				schema,
			),
		);
	});

	it("doesn't unmark marks added concurrently", () => {
		rebase(
			doc(p(em('hello'), ' world'))(schema),
			(tr) => tr.addMark(1, 12, schema.mark('em')),
			(tr) => tr.removeMark(1, 12, schema.mark('em')),
			doc(p('hello', em(' world')))(schema),
		);
	});

	it("doesn't mark concurrently unmarked text", () => {
		rebase(
			doc(p('hello ', em('world')))(schema),
			(tr) => tr.removeMark(1, 12, schema.mark('em')),
			(tr) => tr.addMark(1, 12, schema.mark('em')),
			doc(p(em('hello '), 'world'))(schema),
		);
	});

	it('deletes inserts in replaced context', () => {
		rebase(
			doc(p('before'), blockquote(p('one'), p('two'), p('three')), p('after'))(schema),
			(tr) =>
				tr.replace(
					11,
					23,
					new Slice(Fragment.fromArray([p('a')(schema), p('b')(schema), p('c')(schema)]), 1, 1),
				),
			(tr) => type(tr, 16, 'ayay'),
			doc(p('before'), blockquote(p('oa'), p('b'), p('cee')), p('after'))(schema),
		);
	});

	it('maps through inserts', () => {
		rebase$(
			doc(p('XXX'))(schema),
			(tr) => type(tr, 2, 'hello'),
			(tr) => type(tr, 3, 'goodbye').delete(4, 7),
			doc(p('XhelloXgbyeX'))(schema),
		);
	});

	it('handle concurrent removal of blocks', () => {
		rebase(
			doc(p('a'), code(), p('b'), code(), p('c'))(schema),
			(tr) => tr.delete(2, 6),
			(tr) => tr.delete(2, 6),
			doc(p('a'), code(), p('c'))(schema),
		);
	});

	it('discards edits in removed blocks', () => {
		rebase$(
			doc(p('a'), code(), p('b'), code(), p('c'))(schema),
			(tr) => tr.delete(2, 6),
			(tr) => type(tr, 5, 'ay'),
			doc(p('a'), code(), p('c'))(schema),
		);
	});

	it('preserves double block inserts', () => {
		rebase(
			doc(p('a'), p('b'))(schema),
			(tr) => tr.replaceWith(3, 3, schema.node('paragraph')),
			(tr) => tr.replaceWith(3, 3, schema.node('paragraph')),
			doc(p('a'), p(), p(), p('b'))(schema),
		);
	});

	eeTest.describe('platform_editor_offline_editing_web', 'mark preservation').variant(true, () => {
		it('preserves marks modified (by remote) before a move (by local)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => tr.addMark(7, 16, schema.marks.strong.create({})),
				(tr) => move(tr, { from: 0, to: 17 }, { from: 18 }),
				doc(p('second paragraph'), p('first ', strong('paragraph')))(schema),
			);
		});

		it('preserves marks modified (by remote) before a move up (by local)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => tr.addMark(7, 16, schema.marks.strong.create({})),
				(tr) => move(tr, { from: 17, to: 35 }, { from: 0 }),
				doc(p('second paragraph'), p('first ', strong('paragraph')))(schema),
			);
		});

		it('preserves content added (by remote) before a move (by local)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => type(tr, 6, ' test'),
				(tr) => move(tr, { from: 0, to: 17 }, { from: 18 }),
				doc(p('second paragraph'), p('first test paragraph'))(schema),
			);
		});

		it('preserves marks modified (by both) before a move (by local)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => tr.addMark(7, 16, schema.marks.strong.create({})),
				(tr) =>
					move(tr.addMark(1, 6, schema.marks.strong.create({})), { from: 0, to: 17 }, { from: 18 }),
				doc(p('second paragraph'), p(strong('first'), ' ', strong('paragraph')))(schema),
			);
		});

		it('preserves content added (by local) and mark (remote) before a move (by local)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => tr.addMark(7, 16, schema.marks.strong.create({})),
				(tr) => move(type(tr, 6, ' test'), { from: 0, to: 22 }, { from: 18 }),
				doc(p('second paragraph'), p('first test ', strong('paragraph')))(schema),
			);
		});

		it('preserves content added (by both) before a move (by local)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => type(tr, 6, ' test'),
				(tr) => move(type(tr, 6, ' test'), { from: 0, to: 22 }, { from: 18 }),
				doc(p('second paragraph'), p('first test test paragraph'))(schema),
			);
		});

		it('preserves content added in stages (by both) before a move (by local)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => type(type(tr, 6, ' '), 7, 'test'),
				(tr) => move(type(type(tr, 6, ' '), 7, 'test'), { from: 0, to: 22 }, { from: 18 }),
				doc(p('second paragraph'), p('first test test paragraph'))(schema),
			);
		});

		it('preserves content added before and after a move (same paragraph first)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => type(type(tr, 6, ' '), 7, 'test'),
				(tr) =>
					type(
						type(
							move(type(type(tr, 6, ' '), 7, 'test'), { from: 0, to: 22 }, { from: 18 }),
							24,
							' first',
						),
						7,
						' second',
					),
				doc(p('second second paragraph'), p('first first test test paragraph'))(schema),
			);
		});

		it('preserves content added before and after a move (separate paragraph first)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => type(type(tr, 6, ' '), 7, 'test'),
				(tr) =>
					type(
						type(
							move(type(type(tr, 6, ' '), 7, 'test'), { from: 0, to: 22 }, { from: 18 }),
							7,
							' second',
						),
						31,
						' first',
					),
				doc(p('second second paragraph'), p('first first test test paragraph'))(schema),
			);
		});

		it('preserves content deleted (by both) before a move (by local)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => tr.delete(4, 5),
				(tr) => move(tr.delete(6, 7), { from: 0, to: 16 }, { from: 18 }),
				doc(p('second paragraph'), p('firtparagraph'))(schema),
			);
		});

		it('preserves marks modified (by both) before multiple moves', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => tr.addMark(7, 16, schema.marks.strong.create({})),
				(tr) =>
					move(
						move(
							tr.addMark(1, 6, schema.marks.strong.create({})),
							{ from: 0, to: 17 },
							{ from: 18 },
						),
						{ from: 18, to: 35 },
						{ from: 0 },
					),
				doc(p(strong('first'), ' ', strong('paragraph')), p('second paragraph'))(schema),
			);
		});

		it('preserves modified content (by both) before multiple moves (by local)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => tr.addMark(7, 16, schema.marks.strong.create({})),
				(tr) =>
					move(
						move(type(tr, 6, ' test'), { from: 0, to: 22 }, { from: 18 }),
						{ from: 18, to: 40 },
						{ from: 0 },
					),
				doc(p('first test ', strong('paragraph')), p('second paragraph'))(schema),
			);
		});

		it('preserves adding content (by both) before multiple moves down + up (by local)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => type(tr, 6, ' test'),
				(tr) =>
					move(
						move(type(tr, 6, ' test'), { from: 0, to: 22 }, { from: 18 }),
						{ from: 18, to: 40 },
						{ from: 0 },
					),
				doc(p('first test test paragraph'), p('second paragraph'))(schema),
			);
		});

		it('preserves adding content (by both) before multiple moves up + down (by local)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => type(tr, 24, ' test'),
				(tr) =>
					move(
						move(type(tr, 24, ' test'), { from: 17, to: 40 }, { from: 0 }),
						{ from: 0, to: 23 },
						{ from: 17 },
					),
				doc(p('first paragraph'), p('second test test paragraph'))(schema),
			);
		});

		it('preserves deleting content (by both) before multiple moves down + up (by local)', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => tr.delete(4, 5),
				(tr) =>
					move(
						move(tr.delete(6, 7), { from: 0, to: 16 }, { from: 18 }),
						{ from: 18, to: 34 },
						{ from: 0 },
					),
				doc(p('firtparagraph'), p('second paragraph'))(schema),
			);
		});

		it('preserves deleting content (by both) before multiple moves down + up (by local) with typing', () => {
			rebase(
				doc(p('first paragraph'), p('second paragraph'))(schema),
				(tr) => tr.delete(4, 5),
				(tr) =>
					move(
						type(move(tr.delete(6, 7), { from: 0, to: 16 }, { from: 18 }), 6, 'xoxo'),
						{ from: 22, to: 38 },
						{ from: 0 },
					),
				doc(p('firtparagraph'), p('seconxoxod paragraph'))(schema),
			);
		});
	});
});
