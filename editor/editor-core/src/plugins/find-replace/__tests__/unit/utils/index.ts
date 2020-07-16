import { Decoration } from 'prosemirror-view';
import {
  findLostAdjacentDecorations,
  isMatchAffectedByStep,
} from '../../../utils';

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

  describe('isMatchAffectedByStep', () => {
    it('returns false when one character is removed from another match', () => {
      // match state after step applied
      const match = { start: 1, end: 6 };
      // a step representing removal of a single character
      const step = {
        from: 11,
        to: 12,
        slice: { content: { size: 0 } },
      };
      const tr = { mapping: { map: () => step.from } };
      const affected = isMatchAffectedByStep(match, step as any, tr as any);
      expect(affected).toEqual(false);
    });

    it('returns true when one character is removed from the existing match', () => {
      // match state after step applied
      const match = { start: 7, end: 11 };
      // a step representing removal of a single character
      const step = {
        from: 11,
        to: 12,
        slice: { content: { size: 0 } },
      };
      const tr = { mapping: { map: () => step.from } };
      const affected = isMatchAffectedByStep(match, step as any, tr as any);
      expect(affected).toEqual(true);
    });

    it('returns false when two characters are removed from another match', () => {
      // match state after step applied
      const match = { start: 1, end: 6 };
      // a step representing removal of two characters
      const step = {
        from: 10,
        to: 12,
        slice: { content: { size: 0 } },
      };
      const tr = { mapping: { map: () => step.from } };
      const affected = isMatchAffectedByStep(match, step as any, tr as any);
      expect(affected).toEqual(false);
    });

    it('returns true when two characters are removed from the existing match', () => {
      // match state after step applied
      const match = { start: 7, end: 10 };
      // a step representing removal of two characters
      const step = {
        from: 10,
        to: 12,
        slice: { content: { size: 0 } },
      };
      const tr = { mapping: { map: () => step.from } };
      const affected = isMatchAffectedByStep(match, step as any, tr as any);
      expect(affected).toEqual(true);
    });

    it('returns true when two characters are added to the existing non-match', () => {
      // match state after step applied
      const match = { start: 7, end: 12 };
      // a step representing addition of two characters
      const step = {
        from: 10,
        to: 10,
        slice: { content: { size: 2 } },
      };
      const tr = {
        mapping: { map: () => step.from + step.slice.content.size },
      };
      const affected = isMatchAffectedByStep(match, step as any, tr as any);
      expect(affected).toEqual(true);
    });
  });
});
