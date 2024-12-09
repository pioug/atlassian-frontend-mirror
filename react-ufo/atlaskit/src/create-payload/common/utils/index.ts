/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import type { InteractionMetrics } from '../../../common';
import { REACT_UFO_VERSION } from '../../../common/constants';
import { type Config, getConfig } from '../../../config';
import { getPageVisibilityState } from '../../../hidden-timing';
import type { LabelStack, SegmentLabel } from '../../../interaction-context';
import { experimentalInteractionLog, postInteractionLog } from '../../../interaction-metrics';
import * as ssr from '../../../ssr';
import { getVCObserver } from '../../../vc';

export type SegmentItem = {
	n: string;
	c?: Record<string, SegmentItem>;
};

export type SegmentTree = {
	r: SegmentItem;
};

export const sanitizeUfoName = (name: string) => {
	return name.replace(/_/g, '-');
};

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

export function optimizeLabelStack(labelStack: LabelStack) {
	return REACT_UFO_VERSION === '2.0.0'
		? getLabelStackReference(labelStack)
		: labelStack.map((ls) => ({
				n: ls.name,
				...((ls as SegmentLabel).segmentId ? { s: (ls as SegmentLabel).segmentId } : {}),
			}));
}

export const getInteractionStatus = (interaction: InteractionMetrics) => {
	const originalInteractionStatus = interaction.abortReason ? 'ABORTED' : 'SUCCEEDED';

	const hasBm3TTI = interaction.apdex.length > 0;
	const overrideStatus = hasBm3TTI ? 'SUCCEEDED' : originalInteractionStatus;

	return { originalInteractionStatus, overrideStatus } as const;
};

export const getPageVisibilityUpToTTAI = (interaction: InteractionMetrics) => {
	const { start, end } = interaction;
	return getPageVisibilityState(start, end);
};

export const calculateVCMetrics = (
	interaction: InteractionMetrics,
	prefix: string,
	getVCResultFn: (props: any) => any,
) => {
	const result = getVCResultFn({
		start: interaction.start,
		stop: interaction.end,
		tti: interaction.apdex?.[0]?.stopTime,
		prefix,
		vc: interaction.vc,
	});

	const VC = result?.['metrics:vc'] as {
		[key: string]: number | null;
	};

	if (!VC || !result?.[`${prefix}:vc:clean`]) {
		return result;
	}

	const interactionStatus = getInteractionStatus(interaction);
	const pageVisibilityUpToTTAI = getPageVisibilityUpToTTAI(interaction);

	if (
		interactionStatus.originalInteractionStatus !== 'SUCCEEDED' ||
		pageVisibilityUpToTTAI !== 'visible'
	) {
		return result;
	}

	return result;
};

export function getSSRDoneTimeValue(config: Config | undefined): number | undefined {
	return config?.ssr?.getSSRDoneTime ? config?.ssr?.getSSRDoneTime() : ssr.getSSRDoneTime();
}

export const getVCMetrics = (interaction: InteractionMetrics) => {
	const config = getConfig();
	if (!config?.vc?.enabled) {
		return {};
	}
	if (interaction.type !== 'page_load' && interaction.type !== 'transition') {
		return {};
	}

	const ssr =
		interaction.type === 'page_load' && config?.ssr ? { ssr: getSSRDoneTimeValue(config) } : null;

	postInteractionLog.setVCObserverSSRConfig(ssr);

	const result = calculateVCMetrics(interaction, 'ufo', getVCObserver().getVCResult);
	return {
		...result,
		'metric:vc90': result?.['metrics:vc']?.['90'],
	};
};

export const getExperimentalVCMetrics = (interaction: InteractionMetrics) => {
	if (experimentalInteractionLog.vcObserver) {
		const result = calculateVCMetrics(
			interaction,
			'ufo-experimental',
			experimentalInteractionLog.vcObserver.getVCResult,
		);
		return {
			...result,
			'metric:experimental:vc90': result?.['metrics:vc']?.['90'],
		};
	}
	return null;
};

export const getTTAI = (interaction: InteractionMetrics) => {
	const { start, end } = interaction;
	const interactionStatus = getInteractionStatus(interaction);
	const pageVisibilityUpToTTAI = getPageVisibilityUpToTTAI(interaction);
	return interactionStatus.originalInteractionStatus === 'SUCCEEDED' &&
		pageVisibilityUpToTTAI === 'visible'
		? Math.round(end - start)
		: undefined;
};
