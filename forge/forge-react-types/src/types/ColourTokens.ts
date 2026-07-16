import type { ActiveTokens } from '@atlaskit/tokens/artifacts/types';

type ExtractChartColorTokens<T> = T extends `color.chart.${string}` ? T : never;

export type ChartColorTokens = ExtractChartColorTokens<ActiveTokens>;
