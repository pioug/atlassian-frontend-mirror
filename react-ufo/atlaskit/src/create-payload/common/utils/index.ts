import { getReactUFOVersion } from '../../../common/constants';
import type { LabelStack, SegmentLabel } from '../../../interaction-context';
import { withProfiling } from '../../../self-measurements';

export type SegmentItem = {
	n: string;
	c?: Record<string, SegmentItem>;
};

export type SegmentTree = {
	r: SegmentItem;
};

export const sanitizeUfoName = withProfiling(function sanitizeUfoName(name: string) {
	return name.replace(/_/g, '-');
});

export const isSegmentLabel = withProfiling(function isSegmentLabel(obj: any): obj is SegmentLabel {
	return obj && typeof obj.name === 'string' && typeof obj.segmentId === 'string';
});

export const buildSegmentTree = withProfiling(function buildSegmentTree(
	labelStacks: LabelStack[],
): SegmentTree {
	const r: SegmentItem = { n: 'segment-tree-root', c: {} };
	labelStacks.forEach((labelStack) => {
		let currentNode = r;
		labelStack.forEach((label) => {
			const name = label.name;
			const id = isSegmentLabel(label) ? label.segmentId : undefined;
			const key = id !== undefined ? id : name;
			if (!currentNode.c) {
				currentNode.c = {};
			}
			if (!currentNode.c[key]) {
				currentNode.c[key] = { n: name };
			}
			currentNode = currentNode.c[key];
		});
	});
	return { r };
});

export const stringifyLabelStackFully = withProfiling(function stringifyLabelStackFully(
	labelStack: LabelStack,
): string {
	return labelStack
		.map((l) => {
			if (isSegmentLabel(l)) {
				return `${l.name}:${l.segmentId}`;
			}
			return l.name;
		})
		.join('/');
});

const getLabelStackReference = withProfiling(function getLabelStackReference(
	labelStack: LabelStack,
): string {
	return labelStack.map((l) => (isSegmentLabel(l) ? l.segmentId : l.name)).join('/');
});

export const labelStackStartWith = withProfiling(function labelStackStartWith(
	labelStack: LabelStack,
	startWith: LabelStack,
) {
	return stringifyLabelStackFully(labelStack).startsWith(stringifyLabelStackFully(startWith));
});

export const optimizeLabelStack = withProfiling(function optimizeLabelStack(
	labelStack: LabelStack,
	reactUFOVersion: ReturnType<typeof getReactUFOVersion>,
) {
	return reactUFOVersion === '2.0.0'
		? getLabelStackReference(labelStack)
		: labelStack.map((ls) => ({
				n: ls.name,
				...((ls as SegmentLabel).segmentId ? { s: (ls as SegmentLabel).segmentId } : {}),
			}));
});
