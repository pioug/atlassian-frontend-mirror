import type {
	PerformanceLongAnimationFrameEvent,
	TimelineEvent,
	UserEvent,
} from '../../timelineTypes';
import type { UserEventCategory } from '../../types';
import { processTimelineEvents } from '../processTimelineEvents';

const createMockUserEvent = ({
	startTime,
	duration,
	processingStart,
	processingEnd,
	entryType,
	eventName,
}: {
	startTime: number;
	duration: number;
	processingStart: number;
	processingEnd: number;
	entryType: UserEventCategory;
	eventName: string;
}): UserEvent => ({
	type: 'user-event:mouse-movement',
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
	entryStartTime: number;
	scriptStartTime: number;
	invokerType: string;
	duration: number;
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

const defaultInputEventMock: UserEvent = createMockUserEvent({
	startTime: 143,
	duration: 50,
	processingStart: 150,
	processingEnd: 200,
	entryType: 'mouse-movement',
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

	it('should match a user event with a corresponding performance event if start time matches', () => {
		const events: TimelineEvent[] = [defaultInputEventMock, defaultPerfEventMock];
		const result = processTimelineEvents(events);

		expect(result).toEqual([
			{
				name: 'click',
				category: 'mouse-movement',
				firstInteraction: {
					duration: 100,
				},
			},
		]);
	});

	it('should match a user event with a corresponding performance event if input event is within frame', () => {
		const inputEventProcessingStart = 150;
		const inputEvent = createMockUserEvent({
			startTime: 143,
			duration: 50,
			processingStart: inputEventProcessingStart,
			processingEnd: 200,
			entryType: 'mouse-movement',
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
				category: 'mouse-movement',
				firstInteraction: {
					duration: 150,
				},
			},
		]);
	});

	it('should not match a user event with an unrelated performance event', () => {
		const events: TimelineEvent[] = [defaultInputEventMock, defaultUnrelatedPerfEventMock];
		const result = processTimelineEvents(events);

		expect(result).toEqual([]);
	});

	it('should handle multiple input/user events correctly', () => {
		const anotherUserEvent: UserEvent = createMockUserEvent({
			startTime: 143,
			duration: 50,
			processingStart: 300,
			processingEnd: 200,
			entryType: 'mouse-movement',
			eventName: 'mouseover',
		});

		const events: TimelineEvent[] = [defaultInputEventMock, anotherUserEvent, defaultPerfEventMock];
		const result = processTimelineEvents(events);

		expect(result).toEqual([
			{
				name: 'click',
				category: 'mouse-movement',
				firstInteraction: {
					duration: 100,
				},
			},
		]);
	});

	it('should return an empty array if no user events match performance events', () => {
		const events: TimelineEvent[] = [defaultUnrelatedPerfEventMock];
		const result = processTimelineEvents(events);

		expect(result).toEqual([]);
	});
});
