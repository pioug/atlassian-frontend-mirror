import { ResolvedPos, Mark } from 'prosemirror-model';
import { AnnotationInfo } from './types';
import { sum } from '../../utils';
import { EditorState } from 'prosemirror-state';

/**
 * Finds the marks in the nodes to the left and right.
 * @param $pos Position to center search around
 */
export const surroundingMarks = ($pos: ResolvedPos) => {
  const { nodeBefore, nodeAfter } = $pos;
  const markNodeBefore =
    nodeBefore && $pos.doc.nodeAt($pos.pos - nodeBefore.nodeSize - 1);
  const markNodeAfter =
    nodeAfter && $pos.doc.nodeAt($pos.pos + nodeAfter.nodeSize);

  return [
    (markNodeBefore && markNodeBefore.marks) || [],
    (markNodeAfter && markNodeAfter.marks) || [],
  ];
};

/**
 * Finds annotation marks, and returns their IDs.
 * @param marks Array of marks to search in
 */
export const filterAnnotationIds = (marks: Array<Mark>): Array<string> => {
  if (!marks.length) {
    return [];
  }

  const { annotation } = marks[0].type.schema.marks;
  return marks
    .filter(mark => mark.type === annotation)
    .map(mark => mark.attrs.id);
};

/**
 * Re-orders the annotation array based on the order in the document.
 *
 * This places the marks that do not appear in the surrounding nodes
 * higher in the list. That is, the inner-most one appears first.
 *
 * Undo, for example, can re-order annotation marks in the document.
 * @param annotations annotation metadata
 * @param $from location to look around (usually the selection)
 */
export const reorderAnnotations = (
  annotations: Array<AnnotationInfo>,
  $from: ResolvedPos,
) => {
  const idSet = surroundingMarks($from).map(filterAnnotationIds);

  annotations.sort(
    (a, b) =>
      sum(idSet, ids => ids.indexOf(a.id)) -
      sum(idSet, ids => ids.indexOf(b.id)),
  );
};

export const getAllAnnotations = (doc: EditorState['doc']): string[] => {
  const allAnnotationIds: Set<string> = new Set();
  doc.nodesBetween(0, doc.content.size, node =>
    node.marks
      .filter(mark => mark.type.name === 'annotation')
      .forEach(m => allAnnotationIds.add(m.attrs.id)),
  );

  return Array.from(allAnnotationIds);
};
