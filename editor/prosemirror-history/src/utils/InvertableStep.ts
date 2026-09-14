import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform-override';

export class InvertableStep {
	constructor(
		readonly step: ProseMirrorStep,
		readonly inverted: ProseMirrorStep,
	) {}
}
