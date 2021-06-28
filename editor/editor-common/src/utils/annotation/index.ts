import { Mark, Node as PMNode, Schema } from 'prosemirror-model';

type Range = {
  from: number;
  to: number;
};

export const canApplyAnnotationOnRange = (
  rangeSelection: Range,
  doc: PMNode,
  schema: Schema,
): boolean => {
  const { from, to } = rangeSelection;
  if (isNaN(from + to) || to - from <= 0 || to < 0 || from < 0) {
    return false;
  }

  let foundInvalid = false;

  doc.nodesBetween(
    rangeSelection.from,
    rangeSelection.to,
    (node, _pos, parent) => {
      // Special exception for hardBreak nodes
      if (schema.nodes.hardBreak === node.type) {
        return false;
      }

      // For block elements or text nodes, we want to check
      // if annotations are allowed inside this tree
      // or if we're leaf and not text
      if (
        (node.isInline && !node.isText) ||
        (node.isLeaf && !node.isText) ||
        (node.isText && !parent.type.allowsMarkType(schema.marks.annotation))
      ) {
        foundInvalid = true;
        return false;
      }

      return true;
    },
  );

  return !foundInvalid;
};

export const getAnnotationIdsFromRange = (
  rangeSelection: Range,
  doc: PMNode,
  schema: Schema,
): string[] => {
  const { from, to } = rangeSelection;
  let annotations = new Set<string>();

  doc.nodesBetween(from, to, (node) => {
    if (!node.marks) {
      return true;
    }
    node.marks.forEach((mark: Mark<any>) => {
      if (mark.type === schema.marks.annotation && mark.attrs) {
        annotations.add(mark.attrs.id);
      }
    });
    return true;
  });

  return Array.from(annotations);
};
