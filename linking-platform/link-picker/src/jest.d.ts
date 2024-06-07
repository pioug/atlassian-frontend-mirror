export {};
declare global {
	namespace jest {
		interface Matchers<R> {
			toBeFiredWithAnalyticEventOnce(event: any, channel?: string): R;
		}
	}
}
