import { type RefractorNode } from '../../types';

import createLineElement from './create-line-element';

export default function flattenCodeTree(
  tree: RefractorNode[],
  offset: number = 0,
  className: string[] = [],
): RefractorNode[] {
  let newTree: RefractorNode[] = [];

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.type === 'text') {
      newTree.push(
        createLineElement({
          children: [node],
          lineNumber: offset,
          className,
        }),
      );
    } else if (node.children) {
      const classNames = className.concat(node.properties.className || []);
      flattenCodeTree(node.children, offset + 1, classNames).forEach((i) =>
        newTree.push(i),
      );
    }
  }
  return newTree;
}
