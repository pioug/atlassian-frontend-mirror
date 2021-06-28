import { NodeType, Slice } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';

export const stepHasSlice = (
  step: Step,
): step is Step & { from: number; to: number; slice: Slice } =>
  step && step.hasOwnProperty('slice');

/**
 * Checks whether a given step adds a given nodeType
 *
 * @param step Step to check
 * @param nodeType NodeType being added
 * @returns
 */
export function stepAdds(step: Step, nodeType: NodeType): boolean {
  let adds = false;

  if (!stepHasSlice(step)) {
    return adds;
  }

  step.slice.content.descendants((node) => {
    if (node.type === nodeType) {
      adds = true;
    }
    return !adds;
  });

  return adds;
}
