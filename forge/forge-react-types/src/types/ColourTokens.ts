import type { ActiveTokens } from '@atlaskit/tokens';

type ExtractChartColorTokens<T> = T extends `color.chart.${string}` ? T : never;

export type ChartColorTokens = ExtractChartColorTokens<ActiveTokens>;
