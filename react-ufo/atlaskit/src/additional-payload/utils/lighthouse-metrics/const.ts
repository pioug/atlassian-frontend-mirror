// oxlint-disable-next-line eslint/no-redeclare
export const PerformanceObserverEntryTypes = {
	LayoutShift: 'layout-shift',
	LongTask: 'longtask',
} as const;
export type PerformanceObserverEntryTypes =
	(typeof PerformanceObserverEntryTypes)[keyof typeof PerformanceObserverEntryTypes];
