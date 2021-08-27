export type AnalyticsEventPayload = Record<string, any>;

type AnalyticsEventCallback = (
  payload: AnalyticsEventPayload,
) => AnalyticsEventPayload;

type AnalyticsEventUpdater = AnalyticsEventPayload | AnalyticsEventCallback;

export type AnalyticsEventProps = {
  payload: AnalyticsEventPayload;
};

export const isAnalyticsEvent = (obj: any) =>
  obj instanceof AnalyticsEvent ||
  !!obj?._isAnalyticsEvent ||
  // Backwards compatibility with older analytics-next packages
  obj?.constructor?.name === 'AnalyticsEvent';

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
