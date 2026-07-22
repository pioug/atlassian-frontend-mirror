export default class AnalyticsEvent {
	payload: AnalyticsEventPayload;
	_isAnalyticsEvent: boolean = true;

	constructor(props: AnalyticsEventProps) {
		this.payload = props.payload;
	}

	clone = (): AnalyticsEvent | null => {
		// just a shallow clone, don't change sub refs unless you want to
		// affect the original's too
		const payload = { ...this.payload };

		return new AnalyticsEvent({ payload });
	};

	update(updater: AnalyticsEventUpdater): this {
		if (typeof updater === 'function') {
			this.payload = (updater as AnalyticsEventCallback)(this.payload);
		}

		if (typeof updater === 'object') {
			this.payload = {
				...this.payload,
				...updater,
			};
		}

		return this;
	}
}

type AnalyticsEventCallback = (payload: AnalyticsEventPayload) => AnalyticsEventPayload;
type AnalyticsEventUpdater = AnalyticsEventPayload | AnalyticsEventCallback;
export type AnalyticsEventPayload = Record<string, any>;
export type AnalyticsEventProps = {
	payload: AnalyticsEventPayload;
};
