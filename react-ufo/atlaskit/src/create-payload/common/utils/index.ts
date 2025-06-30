import { fg } from '@atlaskit/platform-feature-flags';

import type { LabelStack, SegmentLabel } from '../../../interaction-context';
import { UFOSegmentType } from '../../../segment/segment';
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
