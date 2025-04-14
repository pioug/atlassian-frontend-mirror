import type { InteractionMetrics } from '../common';
import { getPageVisibilityState } from '../hidden-timing';
import { withProfiling } from '../self-measurements';
import type { VCObserverOptions } from '../vc/types';
import { VCObserver } from '../vc/vc-observer';

type InteractionMetricsHandler = (
	interactionId: string,
	interaction: InteractionMetrics,
) => void | Promise<void>;

const interactionBuffer: { interactionId: string; data: InteractionMetrics }[] = [];

let bufferInteractionData: (interactionId: string, data: InteractionMetrics) => void =
	withProfiling(function bufferInteractionData(interactionId, data) {
		interactionBuffer.push({ interactionId, data });
	});

const clearInteractionBuffer = withProfiling(function clearInteractionBuffer() {
	interactionBuffer.length = 0;
});

const appendInteractionData = withProfiling(function appendInteractionData(
	interactionId: string,
	data: InteractionMetrics,
) {
	bufferInteractionData(interactionId, data);
});

export const installInteractionSink = withProfiling(function installInteractionSink(
	handler: InteractionMetricsHandler,
) {
	for (const { interactionId, data } of interactionBuffer) {
		handler(interactionId, data);
	}
	clearInteractionBuffer();

	bufferInteractionData = withProfiling(handler);
});

export const sinkExperimentalHandler = withProfiling(function sinkExperimentalHandler(
	sinkFn: (interactionId: string, interaction: InteractionMetrics) => void | Promise<void>,
) {
	installInteractionSink(sinkFn);
});

export const onExperimentalInteractionComplete = withProfiling(
	function onExperimentalInteractionComplete(
		interactionId: string,
		data: InteractionMetrics,
		endTime = performance.now(),
	) {
		if (data.ufoName) {
			data.end = endTime;
			appendInteractionData(interactionId, data);
			clearInteractionBuffer();
		}
	},
);

export class ExperimentalVCMetrics {
	vcObserver: VCObserver | null = null;

	constructor() {
		this.initialize = withProfiling(this.initialize.bind(this));
		this.start = withProfiling(this.start.bind(this));
	}

	initialize(options: VCObserverOptions) {
		if (this.vcObserver === null) {
			this.vcObserver = new VCObserver({ ...options, isPostInteraction: true });
		}
		return this;
	}

	start({ startTime }: { startTime: number }) {
		this.vcObserver?.start({ startTime });
	}
}

export const experimentalVC = new ExperimentalVCMetrics();

export const getExperimentalVCMetrics = withProfiling(async function getExperimentalVCMetrics(
	interaction: InteractionMetrics,
) {
	if (experimentalVC.vcObserver) {
		const prefix = 'ufo-experimental';

		const result = await experimentalVC.vcObserver.getVCResult({
			start: interaction.start,
			stop: interaction.end,
			tti: interaction.apdex?.[0]?.stopTime,
			isEventAborted: !!interaction.abortReason,
			prefix,
			vc: interaction.vc,
		});

		const VC = result?.['metrics:vc'] as {
			[key: string]: number | null;
		};

		if (!VC || !result?.[`${prefix}:vc:clean`]) {
			return result;
		}

		const pageVisibilityUpToTTAI = getPageVisibilityState(interaction.start, interaction.end);

		if (interaction.abortReason || pageVisibilityUpToTTAI !== 'visible') {
			return result;
		}

		return {
			...result,
			'metric:experimental:vc90': VC['90'],
		};
	}
	return null;
});
