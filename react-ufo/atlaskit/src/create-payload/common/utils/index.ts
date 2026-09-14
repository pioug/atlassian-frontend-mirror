import type { LabelStack } from '../../../interaction-context';
import { type UFOSegmentType } from '../../../segment/segment';

import { isSegmentLabel } from './is-segment-label';
import { sanitizeLabelStackName } from './sanitize-label-stack-name';

export type SegmentItem = {
	n: string;
	c?: Record<string, SegmentItem>;
	t?: UFOSegmentType;
};

export type SegmentTree = {
	r: SegmentItem;
};

export function getLabelStackReference(labelStack: LabelStack): string {
	return labelStack
		.map((l) => (isSegmentLabel(l) ? l.segmentId : sanitizeLabelStackName(l.name)))
		.join('/');
}
