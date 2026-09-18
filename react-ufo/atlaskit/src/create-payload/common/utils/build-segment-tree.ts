import { getConfig } from '../../../config';
import type { LabelStack } from '../../../interaction-context';
import type { SegmentItem, SegmentTree } from './index';
import { isSegmentLabel } from './is-segment-label';
import { sanitizeLabelStackName } from './sanitize-label-stack-name';
import { stringifyLabelStackWithoutId } from './stringify-label-stack-without-id';

export function buildSegmentTree(labelStacks: LabelStack[]): SegmentTree {
	const r: SegmentItem = { n: 'segment-tree-root', c: {} };
	const config = getConfig();
	const segmentThreshold = config?.segmentsThreshold;
	const addSegmentsMap = new Map<string, number>();

	labelStacks.forEach((labelStack) => {
		const stringifiedLabelStack = stringifyLabelStackWithoutId(labelStack);
		let currentNode = r;

		for (const label of labelStack) {
			const isSegment = isSegmentLabel(label);
			const name = sanitizeLabelStackName(label.name);
			if (isSegment && segmentThreshold && segmentThreshold[name]) {
				const threshold = segmentThreshold[name];
				const count = addSegmentsMap.get(stringifiedLabelStack) || 0;

				if (count < threshold) {
					addSegmentsMap.set(stringifiedLabelStack, count + 1);
				} else {
					break;
				}
			}
			const id = isSegment ? label.segmentId : undefined;
			const key = id !== undefined ? id : name;
			const type = isSegment ? label.type : undefined;
			if (!currentNode.c) {
				currentNode.c = {};
			}
			if (!currentNode.c[key]) {
				currentNode.c[key] = {
					n: name,
					...(type ? { t: type } : {}),
				};
			}
			currentNode = currentNode.c[key];
		}
	});

	return { r };
}
