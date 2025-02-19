/* eslint-disable compat/compat */
import { getEventCategory, searchAncestors } from './dom';
import { DOMObservers } from './DOMObservers';
import { FirstInteractionObserver } from './firstInteractionObserver';
import { getElementName, type SelectorConfig } from './getElementName';
import type {
	OnIdleBufferFlushCallback,
	TimelineClock,
	TimelineIdleUnsubcribe,
	TimelineHoldable,
} from './timelineInterfaces';
import { UserEventsObserver } from './userEventsObserver';
import { wrapperFetch } from './wrapperFetch';
import { wrapperTimers } from './wrapperTimers';

export type StartProps = {
	startTime: DOMHighResTimeStamp;
};
export interface ObserverInterface {
	start(props: StartProps): void;
}
export type CalculateVCOptions = {
	ignoreNodeReplacements: boolean;
	ignoreLayoutShifts: boolean;
	ignoreElementMoved: boolean;
	heatmapSize: number;
};

export type EditorPerformanceObserverOptions = {
	/*
	 * Control how the timers are being wrapped
	 *
	 */
	timers: {
		/**
		 * Special options for wrapper around the setTimeout
		 */
		setTimeout: {
			/*
			 * Control what kind of timeouts should trigger `Timeline.holds`
			 * based on the delay parameter (default: two seconds);
			 */
			maxTimeoutAllowedToTrack: number;
		};
	};
};

const defaultOptions: EditorPerformanceObserverOptions = {
	timers: {
		setTimeout: {
			maxTimeoutAllowedToTrack: 2000, // two seconds
		},
	},
};

export class EditorPerformanceObserver implements ObserverInterface {
	public startTime: DOMHighResTimeStamp | null = null;

	private isStarted: boolean = false;
	private timeline: TimelineClock & TimelineHoldable;
	private domObservers: DOMObservers;
	private firstInteraction: FirstInteractionObserver;
	private vcSections: WeakSet<Element>;
	private userEventsObserver: UserEventsObserver;
	private observedTargetRef: WeakRef<HTMLElement> | null = null;
	private wrapperApplied: boolean = false;
	private wrapperCleanupFunctions: (() => void)[] = [];
	private options: EditorPerformanceObserverOptions;

	constructor(
		timeline: TimelineClock & TimelineHoldable,
		givenOptions?: Partial<EditorPerformanceObserverOptions>,
	) {
		this.options = Object.assign(defaultOptions, givenOptions || {});
		this.timeline = timeline;
		this.vcSections = new WeakSet();
		// TODO: make sure to get it from config
		const selectorConfig: SelectorConfig = {
			id: false,
			testId: true,
			role: false,
			className: false,
			dataVC: true,
		};

		this.userEventsObserver = new UserEventsObserver({
			onEventEntries: (entries) => {
				entries.forEach((event) => {
					let elementName = 'not found';
					const element = event.elementRef.deref();

					if (element) {
						elementName = getElementName(selectorConfig, element);
					}
					const eventCategory = getEventCategory(event.eventName);

					timeline.markEvent({
						type: `user-event:${eventCategory}`,
						startTime: event.startTime,
						data: {
							category: eventCategory,
							eventName: event.eventName,
							duration: event.duration,
							elementName,
						},
					});
				});
			},
		});
		this.firstInteraction = new FirstInteractionObserver(({ event, time }) => {
			this.timeline.markEvent({
				type: 'abort:user-interaction',
				startTime: time,
				data: {
					source: event,
				},
			});
		});

		this.domObservers = new DOMObservers({
			timeline: this.timeline,
			onChange: ({ startTime, elementRef, visible, rect, previousRect, source }) => {
				if (!visible) {
					// TODO: when element is not visible we probably wants to add something
					return;
				}

				const element = elementRef.deref();
				if (!element) {
					return;
				}
				const elementName = getElementName(selectorConfig, element);
				const observedTarget = this.observedTargetRef?.deref();

				const wrapperSection = searchAncestors(element, (e: HTMLElement) => {
					const hasSection = this.vcSections.has(e);

					if (hasSection) {
						return 'found';
					}

					const isRootElement = e.parentElement === observedTarget;
					if (isRootElement) {
						return 'abort';
					}

					return 'continue';
				});

				if (!wrapperSection && element) {
					this.vcSections.add(element);
				}

				const wrapperSectionName = getElementName(selectorConfig, wrapperSection || element);

				this.timeline.markEvent({
					type: 'element:changed',
					startTime,
					data: {
						wrapperSectionName,
						elementName,
						rect,
						previousRect,
						source,
					},
				});
			},
			onDOMContentChange: ({ targetRef }) => {
				const mutationTarget = targetRef.deref();
				if (!mutationTarget) {
					return;
				}

				const observedTarget = this.observedTargetRef?.deref();
				const isRootChange = mutationTarget.parentElement === observedTarget;

				if (!isRootChange) {
					this.vcSections.add(mutationTarget);
				}
			},
		});

		this.timeline.onceAllSubscribersCleaned(() => {
			this.cleanupWrappers();
		});
	}

	start({ startTime }: StartProps) {
		if (this.isStarted) {
			return;
		}
		const target = document.body;
		this.observedTargetRef = new WeakRef(target);
		this.startTime = startTime;

		this.domObservers.observe(target);
		this.isStarted = true;
	}

	onIdleBuffer(cb: OnIdleBufferFlushCallback): TimelineIdleUnsubcribe {
		this.applyWrappersOnce();
		return this.timeline.onIdleBufferFlush(cb);
	}

	onceNextIdle(cb: OnIdleBufferFlushCallback): TimelineIdleUnsubcribe {
		this.applyWrappersOnce();
		return this.timeline.onNextIdle(cb);
	}

	stop() {
		if (!this.isStarted) {
			return;
		}

		this.isStarted = false;
		this.domObservers.disconnect();
		this.firstInteraction.disconnect();
		this.userEventsObserver.disconnect();
		this.cleanupWrappers();
		this.timeline.cleanupSubscribers();
	}

	private applyWrappersOnce() {
		if (this.wrapperApplied) {
			return;
		}

		const timersCleanup = wrapperTimers({
			globalContext: globalThis || window,
			timelineHoldable: this.timeline,
			maxTimeoutAllowed: this.options.timers.setTimeout.maxTimeoutAllowedToTrack,
		});

		const fetchCleanup = wrapperFetch({
			globalContext: globalThis || window,
			timelineHoldable: this.timeline,
		});

		this.wrapperCleanupFunctions.push(timersCleanup, fetchCleanup);
		this.wrapperApplied = true;
	}

	private cleanupWrappers() {
		this.wrapperCleanupFunctions.forEach((cleanup) => cleanup());
		this.wrapperCleanupFunctions = [];
		this.wrapperApplied = false;
	}
}
