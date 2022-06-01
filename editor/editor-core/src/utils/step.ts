import { NodeType, Slice } from 'prosemirror-model';
import { ReplaceAroundStep, ReplaceStep, Step } from 'prosemirror-transform';

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

export const extractSliceFromStep = (step: Step): Slice | null => {
  if (!(step instanceof ReplaceStep) && !(step instanceof ReplaceAroundStep)) {
    return null;
  }

  // @ts-ignore This is by design. Slice is a private property, but accesible, from ReplaceStep.
  // However, we need to read it to found if the step was adding a newline
  const slice = step.slice;

  return slice as Slice;
};
