import { NodeType, Slice } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';

export const stepHasSlice = (
  step: Step,
): step is Step & { from: number; to: number; slice: Slice } =>
  step && step.hasOwnProperty('slice');

/**
 * Checks whether a given step is adding nodes of given nodeTypes
 *
 * @param step Step to check
 * @param nodeTypes NodeTypes being added
 */
export function stepAddsOneOf(step: Step, nodeTypes: Set<NodeType>): boolean {
  let adds = false;

  if (!stepHasSlice(step)) {
    return adds;
  }

  step.slice.content.descendants((node) => {
    if (nodeTypes.has(node.type)) {
      adds = true;
    }
    return !adds;
  });

  return adds;
}
