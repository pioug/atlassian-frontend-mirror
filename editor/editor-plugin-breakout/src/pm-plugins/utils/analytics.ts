import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type {
	BreakoutEventPayload,
	BreakoutSupportedNodes,
} from '@atlaskit/editor-common/analytics';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

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

export const generateResizedEventPayload = ({
	node,
	prevWidth,
	newWidth,
}: {
	newWidth: number;
	node: PMNode;
	prevWidth: number;
}): BreakoutEventPayload => {
	return {
		action: ACTION.RESIZED,
		actionSubject: ACTION_SUBJECT.ELEMENT,
		eventType: EVENT_TYPE.TRACK,
		attributes: {
			nodeType: node.type.name as BreakoutSupportedNodes,
			prevWidth,
			newWidth,
		},
	};
};
