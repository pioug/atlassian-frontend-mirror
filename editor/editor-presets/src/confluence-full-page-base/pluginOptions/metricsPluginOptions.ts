import type { MetricsPluginOptions } from '@atlaskit/editor-plugin-metrics/metrics-plugin-type';

interface Props {
	options: MetricsPluginOptions | undefined;
}

export function metricsPluginOptions({ options }: Props): MetricsPluginOptions | undefined {
	return options;
}
