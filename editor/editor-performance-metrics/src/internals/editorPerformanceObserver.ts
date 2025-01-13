/* eslint-disable compat/compat */
import { getEventCategory, searchAncestors } from './dom';
import { DOMObservers } from './DOMObservers';
import { FirstInteractionObserver } from './firstInteractionObserver';
import { getElementName, type SelectorConfig } from './getElementName';
import type { OnIdleBufferFlushCallback, TimelineClock, TimelineIdleUnsubcribe } from './timeline';
import { UserEventsObserver } from './userEventsObserver';

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

export class EditorPerformanceObserver implements ObserverInterface {
	public startTime: DOMHighResTimeStamp | null = null;

	private timeline: TimelineClock;
	private domObservers: DOMObservers;
	private firstInteraction: FirstInteractionObserver;
	private vcSections: WeakSet<Element>;
	private userEventsObserver: UserEventsObserver;
	private observedTargetRef: WeakRef<HTMLElement> | null = null;

	constructor(timeline: TimelineClock) {
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
	}

	start({ startTime }: StartProps) {
		const target = document.body;
		this.observedTargetRef = new WeakRef(target);
		this.startTime = startTime;

		this.domObservers.observe(target);
	}

	onIdleBuffer(cb: OnIdleBufferFlushCallback): TimelineIdleUnsubcribe {
		return this.timeline.onIdleBufferFlush(cb);
	}

	onceNextIdle(cb: OnIdleBufferFlushCallback): TimelineIdleUnsubcribe {
		return this.timeline.onNextIdle(cb);
	}

	stop() {
		this.domObservers.disconnect();
		this.firstInteraction.disconnect();
		this.userEventsObserver.disconnect();
	}
}
