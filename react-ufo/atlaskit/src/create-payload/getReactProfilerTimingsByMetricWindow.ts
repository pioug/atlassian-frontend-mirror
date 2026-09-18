import type { InteractionMetrics } from '../common';
import { type LabelStackRegistry } from './common/utils/label-stack-registry';
import { getReactProfilerTimingsForWindow } from './getReactProfilerTimingsForWindow';
import { type getReactUFOPayloadVersion } from './utils/get-react-ufo-payload-version';
import { optimizeReactProfilerTimings } from './utils/optimize-react-profiler-timings';

export function getReactProfilerTimingsByMetricWindow(
	interaction: InteractionMetrics,
	reactUFOVersion: ReturnType<typeof getReactUFOPayloadVersion>,
	registry?: LabelStackRegistry,
): any {
	if (!interaction.metricWindows) {
		return {};
	}

	const entries = Object.entries(interaction.metricWindows)
		.filter(([name]) => name !== 'standard')
		.map(([name, window]) => [
			name,
			optimizeReactProfilerTimings(
				getReactProfilerTimingsForWindow(interaction.reactProfilerTimings, window),
				interaction.start,
				reactUFOVersion,
				registry,
			),
		]);

	if (entries.length === 0) {
		return {};
	}

	return {
		reactProfilerTimingsByMetricWindow: Object.fromEntries(entries),
	};
}
