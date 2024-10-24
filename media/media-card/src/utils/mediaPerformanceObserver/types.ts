/**
 * `ExperimentalPerformanceResourceTiming` type accounts for the experimental value `firstInterimResponseStart`
 * which is present in Chrome, but not present in FireFox or Safari.
 * Read more: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/firstInterimResponseStart
 */
export interface ExperimentalPerformanceResourceTiming extends PerformanceResourceTiming {
	firstInterimResponseStart?: number;
}
