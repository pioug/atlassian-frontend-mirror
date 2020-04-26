import { Decoration } from 'prosemirror-view';
import { findLostAdjacentDecorations } from '../../../utils';

const aquaDec = Decoration.inline(1, 4, {
  style: 'background-color: aquamarine',
});
const tealDec = Decoration.inline(5, 10, {
  style: 'background-color: teal',
});
const oliveDec = Decoration.inline(11, 14, {
  style: 'background-color: olive',
});
const seashellDec = Decoration.inline(15, 20, {
  style: 'background-color: seashell',
});
const springDec = Decoration.inline(21, 24, {
  style: 'background-color: springgreen',
});

describe('find/replace: utils', () => {
  // This helps catch decorations that Prosemirror accidentally drops when
  // calling DecorationSet.remove
  // When they lose decorations, the lost decorations are always adjacent in position
  // to the intentionally removed decoration(s) - this is related to the internal data
  // structure of a DecorationSet
  describe('findAdjacentLostDecorations', () => {
    describe('removing first item from array', () => {
      it('returns empty array when no decorations are lost', () => {
        const lost = findLostAdjacentDecorations(
          [aquaDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [tealDec, oliveDec, seashellDec, springDec],
        );
        expect(lost).toEqual([]);
      });

      it('finds lost decorations when all decorations are lost', () => {
        const lost = findLostAdjacentDecorations(
          [aquaDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [],
        );
        expect(lost).toEqual([tealDec, oliveDec, seashellDec, springDec]);
      });

      it('finds lost decorations when following decoration lost', () => {
        const lost = findLostAdjacentDecorations(
          [aquaDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [oliveDec, seashellDec, springDec],
        );
        expect(lost).toEqual([tealDec]);
      });

      it('finds lost decorations when multiple following decorations lost', () => {
        const lost = findLostAdjacentDecorations(
          [aquaDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [seashellDec, springDec],
        );
        expect(lost).toEqual([tealDec, oliveDec]);
      });
    });

    describe('removing middle item from array', () => {
      it('returns empty array when no decorations are lost', () => {
        const lost = findLostAdjacentDecorations(
          [oliveDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [aquaDec, tealDec, seashellDec, springDec],
        );
        expect(lost).toEqual([]);
      });

      it('finds lost decorations when all decorations are lost', () => {
        const lost = findLostAdjacentDecorations(
          [oliveDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [],
        );
        expect(lost).toEqual([aquaDec, tealDec, seashellDec, springDec]);
      });

      it('finds lost decorations when preceding decoration lost', () => {
        const lost = findLostAdjacentDecorations(
          [oliveDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [aquaDec, seashellDec, springDec],
        );
        expect(lost).toEqual([tealDec]);
      });

      it('finds lost decorations when following decoration lost', () => {
        const lost = findLostAdjacentDecorations(
          [oliveDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [aquaDec, tealDec, springDec],
        );
        expect(lost).toEqual([seashellDec]);
      });

      it('finds lost decorations when preceding and following decorations lost', () => {
        const lost = findLostAdjacentDecorations(
          [oliveDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [aquaDec, springDec],
        );
        expect(lost).toEqual([tealDec, seashellDec]);
      });
    });

    describe('removing last item from array', () => {
      it('returns empty array when no decorations are lost', () => {
        const lost = findLostAdjacentDecorations(
          [springDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [aquaDec, tealDec, oliveDec, seashellDec],
        );
        expect(lost).toEqual([]);
      });

      it('finds lost decorations when all decorations are lost', () => {
        const lost = findLostAdjacentDecorations(
          [springDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [],
        );
        expect(lost).toEqual([aquaDec, tealDec, oliveDec, seashellDec]);
      });

      it('finds lost decorations when preceding decoration lost', () => {
        const lost = findLostAdjacentDecorations(
          [springDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [aquaDec, tealDec, oliveDec],
        );
        expect(lost).toEqual([seashellDec]);
      });

      it('finds lost decorations when multiple preceding decorations lost', () => {
        const lost = findLostAdjacentDecorations(
          [springDec],
          [aquaDec, tealDec, oliveDec, seashellDec, springDec],
          [aquaDec, tealDec],
        );
        expect(lost).toEqual([oliveDec, seashellDec]);
      });
    });
  });
});
