import { Fragment, Node, Slice } from '@atlaskit/editor-prosemirror/model';
import { Transform } from '@atlaskit/editor-prosemirror/transform';
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
import { defaultSchema as schema } from '@atlaskit/editor-test-helpers/schema';

import { rebaseSteps } from '../index';

function runRebase(transforms: readonly Transform[], expected: Node) {
  let start = transforms[0].before,
    full = new Transform(start);
  transforms.forEach(transform => {
    let rebased = new Transform(transform.doc);
    let start = transform.steps.length + full.steps.length;
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

  for (let tag in (start as any).tag) {
    let mapped = full.mapping.mapResult((start as any).tag[tag]);

    let exp = (expected as any).tag[tag];
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
  let result = [];
  for (let i = 0; i < array.length; i++) {
    let others = permute(array.slice(0, i).concat(array.slice(i + 1)));
    for (let j = 0; j < others.length; j++) {
      result.push([array[i]].concat(others[j]));
    }
  }
  return result;
}

function rebase(
  doc: Node,
  ...clients: (((tr: Transform) => Transform) | Node)[]
) {
  let expected = clients.pop() as Node;
  runRebase(
    (clients as ((tr: Transform) => Transform)[]).map(cl =>
      cl(new Transform(doc)),
    ),
    expected,
  );
}

function rebase$(
  doc: Node,
  ...clients: (((tr: Transform) => Transform) | Node)[]
) {
  let expected = clients.pop() as Node;
  permute(
    (clients as ((tr: Transform) => Transform)[]).map(cl =>
      cl(new Transform(doc)),
    ),
  ).forEach(transforms => runRebase(transforms, expected));
}

function type(tr: Transform, pos: number, text: string) {
  return tr.replaceWith(pos, pos, schema.text(text));
}

function wrap(tr: Transform, pos: number, type: string) {
  let $pos = tr.doc.resolve(pos);
  return tr.wrap($pos.blockRange($pos)!, [{ type: schema.nodes[type] }]);
}

describe('rebaseSteps', () => {
  it('supports concurrent typing', () => {
    rebase$(
      doc(p('h', strong('ell'), 'o'))(schema),
      tr => type(tr, 2, 'X'),
      tr => type(tr, 5, 'Y'),
      doc(p('hX', strong('ell'), 'Yo'))(schema),
    );
  });

  it('support multiple concurrently typed chars', () => {
    rebase$(
      doc(p('h', em('ell'), 'o'))(schema),
      tr => type(type(type(tr, 2, 'X'), 3, 'Y'), 4, 'Z'),
      tr => type(type(tr, 5, 'U'), 6, 'V'),
      doc(p('hXYZ', em('ell'), 'UVo'))(schema),
    );
  });

  it('supports three concurrent typers', () => {
    rebase$(
      doc(p('hello there'))(schema),
      tr => type(tr, 2, 'X'),
      tr => type(tr, 5, 'Y'),
      tr => type(tr, 9, 'Z'),
      doc(p('hXellYo thZere'))(schema),
    );
  });

  it('handles wrapping of changed blocks', () => {
    rebase$(
      doc(p('hello'))(schema),
      tr => type(tr, 5, 'X'),
      tr => wrap(tr, 1, 'blockquote'),
      doc(blockquote(p('hellXo')))(schema),
    );
  });

  it('handles insertions in deleted content', () => {
    rebase$(
      doc(p('hello world!'))(schema),
      tr => tr.delete(6, 12),
      tr => type(tr, 9, 'X'),
      doc(p('hello!'))(schema),
    );
  });

  it('allows deleting the same content twice', () => {
    rebase(
      doc(p('hello', strong(' wo'), 'rld!'))(schema),
      tr => tr.delete(6, 12),
      tr => tr.delete(6, 12),
      doc(p('hello!'))(schema),
    );
  });

  it("isn't confused by joining a block that's being edited", () => {
    rebase$(
      doc(ul(li(p('one')), li(p('tw', mention({ id: '2' })(), 'o'))))(schema),
      tr => type(tr, 12, 'A'),
      tr => tr.join(8),
      doc(ul(li(p('one'), p('twA', mention({ id: '2' })(), 'o'))))(schema),
    );
  });

  it('supports typing concurrently with marking', () => {
    rebase(
      doc(
        p(
          'hello ',
          mention({ id: '1' })(),
          'wo',
          mention({ id: '2' })(),
          'rld',
        ),
      )(schema),
      tr => tr.addMark(8, 14, schema.mark('em')),
      tr => type(tr, 10, '_'),
      doc(
        p(
          'hello ',
          mention({ id: '1' })(),
          em('wo'),
          '_',
          em(mention({ id: '2' })(), 'rld'),
        ),
      )(schema),
    );
  });

  it("doesn't unmark marks added concurrently", () => {
    rebase(
      doc(p(em('hello'), ' world'))(schema),
      tr => tr.addMark(1, 12, schema.mark('em')),
      tr => tr.removeMark(1, 12, schema.mark('em')),
      doc(p('hello', em(' world')))(schema),
    );
  });

  it("doesn't mark concurrently unmarked text", () => {
    rebase(
      doc(p('hello ', em('world')))(schema),
      tr => tr.removeMark(1, 12, schema.mark('em')),
      tr => tr.addMark(1, 12, schema.mark('em')),
      doc(p(em('hello '), 'world'))(schema),
    );
  });

  it('deletes inserts in replaced context', () => {
    rebase(
      doc(
        p('before'),
        blockquote(p('one'), p('two'), p('three')),
        p('after'),
      )(schema),
      tr =>
        tr.replace(
          11,
          23,
          new Slice(
            Fragment.fromArray([
              p('a')(schema),
              p('b')(schema),
              p('c')(schema),
            ]),
            1,
            1,
          ),
        ),
      tr => type(tr, 16, 'ayay'),
      doc(
        p('before'),
        blockquote(p('oa'), p('b'), p('cee')),
        p('after'),
      )(schema),
    );
  });

  it('maps through inserts', () => {
    rebase$(
      doc(p('XXX'))(schema),
      tr => type(tr, 2, 'hello'),
      tr => type(tr, 3, 'goodbye').delete(4, 7),
      doc(p('XhelloXgbyeX'))(schema),
    );
  });

  it('handle concurrent removal of blocks', () => {
    rebase(
      doc(p('a'), code(), p('b'), code(), p('c'))(schema),
      tr => tr.delete(2, 6),
      tr => tr.delete(2, 6),
      doc(p('a'), code(), p('c'))(schema),
    );
  });

  it('discards edits in removed blocks', () => {
    rebase$(
      doc(p('a'), code(), p('b'), code(), p('c'))(schema),
      tr => tr.delete(2, 6),
      tr => type(tr, 5, 'ay'),
      doc(p('a'), code(), p('c'))(schema),
    );
  });

  it('preserves double block inserts', () => {
    rebase(
      doc(p('a'), p('b'))(schema),
      tr => tr.replaceWith(3, 3, schema.node('paragraph')),
      tr => tr.replaceWith(3, 3, schema.node('paragraph')),
      doc(p('a'), p(), p(), p('b'))(schema),
    );
  });
});
