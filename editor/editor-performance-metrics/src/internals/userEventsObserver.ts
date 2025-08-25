import { backgroundTask } from './backgroundTasks';

export type UserEventType = {
	duration: number;
	elementRef: WeakRef<HTMLElement>;
	eventName: string;
	startTime: DOMHighResTimeStamp;
};

const ALLOWED_DURATION = 40;

export const processEntry = (entry: PerformanceEntry): UserEventType | null => {
	const {
		startTime,
		// @ts-expect-error
		processingEnd,
		// @ts-expect-error
		processingStart,
		// @ts-expect-error
		target,
		duration,
		name,
	} = entry;

	if (typeof processingEnd !== 'number' || typeof processingStart !== 'number') {
		return null;
	}

	const timeToProcessEvent = processingEnd - processingStart;
	if (timeToProcessEvent <= 0) {
		return null;
	}

	if (!(target instanceof HTMLElement)) {
		return null;
	}

	const eventProcessingDuration = processingEnd - startTime;

	if (duration <= ALLOWED_DURATION || eventProcessingDuration <= ALLOWED_DURATION) {
		return null;
	}

	return {
		eventName: name,
		startTime: startTime,
		duration,
		elementRef: new WeakRef(target),
	};
};

export const createPerformanceObserver = (cb: (list: PerformanceObserverEntryList) => void) => {
	return new PerformanceObserver(cb);
};

export type UserEventsObserverProps = {
	onEventEntries: (props: Array<UserEventType>) => void;
};

export class UserEventsObserver {
	private observer: PerformanceObserver | undefined;

	constructor({ onEventEntries }: UserEventsObserverProps) {
		if (typeof globalThis.PerformanceObserver !== 'function') {
			return;
		}
		this.observer = createPerformanceObserver((list) => {
			backgroundTask(() => {
				const mappedEvents = list.getEntries().reduce<UserEventType[]>((acc, value) => {
					const transformed = processEntry(value);

					if (transformed) {
						acc.push(transformed);
					}

					return acc;
				}, []);
				onEventEntries(mappedEvents);
			});
		});

		this.observer.observe({
			type: 'event',
			buffered: true,
			// @ts-expect-error
			durationThreshold: 16,
		});
	}

	disconnect() {
		this.observer?.disconnect();
	}
}
