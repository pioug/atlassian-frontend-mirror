import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { BreakoutEventPayload } from '@atlaskit/editor-common/analytics';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

type BreakoutSupportedNodes = 'layoutSection' | 'expand' | 'codeBlock';

export const generateResizeFrameRatePayloads = (props: {
	docSize: number;
	frameRateSamples: number[];
	originalNode: PMNode;
}): BreakoutEventPayload[] => {
	return props.frameRateSamples.map((frameRateSample, index) => ({
		action: ACTION.RESIZED_PERF_SAMPLING,
		actionSubject: ACTION_SUBJECT.ELEMENT,
		eventType: EVENT_TYPE.OPERATIONAL,
		attributes: {
			nodeType: props.originalNode.type.name as BreakoutSupportedNodes,
			frameRate: frameRateSample,
			nodeSize: props.originalNode.nodeSize,
			docSize: props.docSize,
			isInitialSample: index === 0,
		},
	}));
};
