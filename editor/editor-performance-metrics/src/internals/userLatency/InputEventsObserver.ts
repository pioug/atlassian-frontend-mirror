import { backgroundTask } from '../backgroundTasks';

export type InputEventType = {
	duration: number;
	elementRef: WeakRef<HTMLElement>;
	entry: PerformanceEventTiming;
	eventName: string;
	startTime: DOMHighResTimeStamp;
};

const ALLOWED_DURATION = 40;

export const processEntry = (entry: PerformanceEntry): InputEventType | null => {
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
		elementRef: new WeakRef(target),
		startTime,
		duration: eventProcessingDuration,
		eventName: name,
		entry: entry.toJSON() as PerformanceEventTiming,
	};
};

export const createPerformanceObserver = (cb: (list: PerformanceObserverEntryList) => void) => {
	return new PerformanceObserver(cb);
};

export type InputEventsObserverProps = {
	onEventEntries: (props: Array<InputEventType>) => void;
};

export class InputEventsObserver {
	private observer: PerformanceObserver | undefined;

	constructor({ onEventEntries }: InputEventsObserverProps) {
		if (typeof globalThis.PerformanceObserver !== 'function') {
			return;
		}
		this.observer = createPerformanceObserver((list) => {
			backgroundTask(() => {
				const mappedEvents = list.getEntries().reduce<InputEventType[]>((acc, value) => {
					const transformed = processEntry(value);

					if (transformed) {
						acc.push(transformed);
					}

					return acc;
				}, []);
				onEventEntries(mappedEvents);
			});
		});
	}

	observe(): void {
		this.observer?.observe({
			type: 'event',
			buffered: true,
			// @ts-expect-error
			durationThreshold: 16,
		});
	}

	disconnect(): void {
		this.observer?.disconnect();
	}
}
