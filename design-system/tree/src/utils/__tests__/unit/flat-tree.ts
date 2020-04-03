import { getDestinationPath, getSourcePath } from '../../flat-tree';

import { flattenTree } from '../../tree';

import { treeWithTwoBranches } from '../../../../mockdata/treeWithTwoBranches';
import { complexTree } from '../../../../mockdata/complexTree';

const flatTreeWithTwoBranches = flattenTree(treeWithTwoBranches);
const flatComplexTree = flattenTree(complexTree);

describe('@atlaskit/tree - utils/flat-tree', () => {
  describe('#getSourcePath', () => {
    it('handles the top element', () => {
      expect(getSourcePath(flatTreeWithTwoBranches, 0)).toEqual([0]);
    });

    it('handles element deeper', () => {
      expect(getSourcePath(flatTreeWithTwoBranches, 1)).toEqual([0, 0]);
    });
  });

  describe('#getDestinationPath', () => {
    describe('staying at the same vertical position', () => {
      it('returns the same path if the index did not change and no level specified', () => {
        expect(getDestinationPath(flatComplexTree, 1, 1)).toEqual([1]);
      });
      it('changes path if different and valid level specified (moving left)', () => {
        expect(getDestinationPath(flatComplexTree, 6, 6, 1)).toEqual([3]);
      });
      it('changes path if different and valid level specified (moving right)', () => {
        expect(getDestinationPath(flatComplexTree, 7, 7, 2)).toEqual([2, 4]);
      });
      it('changes path if the only child and valid level specified (moving left)', () => {
        // Making the first parent to have only one child
        const treeWithSingleChild = {
          ...treeWithTwoBranches,
          items: {
            ...treeWithTwoBranches.items,
            '1-1': {
              ...treeWithTwoBranches.items['1-1'],
              children: ['1-1-1'],
            },
          },
        };

        expect(
          getDestinationPath(flattenTree(treeWithSingleChild), 1, 1, 1),
        ).toEqual([1]);
      });
      it('returns the same path if on top of subtree (moving left)', () => {
        expect(getDestinationPath(flatComplexTree, 3, 3, 1)).toEqual([2, 0]);
      });
      it('returns the same path if in middle of subtree (moving left)', () => {
        expect(getDestinationPath(flatComplexTree, 4, 4, 1)).toEqual([2, 1]);
      });
    });

    describe('moving down', () => {
      describe('same parent', () => {
        it('moves to the middle of the list', () => {
          expect(getDestinationPath(flatComplexTree, 3, 4)).toEqual([2, 1]);
        });
        it('moves to the end of the list', () => {
          expect(getDestinationPath(flatComplexTree, 3, 6)).toEqual([2, 3]);
        });
        it('moves to the end of the list with level 1 (moving left)', () => {
          expect(getDestinationPath(flatComplexTree, 3, 6, 1)).toEqual([3]);
        });
        it('moves to the end of the list with level 2 (stay same level)', () => {
          expect(getDestinationPath(flatComplexTree, 3, 6, 2)).toEqual([2, 3]);
        });
        it('moves to the end of the list with level 3 (moving right, error case, should be no effect)', () => {
          expect(getDestinationPath(flatComplexTree, 3, 6, 3)).toEqual([2, 3]);
        });
      });

      describe('different parent', () => {
        describe('higher level', () => {
          it('moves to the middle of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 8)).toEqual([5]);
          });
          it('moves to the end of the list to the top level', () => {
            expect(getDestinationPath(flatComplexTree, 4, 20)).toEqual([9]);
          });
          it('moves to the end of the list to not top level', () => {
            expect(getDestinationPath(flatComplexTree, 15, 18)).toEqual([6, 5]);
          });
          it('moves to the end of the list to not top level with level 1 (moving left)', () => {
            expect(getDestinationPath(flatComplexTree, 15, 18, 1)).toEqual([7]);
          });
        });

        describe('same level', () => {
          it('moves to the top of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 10)).toEqual([6, 0]);
          });
          it('moves to the middle of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 12)).toEqual([6, 2]);
          });
          it('moves to the end of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 18)).toEqual([6, 5]);
          });
          it('moves to the end of the list with level 1 (moving left)', () => {
            expect(getDestinationPath(flatComplexTree, 4, 18, 1)).toEqual([7]);
          });
        });

        describe('lower level', () => {
          it('moves to the top of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 13)).toEqual([
              6,
              2,
              0,
            ]);
          });
          it('moves to the middle of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 14)).toEqual([
              6,
              2,
              1,
            ]);
          });
          it('moves to the end of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 16)).toEqual([6, 3]);
          });
        });
      });
    });

    describe('moving up', () => {
      describe('same parent', () => {
        it('moves to the top of the list', () => {
          expect(getDestinationPath(flatComplexTree, 4, 3)).toEqual([2, 0]);
        });
        it('moves to the middle of the list', () => {
          expect(getDestinationPath(flatComplexTree, 5, 4)).toEqual([2, 1]);
        });
      });

      describe('different parent', () => {
        describe('higher level', () => {
          it('moves to the top of the list on the top level', () => {
            expect(getDestinationPath(flatComplexTree, 4, 0)).toEqual([0]);
          });
          it('moves to the top of the list not on the top level', () => {
            expect(getDestinationPath(flatComplexTree, 15, 11)).toEqual([6, 0]);
          });
          it('moves to the middle of the list', () => {
            expect(getDestinationPath(flatComplexTree, 4, 1)).toEqual([1]);
          });
        });

        describe('same level', () => {
          it('moves to the top of the list on same level', () => {
            expect(getDestinationPath(flatComplexTree, 12, 3)).toEqual([2, 0]);
          });
          it('moves to the middle of the list', () => {
            expect(getDestinationPath(flatComplexTree, 12, 4)).toEqual([2, 1]);
          });
          it('moves to the end of the list', () => {
            expect(getDestinationPath(flatComplexTree, 12, 7)).toEqual([2, 4]);
          });
          it('moves to the end of the list with level 2 (explicitly staying same level)', () => {
            expect(getDestinationPath(flatComplexTree, 12, 7, 2)).toEqual([
              2,
              4,
            ]);
          });
          it('moves to the end of the list with level 1 (moving left)', () => {
            expect(getDestinationPath(flatComplexTree, 12, 7, 1)).toEqual([3]);
          });
        });

        describe('lower level', () => {
          it('moves to the top of the list', () => {
            expect(getDestinationPath(flatComplexTree, 18, 14)).toEqual([
              6,
              2,
              0,
            ]);
          });
          it('moves to the middle of the list', () => {
            expect(getDestinationPath(flatComplexTree, 18, 15)).toEqual([
              6,
              2,
              1,
            ]);
          });
          it('moves to the end of the list', () => {
            expect(getDestinationPath(flatComplexTree, 18, 17)).toEqual([6, 3]);
          });
          it('moves to the end of the list with level 3 (moving right)', () => {
            expect(getDestinationPath(flatComplexTree, 18, 17, 3)).toEqual([
              6,
              2,
              3,
            ]);
          });
        });
      });
    });
  });
});
