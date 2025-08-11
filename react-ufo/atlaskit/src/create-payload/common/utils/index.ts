import { fg } from '@atlaskit/platform-feature-flags';

import type { InteractionType, SegmentInfo } from '../../../common';
import { getConfig } from '../../../config';
import type { LabelStack, SegmentLabel } from '../../../interaction-context';
import { type UFOSegmentType } from '../../../segment/segment';
import { getReactUFOPayloadVersion } from '../../utils/get-react-ufo-payload-version';

export type SegmentItem = {
	n: string;
	c?: Record<string, SegmentItem>;
	t?: UFOSegmentType;
};

export type SegmentTree = {
	r: SegmentItem;
};

export function sanitizeUfoName(name: string) {
	return name.replace(/_/g, '-');
}

export function isSegmentLabel(obj: any): obj is SegmentLabel {
	return obj && typeof obj.name === 'string' && typeof obj.segmentId === 'string';
}

export function buildSegmentTree(labelStacks: LabelStack[]): SegmentTree {
	const r: SegmentItem = { n: 'segment-tree-root', c: {} };
	const config = getConfig();
	const segmentThreshold = config?.segmentsThreshold;
	const addSegmentsMap = new Map<string, number>();
	if (fg('platform_ufo_add_segments_count_threshold')) {
		labelStacks.forEach((labelStack) => {
			const stringifiedLabelStack = stringifyLabelStackWithoutId(labelStack);
			let currentNode = r;

			for (const label of labelStack) {
				const isSegment = isSegmentLabel(label);
				const name = label.name;
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
						...(type && fg('platform_ufo_add_type_for_3p_segments') ? { t: type } : {}),
					};
				}
				currentNode = currentNode.c[key];
			}
		});
	} else {
		labelStacks.forEach((labelStack) => {
			let currentNode = r;
			labelStack.forEach((label) => {
				const name = label.name;
				const id = isSegmentLabel(label) ? label.segmentId : undefined;
				const key = id !== undefined ? id : name;
				const type = isSegmentLabel(label) ? label.type : undefined;
				if (!currentNode.c) {
					currentNode.c = {};
				}
				if (!currentNode.c[key]) {
					currentNode.c[key] = {
						n: name,
						...(type && fg('platform_ufo_add_type_for_3p_segments') ? { t: type } : {}),
					};
				}
				currentNode = currentNode.c[key];
			});
		});
	}

	return { r };
}

export function stringifyLabelStackFully(labelStack: LabelStack): string {
	return labelStack
		.map((l) => {
			if (isSegmentLabel(l)) {
				return `${l.name}:${l.segmentId}`;
			}
			return l.name;
		})
		.join('/');
}

export function stringifyLabelStackWithoutId(labelStack: LabelStack): string {
	return labelStack
		.map((l) => {
			if (isSegmentLabel(l)) {
				return `${l.name}:segment`;
			}
			return l.name;
		})
		.join('/');
}

function getLabelStackReference(labelStack: LabelStack): string {
	return labelStack.map((l) => (isSegmentLabel(l) ? l.segmentId : l.name)).join('/');
}

export function labelStackStartWith(labelStack: LabelStack, startWith: LabelStack) {
	return stringifyLabelStackFully(labelStack).startsWith(stringifyLabelStackFully(startWith));
}

export function optimizeLabelStack(
	labelStack: LabelStack,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
) {
	return reactUFOVersion === '2.0.0'
		? getLabelStackReference(labelStack)
		: labelStack.map((ls) => ({
				n: ls.name,
				...((ls as SegmentLabel).segmentId ? { s: (ls as SegmentLabel).segmentId } : {}),
				...((ls as SegmentLabel).type && fg('platform_ufo_add_type_for_3p_segments')
					? { t: (ls as SegmentLabel).type }
					: {}),
			}));
}

export function getOldSegmentsLabelStack(
	segments: SegmentInfo[],
	interactionType: InteractionType,
) {
	if (fg('platform_ufo_add_segments_count_threshold')) {
		const config = getConfig();
		const addSegmentsMap = new Map<string, number>();
		const segmentThreshold = config?.segmentsThreshold;
		return segments.map(({ labelStack, ...others }) => {
			const stringifiedLabelStack = stringifyLabelStackWithoutId(labelStack);
			const segmentsInfo: any[] = [];
			for (const ls of labelStack) {
				const isSegment = isSegmentLabel(ls);
				if (isSegment && segmentThreshold && segmentThreshold[ls.name]) {
					const threshold = segmentThreshold[ls.name];
					const count = addSegmentsMap.get(stringifiedLabelStack) || 0;
					if (count < threshold) {
						addSegmentsMap.set(stringifiedLabelStack, count + 1);
					} else {
						break;
					}
				}
				segmentsInfo.push({
					n: ls.name,
					...((ls as SegmentLabel).segmentId ? { s: (ls as SegmentLabel).segmentId } : {}),
					...((ls as SegmentLabel).type && fg('platform_ufo_add_type_for_3p_segments')
						? { t: (ls as SegmentLabel).type }
						: {}),
				});
			}
			return { ...others, labelStack: segmentsInfo };
		});
	}
	return segments.map(({ labelStack, ...others }) => ({
		...others,
		labelStack: optimizeLabelStack(labelStack, getReactUFOPayloadVersion(interactionType)),
	}));
}
