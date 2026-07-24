// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import type { SerializedStyles } from '@emotion/react';

import { getSerializedStylesMap } from './get-serialized-styles-map';
import { type MetricTextSize, metricTextSizeMap } from './metric-text-size';

export const metricTextSizeStylesMap: Record<MetricTextSize, SerializedStyles> =
	getSerializedStylesMap('font', metricTextSizeMap);
