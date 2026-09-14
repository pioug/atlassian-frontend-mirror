import type { Step } from '@atlaskit/editor-prosemirror/transform-override';

export class InvertableStep {
	constructor(
		readonly step: Step,
		readonly inverted: Step,
		readonly allocation: number,
	) {}
}
