import { Transaction } from 'prosemirror-state';
import { Node as PMNode, Slice } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';

/**
 * Finds all top level nodes affected by the transaction
 * Uses from/to positions in transaction's steps to work out which nodes will
 * be changed by the transaction
 */
export const findChangedNodesFromTransaction = (tr: Transaction): PMNode[] => {
  const nodes: PMNode[] = [];
  const steps = (tr.steps || []) as (Step & {
    from: number;
    to: number;
    slice?: Slice;
  })[];

  steps.forEach(step => {
    const { to, from, slice } = step;
    const size = slice && slice.content ? slice.content.size : 0;
    for (let i = from; i <= to + size; i++) {
      if (i <= tr.doc.content.size) {
        const topLevelNode = tr.doc.resolve(i).node(1);
        if (topLevelNode && !nodes.find(n => n === topLevelNode)) {
          nodes.push(topLevelNode);
        }
      }
    }
  });

  return nodes;
};

export const validNode = (node: PMNode): boolean => {
  try {
    node.check(); // this will throw an error if the node is invalid
  } catch (error) {
    return false;
  }
  return true;
};

/** Validates prosemirror nodes, and returns true only if all nodes are valid */
export const validateNodes = (nodes: PMNode[]): boolean =>
  nodes.every(validNode);

export const isNodeTypeParagraph = (node: PMNode | undefined | null): boolean =>
  Boolean(node && node.type && node.type.name === 'paragraph');
