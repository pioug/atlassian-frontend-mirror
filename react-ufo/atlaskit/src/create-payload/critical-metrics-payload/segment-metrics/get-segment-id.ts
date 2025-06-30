import type { LabelStack } from '../../../interaction-context';

export default function getSegmentId(labelStack: LabelStack) {
	for (let i = labelStack.length - 1; i >= 0; i--) {
		const label = labelStack[i];
		if ('segmentId' in label) {
			return label.segmentId;
		}
	}
	return undefined;
}
