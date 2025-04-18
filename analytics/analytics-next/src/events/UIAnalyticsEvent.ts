/// <reference types="node" />
import AnalyticsEvent, {
	type AnalyticsEventPayload,
	type AnalyticsEventProps,
} from './AnalyticsEvent';

type ChannelIdentifier = string;
type Context = Record<string, any>[];

export type UIAnalyticsEventHandler = (
	event: UIAnalyticsEvent,
	channel?: ChannelIdentifier,
) => void;

export type UIAnalyticsEventProps = AnalyticsEventProps & {
	context?: Context;
	handlers?: UIAnalyticsEventHandler[];
};

export const isUIAnalyticsEvent = (obj: any): obj is UIAnalyticsEvent =>
	obj instanceof UIAnalyticsEvent ||
	!!obj?._isUIAnalyticsEvent ||
	// Backwards compatibility with older analytics-next packages
	obj?.constructor?.name === 'UIAnalyticsEvent';

export default class UIAnalyticsEvent extends AnalyticsEvent {
	context: Context;
	handlers: UIAnalyticsEventHandler[];
	hasFired: boolean;
	_isUIAnalyticsEvent: boolean = true;

	constructor(props: UIAnalyticsEventProps) {
		super(props);

		this.context = props.context || [];
		this.handlers = props.handlers || [];
		this.hasFired = false;
	}

	clone = (): UIAnalyticsEvent | null => {
		if (this.hasFired) {
			if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
				// eslint-disable-next-line no-console
				console.warn("Cannot clone an event after it's been fired.");
			}

			return null;
		}

		const context = [...this.context];
		const handlers = [...this.handlers];

		/**
		 * A hacky "deep clone" of the object. This is limited in that it wont
		 * support functions, regexs, Maps, Sets, etc, but none of those need to
		 * be represented in our payload.
		 */
		const payload = JSON.parse(JSON.stringify(this.payload));

		return new UIAnalyticsEvent({ context, handlers, payload });
	};

	fire = (channel?: string) => {
		if (this.hasFired) {
			if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
				// eslint-disable-next-line no-console
				console.warn('Cannot fire an event twice.');
			}

			return;
		}

		this.handlers.forEach((handler) => handler(this, channel));
		this.hasFired = true;
	};

	update(
		updater: Record<string, any> | ((payload: AnalyticsEventPayload) => AnalyticsEventPayload),
	): this {
		if (this.hasFired) {
			if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
				// eslint-disable-next-line no-console
				console.warn("Cannot update an event after it's been fired.");
			}

			return this;
		}

		return super.update(updater);
	}
}
