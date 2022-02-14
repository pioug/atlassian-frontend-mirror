import { traverse } from './traverse/traverse';
import { ADFEntity, ADFEntityMark } from './types';

// link mark on mediaSingle is deprecated, need to move link mark to child media node
// https://product-fabric.atlassian.net/browse/ED-14043
export const transformMediaLinkMarks = (adf: ADFEntity) => {
  let isTransformed: boolean = false;
  const transformedAdf = traverse(adf, {
    mediaSingle: (node) => {
      if (!node.marks || !node.content || node.content[0]?.type !== 'media') {
        return node;
      }

      let linkMark: ADFEntityMark | null = null;
      node.marks.forEach((mark, i) => {
        if (mark.type === 'link') {
          linkMark = mark;
          node.marks?.splice(i, 1);
          isTransformed = true;
        }
      });

      if (node.marks.length === 0) {
        delete node.marks;
      }

      if (linkMark) {
        const mediaNode = node.content[0];
        // only add link mark if media node doesnt already have one
        if (mediaNode.marks?.every((mark) => mark.type !== 'link')) {
          mediaNode.marks.push(linkMark);
        } else if (!mediaNode.marks) {
          mediaNode.marks = [linkMark];
        }
      }

      return node;
    },
  });

  return {
    transformedAdf,
    isTransformed,
  };
};
