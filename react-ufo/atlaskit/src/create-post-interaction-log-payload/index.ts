import coinflip from '../coinflip';
import { type PostInteractionLogOutput, type ReactProfilerTiming } from '../common';
import { getReactUFOVersion } from '../common/constants';
import { type VCEntryType } from '../common/vc/types';
import { getConfig, getPostInteractionRate } from '../config';
import { isSegmentLabel, sanitizeUfoName } from '../create-payload/common/utils';
import { getPageVisibilityState } from '../hidden-timing';
import { type LabelStack } from '../interaction-context';

function getParentStack(labelStack: LabelStack | null | undefined) {
	if (!labelStack || labelStack.length <= 1) {
		return null;
	}
	return labelStack.slice(0, labelStack.length - 1);
}

function getSegmentId(labelStack: LabelStack | null | undefined) {
	if (!labelStack) {
		return null;
	}
	const leafLabelStack = labelStack[labelStack.length - 1];
	if (isSegmentLabel(leafLabelStack)) {
		return leafLabelStack.segmentId;
	}
	const parentStack = getParentStack(labelStack);
	if (!parentStack) {
		return null;
	}
	return getSegmentId(parentStack);
}

function getParentSegmentId(labelStack: LabelStack) {
	return getSegmentId(getParentStack(labelStack));
}

/**
 * Whenever a render happen, all parent segment have timing reported
 * This method tries to reduce that noise
 */
function removeCascadingParentTimingReport(reactProfilerTimings: ReactProfilerTiming[]) {
	const timingIndex = new Map<string, ReactProfilerTiming[]>();
	reactProfilerTimings.forEach((timing) => {
		const segmentId = getSegmentId(timing.labelStack);
		if (segmentId) {
			const timingArray = timingIndex.get(segmentId) ?? [];
			timingIndex.set(segmentId, timingArray);
			timingArray.push(timing);
		}
	});

	reactProfilerTimings.forEach((timing) => {
		const parentSegmentId = getParentSegmentId(timing.labelStack);

		if (parentSegmentId) {
			const parentTimings = timingIndex.get(parentSegmentId);

			const filteredParentTimings = parentTimings?.filter((parentTiming) => {
				return !(
					parentTiming.startTime === timing.startTime &&
					parentTiming.actualDuration === timing.actualDuration
				);
			});
			if (filteredParentTimings) {
				timingIndex.set(parentSegmentId, filteredParentTimings);
			} else {
				timingIndex.delete(parentSegmentId);
			}
		}
	});

	return [...timingIndex.values()].flatMap((v) => v);
}

function transformReactProfilerTimings(
	reactProfilerTimings: ReactProfilerTiming[] | null | undefined,
) {
	const filtered = removeCascadingParentTimingReport(reactProfilerTimings ?? []);

	const reactProfilerTimingsMap = filtered.reduce(
		(result, { labelStack, startTime, commitTime, actualDuration, type }) => {
			if (labelStack && type !== 'nested-update') {
				const label = labelStack.map((ls) => ls.name).join('/');
				const start = Math.round(startTime);
				const end = Math.round(commitTime);

				const timing = result.get(label) || {
					labelStack: label,
					startTime: start,
					endTime: end,
					mountCount: 0,
					rerenderCount: 1,
					renderDuration: 0,
				};

				if (start < timing.startTime) {
					timing.startTime = Math.round(start);
				}
				if (end > timing.endTime) {
					timing.endTime = Math.round(end);
				}
				if (type === 'mount') {
					timing.mountCount += 1;
				}
				if (type === 'update') {
					timing.rerenderCount += 1;
				}
				timing.renderDuration += Math.round(actualDuration);

				result.set(label, timing);
			}

			return result;
		},
		new Map(),
	);

	return [...reactProfilerTimingsMap.values()];
}

export default function createPostInteractionLogPayload({
	lastInteractionFinish,
	reactProfilerTimings,
	lastInteractionFinishVCResult,
	postInteractionFinishVCResult,
}: PostInteractionLogOutput) {
	const config = getConfig();

	if (!config) {
		throw Error('UFO Configuration not provided');
	}

	const ufoName = sanitizeUfoName(lastInteractionFinish.ufoName);
	const rate = getPostInteractionRate(ufoName, lastInteractionFinish.type);

	if (!coinflip(rate)) {
		return null;
	}

	const pageVisibilityState = getPageVisibilityState(
		lastInteractionFinish.start,
		lastInteractionFinish.end,
	);

	if (pageVisibilityState !== 'visible') {
		return null;
	}

	const maxEndTimeFromProfiler = reactProfilerTimings
		? Math.max(...reactProfilerTimings.map((t) => t.commitTime))
		: lastInteractionFinish.end;

	const revisedEndTime = Math.round(maxEndTimeFromProfiler);
	const revisedTtai = Math.round(maxEndTimeFromProfiler - lastInteractionFinish.start);

	const lastInteractionFinishStart = Math.round(lastInteractionFinish.start);
	const lastInteractionFinishEnd = Math.round(lastInteractionFinish.end);
	const lastInteractionFinishTTAI = Math.round(
		lastInteractionFinish.end - lastInteractionFinish.start,
	);

	let lastInteractionFinishVC90: number | null = null;
	let lastInteractionFinishVCClean: boolean = false;
	if (lastInteractionFinishVCResult?.['ufo:vc:state']) {
		lastInteractionFinishVCClean = true;
		const lastInteractionFinishVCMetrics = lastInteractionFinishVCResult?.['metrics:vc'] as Record<
			number,
			number
		>;
		lastInteractionFinishVC90 = lastInteractionFinishVCMetrics[90] ?? null;
	}

	let postInteractionFinishVCRatios: Record<string, number> = {};
	let revisedVC90: number | null = null;
	let postInteractionFinishVCUpdates: VCEntryType[] = [];
	let postInteractionFinishVCClean: boolean = false;
	if (postInteractionFinishVCResult?.['ufo:vc:state']) {
		postInteractionFinishVCClean = true;
		postInteractionFinishVCRatios = postInteractionFinishVCResult?.['ufo:vc:ratios'] as Record<
			string,
			number
		>;

		postInteractionFinishVCUpdates = postInteractionFinishVCResult?.[
			'ufo:vc:updates'
		] as VCEntryType[];

		const postInteractionFinishVCMetrics = postInteractionFinishVCResult?.['metrics:vc'] as Record<
			number,
			number
		>;
		if (typeof lastInteractionFinishVC90 === 'number') {
			revisedVC90 = postInteractionFinishVCMetrics[90] ?? null;
		}
	}

	const lateMutations = postInteractionFinishVCUpdates
		.filter((entry) => entry.time > lastInteractionFinish.end)
		.flatMap(({ time, elements }) =>
			Array.from(new Set(elements)).map((element) => ({
				time,
				element,
				viewportHeatmapPercentage: postInteractionFinishVCRatios[element],
			})),
		);

	return {
		actionSubject: 'experience',
		action: 'measured',
		eventType: 'operational',
		source: 'measured',
		tags: ['observability'],
		attributes: {
			properties: {
				// basic
				'event:hostname': window.location?.hostname || 'unknown',
				'event:product': config.product,
				'event:schema': '1.0.0',
				'event:source': {
					name: 'react-ufo/web',
					version: getReactUFOVersion(lastInteractionFinish.type),
					payloadSource: 'platform',
				},
				'event:region': config.region || 'unknown',
				'experience:key': 'custom.post-interaction-logs',
				postInteractionLog: {
					lastInteractionFinish: {
						...lastInteractionFinish,
						ufoName,
						start: lastInteractionFinishStart,
						end: lastInteractionFinishEnd,
						ttai: lastInteractionFinishTTAI,
						vc90: lastInteractionFinishVC90,
						vcClean: lastInteractionFinishVCClean,
					},
					revisedEndTime,
					revisedTtai,
					revisedVC90,
					vcClean: postInteractionFinishVCClean,
					lateMutations,
					reactProfilerTimings: transformReactProfilerTimings(reactProfilerTimings),
				},
			},
		},
	};
}
