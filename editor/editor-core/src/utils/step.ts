import { Slice } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';

export const stepHasSlice = (
  step: Step,
): step is Step & { from: number; to: number; slice: Slice } =>
  step && step.hasOwnProperty('slice');
