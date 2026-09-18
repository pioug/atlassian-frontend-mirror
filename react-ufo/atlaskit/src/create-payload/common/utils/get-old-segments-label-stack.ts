import type { InteractionType, SegmentInfo } from '../../../common';
import { getConfig } from '../../../config';
import type { SegmentLabel } from '../../../interaction-context';
import { type UFOSegmentType } from '../../../segment/segment';
import { isSegmentLabel } from './is-segment-label';
import { sanitizeLabelStackName } from './sanitize-label-stack-name';
import { stringifyLabelStackWithoutId } from './stringify-label-stack-without-id';

export function getOldSegmentsLabelStack(
	segments: SegmentInfo[],
	_interactionType: InteractionType,
):
	| {
			labelStack: any[];
	  }[]
	| {
			labelStack:
				| string
				| {
						t?: UFOSegmentType | undefined;
						s?: string | undefined;
						n: string;
				  }[];
	  }[] {
	const config = getConfig();
	const addSegmentsMap = new Map<string, number>();
	const segmentThreshold = config?.segmentsThreshold;
	return segments.map(({ labelStack, ...others }) => {
		const stringifiedLabelStack = stringifyLabelStackWithoutId(labelStack);
		const segmentsInfo: any[] = [];
		for (const ls of labelStack) {
			const isSegment = isSegmentLabel(ls);
			const name = sanitizeLabelStackName(ls.name);
			if (isSegment && segmentThreshold && segmentThreshold[name]) {
				const threshold = segmentThreshold[name];
				const count = addSegmentsMap.get(stringifiedLabelStack) || 0;
				if (count < threshold) {
					addSegmentsMap.set(stringifiedLabelStack, count + 1);
				} else {
					break;
				}
			}
			segmentsInfo.push({
				n: name,
				...((ls as SegmentLabel).segmentId ? { s: (ls as SegmentLabel).segmentId } : {}),
				...((ls as SegmentLabel).type ? { t: (ls as SegmentLabel).type } : {}),
			});
		}
		return { ...others, labelStack: segmentsInfo };
	});
}
