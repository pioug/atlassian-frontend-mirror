import type { LabelStack } from '../../../interaction-context';

export default function isLabelStackUnderSegment(labelStack: LabelStack, segmentId: string) {
	return labelStack.some((label) => {
		return 'segmentId' in label && label.segmentId === segmentId;
	});
}
