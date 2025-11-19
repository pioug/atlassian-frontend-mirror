import type { LabelStack } from '../../../interaction-context';

export default function getIsRootSegment(labelStack: LabelStack): boolean {
	return labelStack.length === 1;
}
