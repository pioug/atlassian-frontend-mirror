import { type Step } from '@atlaskit/editor-prosemirror/transform';

export class InvertableStep {
	constructor(
		readonly step: Step,
		readonly inverted: Step,
		readonly allocation: number,
	) {}
}
