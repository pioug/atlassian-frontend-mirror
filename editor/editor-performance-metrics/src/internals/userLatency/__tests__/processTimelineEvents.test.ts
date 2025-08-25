import type {
	PerformanceLongAnimationFrameEvent,
	TimelineEvent,
	UserEvent,
} from '../../timelineTypes';
import type { UserEventCategory } from '../../types';
import { processTimelineEvents } from '../processTimelineEvents';

const createMockInputEvent = ({
	startTime,
	duration,
	processingStart,
	processingEnd,
	entryType,
	eventName,
}: {
	duration: number;
	entryType: UserEventCategory;
	eventName: string;
	processingEnd: number;
	processingStart: number;
	startTime: number;
}): UserEvent => ({
	type: `user-event:${entryType}`,
	startTime: 0,
	data: {
		eventName,
		category: entryType as UserEventCategory,
		duration,
		elementName: 'div',
		entry: {
			processingStart,
			processingEnd,
			cancelable: true,
			target: document.createElement('div'),
			startTime,
			duration,
			name: entryType,
			entryType,
			toJSON: () => ({}),
		},
	},
});

const createMockPerfEvent = ({
	entryStartTime,
	scriptStartTime,
	invokerType,
	duration,
}: {
	duration: number;
	entryStartTime: number;
	invokerType: string;
	scriptStartTime: number;
}): PerformanceLongAnimationFrameEvent => ({
	type: 'performance:long-animation-frame',
	data: {
		entry: {
			startTime: entryStartTime,
			duration,
			// TODO: PGXT-7953 - use type `PerformanceLongAnimationFrameTiming` if possible https://product-fabric.atlassian.net/browse/PGXT-7953
			// @ts-expect-error
			scripts: [
				{
					startTime: scriptStartTime,
					invokerType,
				},
			],
		},
	},
});

const defaultInputEventMock: UserEvent = createMockInputEvent({
	startTime: 143,
	duration: 50,
	processingStart: 150,
	processingEnd: 200,
	entryType: 'mouse-action',
	eventName: 'click',
});
const defaultPerfEventMock: PerformanceLongAnimationFrameEvent = createMockPerfEvent({
	entryStartTime: 148,
	scriptStartTime: 150,
	invokerType: 'event-listener',
	duration: 50,
});
const defaultUnrelatedPerfEventMock: PerformanceLongAnimationFrameEvent = createMockPerfEvent({
	entryStartTime: 148,
	scriptStartTime: 149,
	invokerType: 'event-listener',
	duration: 50,
});

describe('processTimelineEvents', () => {
	it('should return an empty array when no events are passed', () => {
		expect(processTimelineEvents([])).toEqual([]);
	});

	it('should match a input event with a corresponding performance event if start time matches', () => {
		const events: TimelineEvent[] = [defaultInputEventMock, defaultPerfEventMock];
		const result = processTimelineEvents(events);

		expect(result).toEqual([
			{
				name: 'click',
				attribution: {
					selector: 'div',
				},
				category: 'mouse-action',
				firstInteraction: {
					duration: 100,
				},
			},
		]);
	});

	it('should match a input event with a corresponding performance event if input event is within frame', () => {
		const inputEventProcessingStart = 150;
		const inputEvent = createMockInputEvent({
			startTime: 143,
			duration: 50,
			processingStart: inputEventProcessingStart,
			processingEnd: 200,
			entryType: 'mouse-action',
			eventName: 'click',
		});
		const prefEvent = createMockPerfEvent({
			scriptStartTime: inputEventProcessingStart - 1.3,
			entryStartTime: 140,
			duration: 100,
			invokerType: 'event-listener',
		});

		const events: TimelineEvent[] = [inputEvent, prefEvent];
		const result = processTimelineEvents(events);

		expect(result).toEqual([
			{
				name: 'click',
				attribution: {
					selector: 'div',
				},
				category: 'mouse-action',
				firstInteraction: {
					duration: 150,
				},
			},
		]);
	});

	it('should not match a input event with an unrelated performance event', () => {
		const events: TimelineEvent[] = [defaultInputEventMock, defaultUnrelatedPerfEventMock];
		const result = processTimelineEvents(events);

		expect(result).toEqual([]);
	});

	it('should only match the earliest started input event in frame to the matching long animation frame event', () => {
		const anotherInputEvent: UserEvent = {
			...defaultInputEventMock,
			type: `user-event:mouse-movement`,
			startTime: defaultInputEventMock.startTime + 2,
			data: {
				...defaultInputEventMock.data,
				category: 'mouse-movement',
				eventName: 'mouseover',
				entry: {
					...defaultInputEventMock.data.entry,
					processingStart: defaultInputEventMock.data.entry!.processingStart + 2,
				} as PerformanceEventTiming,
				elementName: 'span',
			},
		};

		const events: TimelineEvent[] = [
			defaultInputEventMock,
			anotherInputEvent,
			defaultPerfEventMock,
		];
		const result = processTimelineEvents(events);

		expect(result).toEqual([
			{
				name: 'click',
				attribution: {
					selector: 'div',
				},
				category: 'mouse-action',
				firstInteraction: {
					duration: 100,
				},
			},
		]);
	});

	it('should return an empty array if no input events match performance events', () => {
		const events: TimelineEvent[] = [defaultInputEventMock, defaultUnrelatedPerfEventMock];
		const result = processTimelineEvents(events);

		expect(result).toEqual([]);
	});
});
