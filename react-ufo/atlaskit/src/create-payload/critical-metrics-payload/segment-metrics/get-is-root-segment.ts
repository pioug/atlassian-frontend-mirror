import type { LabelStack } from '../../../interaction-context';

export default function getIsRootSegment(labelStack: LabelStack) {
	return labelStack.length === 1;
}
