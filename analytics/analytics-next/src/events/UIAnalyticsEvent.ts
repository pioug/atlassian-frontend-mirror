/// <reference types="node" />
import { fg } from '@atlaskit/platform-feature-flags';

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

/**
 * Produces a deep clone of an event payload.
 *
 * The historic implementation relied on `JSON.parse(JSON.stringify(...))`, a
 * "hacky" deep clone that does not support functions, regexs, Maps, Sets, etc.
 * Crucially, `JSON.stringify` also throws `TypeError: Converting circular
 * structure to JSON` when the payload contains a value with circular
 * references — e.g. a live DOM node carrying React fiber back-references
 * (`__reactFiber$...`). When that throw happens during a React render/commit it
 * escapes into product UI and trips an error boundary (HOT-127428).
 *
 * Analytics must never crash product UI (the same contract `fire` upholds), so
 * behind the `platform-analytics-next-safe-clone` gate we wrap the
 * serialization in a try/catch and fall back to a shallow clone — matching the
 * base `AnalyticsEvent.clone` behaviour — if the deep clone fails.
 *
 * NOTE: this is intentionally a module-scoped function rather than a class
 * member so it does not change the structural type of `UIAnalyticsEvent`, which
 * is hand-mocked across the monorepo.
 */
const clonePayload = (payload: AnalyticsEventPayload): AnalyticsEventPayload => {
	if (fg('platform-analytics-next-safe-clone')) {
		try {
			return JSON.parse(JSON.stringify(payload));
		} catch (e) {
			if (process.env.NODE_ENV !== 'production') {
				// eslint-disable-next-line no-console
				console.error(
					'[analytics-next] UIAnalyticsEvent payload could not be deep cloned; falling back to a shallow clone:',
					e,
				);
			}

			// Shallow clone keeps the event usable without crashing the UI.
			return { ...payload };
		}
	}

	/**
	 * A hacky "deep clone" of the object. This is limited in that it wont
	 * support functions, regexs, Maps, Sets, etc, but none of those need to
	 * be represented in our payload.
	 */
	return JSON.parse(JSON.stringify(payload));
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
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

		const payload = clonePayload(this.payload);

		return new UIAnalyticsEvent({ context, handlers, payload });
	};

	fire = (channel?: string): void => {
		if (this.hasFired) {
			if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
				// eslint-disable-next-line no-console
				console.warn('Cannot fire an event twice.');
			}

			return;
		}

		this.handlers.forEach((handler) => {
			try {
				handler(this, channel);
			} catch (e) {
				// Analytics must never crash product UI. Swallow handler errors in
				// production; surface them in development so misconfigured events are
				// caught early.
				if (process.env.NODE_ENV !== 'production') {
					// eslint-disable-next-line no-console
					console.error('[analytics-next] UIAnalyticsEvent handler threw an error:', e);
				}
			}
		});
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
