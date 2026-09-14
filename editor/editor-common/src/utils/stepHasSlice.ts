import type { Slice } from '@atlaskit/editor-prosemirror/model';
import type { Step } from '@atlaskit/editor-prosemirror/transform-override';

export const stepHasSlice = (
	step: Step,
): step is Step & { from: number; slice: Slice; to: number } =>
	step && step.hasOwnProperty('slice');
