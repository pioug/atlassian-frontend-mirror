import {
  flattenTree,
  getItem,
  mutateTree,
  getTreePosition,
  moveItemOnTree,
} from '../../tree';
import { TreeData } from '../../../types';
import { treeWithThreeLeaves } from '../../../../mockdata/treeWithThreeLeaves';
import { treeWithTwoBranches } from '../../../../mockdata/treeWithTwoBranches';

describe('@atlaskit/tree - utils/tree', () => {
  describe('#flattenTree', () => {
    it('returns empty list if no children', () => {
      expect(flattenTree({ rootId: 'x', items: {} }).length).toBe(0);
    });

    it('returns a flat list with path for one level tree', () => {
      const flatResults = flattenTree(treeWithThreeLeaves);
      expect(flatResults.length).toBe(3);
      expect(flatResults[0]).toEqual({
        item: treeWithThreeLeaves.items['1-1'],
        path: [0],
      });
      expect(flatResults[1]).toEqual({
        item: treeWithThreeLeaves.items['1-2'],
        path: [1],
      });
      expect(flatResults[2]).toEqual({
        item: treeWithThreeLeaves.items['1-3'],
        path: [2],
      });
    });

    it('returns a flat list with path for branches', () => {
      const flatResults = flattenTree(treeWithTwoBranches);
      expect(flatResults.length).toBe(6);
      expect(flatResults[0]).toEqual({
        item: treeWithTwoBranches.items['1-1'],
        path: [0],
      });
      expect(flatResults[1]).toEqual({
        item: treeWithTwoBranches.items['1-1-1'],
        path: [0, 0],
      });
      expect(flatResults[2]).toEqual({
        item: treeWithTwoBranches.items['1-1-2'],
        path: [0, 1],
      });
      expect(flatResults[3]).toEqual({
        item: treeWithTwoBranches.items['1-2'],
        path: [1],
      });
      expect(flatResults[4]).toEqual({
        item: treeWithTwoBranches.items['1-2-1'],
        path: [1, 0],
      });
      expect(flatResults[5]).toEqual({
        item: treeWithTwoBranches.items['1-2-2'],
        path: [1, 1],
      });
    });

    it('does not show collapsed subtrees', () => {
      const collapsedTree: TreeData = {
        rootId: treeWithTwoBranches.rootId,
        items: {
          ...treeWithTwoBranches.items,
          '1-1': {
            ...treeWithTwoBranches.items['1-1'],
            isExpanded: false,
          },
        },
      };
      const flatResults = flattenTree(collapsedTree);
      expect(flatResults.length).toBe(4);
      expect(flatResults[0]).toEqual({
        item: collapsedTree.items['1-1'],
        path: [0],
      });
      expect(flatResults[1]).toEqual({
        item: collapsedTree.items['1-2'],
        path: [1],
      });
      expect(flatResults[2]).toEqual({
        item: collapsedTree.items['1-2-1'],
        path: [1, 0],
      });
      expect(flatResults[3]).toEqual({
        item: collapsedTree.items['1-2-2'],
        path: [1, 1],
      });
    });
  });

  describe('#mutateTree', () => {
    it('mutates the root', () => {
      const { rootId } = treeWithThreeLeaves;
      const mutatedTree = mutateTree(treeWithThreeLeaves, rootId, {
        children: [],
      });
      expect(mutatedTree).not.toBe(treeWithThreeLeaves);
      expect(mutatedTree.rootId).toBe(treeWithThreeLeaves.rootId);
      expect(mutatedTree.items).not.toBe(treeWithThreeLeaves.items);
      expect(mutatedTree.items[rootId].children.length).toBe(0);
      expect(mutatedTree.items[rootId].hasChildren).toBe(true);
      expect(mutatedTree.items[rootId].isExpanded).toBe(true);
      expect(mutatedTree.items[rootId].isChildrenLoading).toBe(false);
      expect(mutatedTree.items[rootId].data).toBe(
        treeWithThreeLeaves.items[rootId].data,
      );
      expect(treeWithThreeLeaves.items[rootId].children.length).toBe(3);
    });

    it('changes only the changed child', () => {
      const itemId = '1-2';
      const mutatedTree = mutateTree(treeWithThreeLeaves, itemId, {
        isChildrenLoading: true,
      });
      expect(mutatedTree).not.toBe(treeWithThreeLeaves);
      expect(mutatedTree.items['1-1']).toBe(treeWithThreeLeaves.items['1-1']);
      expect(mutatedTree.items['1-2']).not.toBe(
        treeWithThreeLeaves.items['1-2'],
      );
      expect(mutatedTree.items['1-2'].isChildrenLoading).toBe(true);
      expect(treeWithThreeLeaves.items['1-2'].isChildrenLoading).toBe(false);
    });

    it('changes only the changed item', () => {
      const itemId = '1-2-2';
      const mutatedTree = mutateTree(treeWithTwoBranches, itemId, {
        isChildrenLoading: true,
      });
      expect(mutatedTree).not.toBe(treeWithTwoBranches);
      expect(mutatedTree.items['1-1']).toBe(treeWithTwoBranches.items['1-1']);
      expect(mutatedTree.items['1-2']).toBe(treeWithTwoBranches.items['1-2']);
      expect(mutatedTree.items['1-2-1']).toBe(
        treeWithTwoBranches.items['1-2-1'],
      );
      expect(mutatedTree.items['1-2-2']).not.toBe(
        treeWithTwoBranches.items['1-2-2'],
      );
      expect(mutatedTree.items['1-2-2'].isChildrenLoading).toBe(true);
      expect(treeWithTwoBranches.items['1-2-2'].isChildrenLoading).toBe(false);
    });

    it('does not change if item not found', () => {
      expect(
        mutateTree(treeWithTwoBranches, 'notfound', { isExpanded: true }),
      ).toBe(treeWithTwoBranches);
    });
  });

  describe('#getItem', () => {
    it('returns item from the first level of tree', () => {
      expect(getItem(treeWithThreeLeaves, [1])).toBe(
        treeWithThreeLeaves.items['1-2'],
      );
    });

    it('returns item from deep the tree', () => {
      expect(getItem(treeWithTwoBranches, [1, 1])).toBe(
        treeWithTwoBranches.items['1-2-2'],
      );
    });

    it('returns undefined if item does not exist', () => {
      expect(getItem(treeWithThreeLeaves, [100])).toBe(undefined);
    });
  });

  describe('#getTreePosition', () => {
    it('returns the top element', () => {
      expect(getTreePosition(treeWithTwoBranches, [0])).toEqual({
        parentId: '1',
        index: 0,
      });
    });

    it('returns the top element of a sublist', () => {
      expect(getTreePosition(treeWithTwoBranches, [0, 0])).toEqual({
        parentId: '1-1',
        index: 0,
      });
    });

    it('returns the last element of a sublist', () => {
      expect(getTreePosition(treeWithTwoBranches, [0, 1])).toEqual({
        parentId: '1-1',
        index: 1,
      });
    });
  });

  describe('#moveItemOnTree', () => {
    it('should move item on the tree', () => {
      const newPages = moveItemOnTree(
        treeWithTwoBranches,
        { parentId: '1', index: 0 },
        { parentId: '1', index: 1 },
      );
      expect(newPages.rootId).toBe(treeWithTwoBranches.rootId);
      expect(newPages.items['1'].children).toEqual(['1-2', '1-1']);
    });

    it('should set hasChildren and isExpanded to false if no child left under parent', () => {
      const newPages = moveItemOnTree(
        treeWithTwoBranches,
        { parentId: '1-1', index: 0 },
        { parentId: '1-2', index: 0 },
      );
      expect(newPages.items['1-1'].isExpanded).toBe(true);
      expect(newPages.items['1-1'].hasChildren).toBe(true);
      const finalPages = moveItemOnTree(
        newPages,
        { parentId: '1-1', index: 0 },
        { parentId: '1-2', index: 0 },
      );
      expect(finalPages.rootId).toBe(treeWithTwoBranches.rootId);
      expect(finalPages.items['1-1'].children).toEqual([]);
      expect(finalPages.items['1-1'].isExpanded).toBe(false);
      expect(finalPages.items['1-1'].hasChildren).toBe(false);
      expect(finalPages.items['1-2'].children.length).toEqual(4);
    });

    it('should append to subtree when destination index is not specified and children are loaded', () => {
      const newPages = moveItemOnTree(
        treeWithTwoBranches,
        { parentId: '1-1', index: 0 },
        { parentId: '1-2' },
      );
      expect(newPages.items['1-1'].children.length).toBe(1);
      expect(newPages.items['1-1'].children[0]).toBe('1-1-2');
      expect(newPages.items['1-2'].children.length).toBe(3);
      expect(newPages.items['1-2'].children[0]).toBe('1-2-1');
      expect(newPages.items['1-2'].children[1]).toBe('1-2-2');
      expect(newPages.items['1-2'].children[2]).toBe('1-1-1');
    });

    it('should not append to subtree when destination index is not specified and children are not loaded', () => {
      const treeWithChildrenNotLoaded = mutateTree(
        treeWithTwoBranches,
        '1-2-1',
        { hasChildren: true },
      );
      const newPages = moveItemOnTree(
        treeWithChildrenNotLoaded,
        { parentId: '1-1', index: 0 },
        { parentId: '1-2-1' },
      );
      expect(newPages.items['1-1'].children.length).toBe(1);
      expect(newPages.items['1-1'].children[0]).toBe('1-1-2');
      expect(newPages.items['1-2-1'].children.length).toBe(0);
    });

    it('should nest if parent is a leaf item', () => {
      const newPages = moveItemOnTree(
        treeWithTwoBranches,
        { parentId: '1-1', index: 0 },
        { parentId: '1-2-1' },
      );
      expect(newPages.items['1-1'].children.length).toBe(1);
      expect(newPages.items['1-1'].children[0]).toBe('1-1-2');
      expect(newPages.items['1-2-1'].children.length).toBe(1);
      expect(newPages.items['1-2-1'].children[0]).toBe('1-1-1');
    });
  });
});
