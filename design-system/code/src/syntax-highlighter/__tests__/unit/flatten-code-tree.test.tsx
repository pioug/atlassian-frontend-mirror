import { type AST } from 'refractor';

import flattenCodeTree from '../../lib/process/flatten-code-tree';

const textTestNode: AST.Text = { type: 'text', value: 'text' };
const textTestNode2: AST.Text = { type: 'text', value: 'text2' };
const elementTestNode: AST.Element = {
  type: 'element',
  tagName: 'span',
  properties: [],
  children: [textTestNode],
};
const elementTestNode2: AST.Element = {
  type: 'element',
  tagName: 'span',
  properties: {
    className: ['testClassName', 'testClassName2'],
  },
  children: [textTestNode, textTestNode2],
};

describe('flattenCodeTree', () => {
  it('should return flattened code tree with single node for 1 text type child', () => {
    const flattenedTree = flattenCodeTree([textTestNode], 2);

    expect(flattenedTree).toHaveLength(1);
    expect(flattenedTree[0]).toEqual(
      expect.objectContaining({
        type: 'element',
        tagName: 'span',
        properties: { className: [] },
        children: [textTestNode],
      }),
    );
  });

  it('should return flattened code tree with 2 nodes for 2 text type children', () => {
    const flattenedTree = flattenCodeTree(
      [textTestNode, textTestNode2],
      2,
    ) as AST.Element[];

    expect(flattenedTree).toHaveLength(2);
    expect(flattenedTree[0].children).toEqual([textTestNode]);
    expect(flattenedTree[1].children).toEqual([textTestNode2]);
  });

  it('should return flattened code tree with 2 nodes for 2 text type children where 1 is nested inside the element node', () => {
    const flattenedTree = flattenCodeTree(
      [elementTestNode, textTestNode2],
      2,
    ) as AST.Element[];

    expect(flattenedTree).toHaveLength(2);
    expect(flattenedTree[0]).toEqual(
      expect.objectContaining({
        type: 'element',
        tagName: 'span',
        properties: { className: [] },
        children: [textTestNode],
      }),
    );
    expect(flattenedTree[1].children).toEqual([textTestNode2]);
  });

  it('should return flattened code tree with 3 nodes for 3 text type children which are nested inside the element node', () => {
    const flattenedTree = flattenCodeTree(
      [elementTestNode, elementTestNode2],
      2,
    ) as AST.Element[];

    expect(flattenedTree).toHaveLength(3);
    expect(flattenedTree[0]).toEqual(
      expect.objectContaining({
        type: 'element',
        tagName: 'span',
        properties: { className: [] },
        children: [textTestNode],
      }),
    );
    expect(flattenedTree[1].children).toEqual([textTestNode]);
    expect(flattenedTree[2].children).toEqual([textTestNode2]);
  });

  it('should skip element type node if it does not have children', () => {
    const testNodeWithoutChildren: AST.Element = {
      type: 'element',
      tagName: 'span',
      properties: [],
      children: [],
    };
    const flattenedTree = flattenCodeTree([testNodeWithoutChildren], 2);

    expect(flattenedTree).toHaveLength(0);
  });

  it('should apply classNames contained in the element type nodes and pass as parameter to every tree node', () => {
    const flattenedTree = flattenCodeTree([elementTestNode2, textTestNode], 0, [
      'testClassName3',
    ]) as AST.Element[];

    expect(flattenedTree).toHaveLength(3);
    expect(flattenedTree[0].properties.className).toEqual(
      expect.arrayContaining([
        'testClassName',
        'testClassName2',
        'testClassName3',
      ]),
    );
    expect(flattenedTree[1].properties.className).toEqual(
      expect.arrayContaining([
        'testClassName',
        'testClassName2',
        'testClassName3',
      ]),
    );
  });
});
