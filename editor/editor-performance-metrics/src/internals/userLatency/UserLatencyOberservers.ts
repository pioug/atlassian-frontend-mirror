import { getEventCategory } from '../dom';
import { getElementName, type SelectorConfig } from '../getElementName';
import type { TimelineClock } from '../timelineInterfaces';

import { InputEventsObserver } from './InputEventsObserver';
import type { InputEventType } from './InputEventsObserver';

type CreatePerformanceObserverProps = {
	// TODO: PGXT-7953 - use type `PerformanceLongAnimationFrameTiming` https://product-fabric.atlassian.net/browse/PGXT-7953
	onLongAnimationFrame: (startTime: DOMHighResTimeStamp, entry: PerformanceEntry) => void;
};

function createPerformanceObserver(props: CreatePerformanceObserverProps) {
	if (typeof window.PerformanceObserver !== 'function') {
		return null;
	}

	const observer = new PerformanceObserver((entries) => {
		for (const entry of entries.getEntries()) {
			if (entry.entryType === 'long-animation-frame') {
				props.onLongAnimationFrame(entry.startTime, entry.toJSON());
			}
		}
	});

	return observer;
}

/**
 *
 */
export class UserLatencyObservers {
	private static instance: UserLatencyObservers | null = null;

	private timeline!: Readonly<TimelineClock>;
	private performance!: PerformanceObserver | null;
	private inputEventsObserver!: InputEventsObserver;
	private isObserving: boolean = false;

	/**
	 *
	 * @param timeline
	 * @example
	 */
	constructor(timeline: TimelineClock) {
		if (UserLatencyObservers.instance) {
			return UserLatencyObservers.instance;
		}

		this.timeline = timeline;
		this.inputEventsObserver = new InputEventsObserver({
			onEventEntries: (entries: Array<InputEventType>) => {
				const selectorConfig: SelectorConfig = {
					id: false,
					testId: true,
					role: false,
					className: false,
					dataVC: true,
				};

				entries.forEach((event) => {
					const { elementRef, startTime, duration, eventName, entry } = event;

					let elementName = 'not found';
					const element = elementRef.deref();

					if (element) {
						elementName = getElementName(selectorConfig, element);
					}
					const eventCategory = getEventCategory(eventName);

					this.timeline.markEvent({
						type: `user-event:${eventCategory}`,
						startTime,
						data: {
							category: eventCategory,
							eventName,
							duration,
							elementName,
							entry,
						},
					});
				});
			},
		});
		this.performance = createPerformanceObserver({
			onLongAnimationFrame: (startTime: DOMHighResTimeStamp, entry: PerformanceEntry) => {
				this.timeline.markEvent({
					type: 'performance:long-animation-frame',
					startTime,
					data: {
						entry,
					},
				});
			},
		});

		UserLatencyObservers.instance = this;
	}

	/**
	 *
	 * @example
	 */
	observe() {
		if (this.isObserving) {
			return;
		}

		this.inputEventsObserver.observe();
		this.performance?.observe({ type: 'long-animation-frame', buffered: true });

		this.isObserving = true;
	}

	/**
	 *
	 * @example
	 */
	disconnect() {
		if (!this.isObserving) {
			return;
		}

		this.performance?.disconnect();
		this.inputEventsObserver.disconnect();
		this.timeline.cleanupSubscribers();

		this.isObserving = false;
	}

	/**
	 *
	 * @example
	 */
	public static resetInstance(): void {
		if (UserLatencyObservers.instance) {
			UserLatencyObservers.instance.disconnect();
			UserLatencyObservers.instance = null;
		}
	}
}
