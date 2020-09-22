import { Node } from 'prosemirror-model';

export function getListIndentLevel(path: Node[]) {
  let count = 1;
  path.forEach((node: Node) => {
    if (node.type.name === 'bulletList' || node.type.name === 'orderedList') {
      count++;
    }
  });
  return count;
}
