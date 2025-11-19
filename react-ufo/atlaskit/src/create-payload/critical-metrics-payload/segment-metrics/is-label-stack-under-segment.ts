import type { LabelStack } from '../../../interaction-context';

export default function isLabelStackUnderSegment(
	labelStack: LabelStack,
	segmentId: string,
): boolean {
	return labelStack.some((label) => {
		return 'segmentId' in label && label.segmentId === segmentId;
	});
}
