/* eslint-disable compat/compat */
import {
	type ElementChangedEvent,
	type PerformanceFirstPaintEvent,
	TimelineController,
	type TimelineEvent,
	OnIdleBufferFlushCallback,
} from './timeline';

const addFakeEvents = (timeline: TimelineController, amount: number) => {
	new Array(amount).fill(null).forEach((_, index) => {
		const event: ElementChangedEvent = {
			type: 'element:changed',
			startTime: performance.now() + index,
			data: {
				wrapperSectionName: 'section',
				elementName: `element${index}`,
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		};

		timeline.markEvent(event);
	});
};

describe('TimelineController', () => {
	let timeline: TimelineController;

	beforeEach(() => {
		timeline = new TimelineController({
			buffer: null,
		});
		jest.useFakeTimers({
			doNotFake: ['performance'],
		});
		global.requestIdleCallback = jest.fn().mockImplementation((callback) => {
			return setTimeout(callback, 0);
		});
		global.cancelIdleCallback = jest.fn().mockImplementation((id) => {
			clearTimeout(id);
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should add an event with markEvent', () => {
		const startTime = performance.now();
		const event: ElementChangedEvent = {
			type: 'element:changed',
			startTime,
			data: {
				wrapperSectionName: 'section',
				elementName: 'element',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		};

		timeline.markEvent(event);

		expect(timeline.unorderedEvents).toContainEqual(event);
	});

	it('should return sorted events with getEvents', () => {
		const now = performance.now();
		const event1: ElementChangedEvent = {
			type: 'element:changed',
			startTime: now + 10,
			data: {
				wrapperSectionName: 'section',
				elementName: 'element1',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		};
		const event2: ElementChangedEvent = {
			type: 'element:changed',
			startTime: now + 5,
			data: {
				wrapperSectionName: 'section',
				elementName: 'element2',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		};

		timeline.markEvent(event1);
		timeline.markEvent(event2);

		const sortedEvents = timeline.getEvents();
		expect(sortedEvents).toEqual([event2, event1]);
	});

	it('should mark idle time using requestIdleCallback', () => {
		const event: ElementChangedEvent = {
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section',
				elementName: 'element',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		};

		timeline.markEvent(event);

		expect(global.requestIdleCallback).toHaveBeenCalledTimes(1);

		jest.runAllTimers();

		expect(timeline.unorderedEvents).toHaveLength(2);
		expect(timeline.unorderedEvents[1]).toEqual({
			startTime: expect.any(Number),
			type: 'idle-time',
			data: {
				duration: expect.any(Number),
			},
		});
	});

	it('should cancel previous idle callback', () => {
		const event: ElementChangedEvent = {
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section',
				elementName: 'element',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		};

		timeline.markEvent(event);
		timeline.markEvent(event);

		expect(global.cancelIdleCallback).toHaveBeenCalled();
		expect(global.requestIdleCallback).toHaveBeenCalledTimes(2);
	});

	describe('onIdleBufferFlush', () => {
		it('should call onIdleBufferFlush callback when idle time is detected', () => {
			const mockCallback = jest.fn();

			timeline.onIdleBufferFlush(mockCallback);

			timeline.markEvent({
				type: 'element:changed',
				startTime: performance.now(),
				data: {
					wrapperSectionName: 'section',
					elementName: 'element',
					rect: new DOMRect(0, 0, 100, 100),
					previousRect: undefined,
					source: 'mutation',
				},
			});

			jest.runAllTimers();

			expect(mockCallback).toHaveBeenCalledTimes(1);

			const callbackArgs = mockCallback.mock.calls[0][0];
			expect(callbackArgs).toHaveProperty('idleAt');
			expect(callbackArgs).toHaveProperty('timelineBuffer');
			expect(callbackArgs.timelineBuffer).toEqual({
				getEvents: expect.any(Function),
				getEventsPerType: expect.any(Function),
			});
		});

		it('should allow multiple callbacks to be registered', () => {
			const mockCallback1 = jest.fn();
			const mockCallback2 = jest.fn();

			timeline.onIdleBufferFlush(mockCallback1);
			timeline.onIdleBufferFlush(mockCallback2);

			timeline.markEvent({
				type: 'element:changed',
				startTime: performance.now(),
				data: {
					wrapperSectionName: 'section',
					elementName: 'element',
					rect: new DOMRect(0, 0, 100, 100),
					previousRect: undefined,
					source: 'mutation',
				},
			});

			jest.runAllTimers();

			expect(mockCallback1).toHaveBeenCalledTimes(1);
			expect(mockCallback2).toHaveBeenCalledTimes(1);
		});

		it('should call onIdleBufferFlush callback for every idle times', () => {
			const mockCallback = jest.fn();

			timeline.onIdleBufferFlush(mockCallback);

			const event: TimelineEvent = {
				type: 'element:changed',
				startTime: performance.now(),
				data: {
					wrapperSectionName: 'section',
					elementName: 'element',
					rect: new DOMRect(0, 0, 100, 100),
					previousRect: undefined,
					source: 'mutation',
				},
			};

			timeline.markEvent(event);

			jest.runAllTimers();

			timeline.markEvent(event);

			jest.runAllTimers();

			expect(mockCallback).toHaveBeenCalledTimes(2);
		});

		describe('when there is no new events', () => {
			it('should not call onIdleBufferFlush ', () => {
				const mockCallback = jest.fn();

				timeline.onIdleBufferFlush(mockCallback);

				const event: TimelineEvent = {
					type: 'element:changed',
					startTime: performance.now(),
					data: {
						wrapperSectionName: 'section',
						elementName: 'element',
						rect: new DOMRect(0, 0, 100, 100),
						previousRect: undefined,
						source: 'mutation',
					},
				};

				timeline.markEvent(event);

				jest.runAllTimers();

				expect(mockCallback).toHaveBeenCalledTimes(1);

				jest.runAllTimers();
				jest.runAllTimers();
				jest.runAllTimers();

				expect(mockCallback).toHaveBeenCalledTimes(1);
			});
		});

		it('should provide a timeline buffer with only the events since last idle', () => {
			const mockCallback = jest.fn();
			timeline.onIdleBufferFlush(mockCallback);

			const event1: ElementChangedEvent = {
				type: 'element:changed',
				startTime: performance.now(),
				data: {
					wrapperSectionName: 'section',
					elementName: 'element1',
					rect: new DOMRect(0, 0, 100, 100),
					previousRect: undefined,
					source: 'mutation',
				},
			};

			const event2: ElementChangedEvent = {
				type: 'element:changed',
				startTime: performance.now() + 10,
				data: {
					wrapperSectionName: 'section',
					elementName: 'element2',
					rect: new DOMRect(0, 0, 100, 100),
					previousRect: undefined,
					source: 'mutation',
				},
			};

			// Mark first event and simulate idle
			timeline.markEvent(event1);
			jest.runAllTimers();

			// Mark second event and simulate idle
			timeline.markEvent(event2);
			jest.runAllTimers();

			// Check callback for second idle
			expect(mockCallback).toHaveBeenCalledTimes(2);
			const lastCallArgs = mockCallback.mock.calls[1][0];
			const eventsInBuffer = lastCallArgs.timelineBuffer.getEvents();

			expect(eventsInBuffer).toEqual([
				expect.objectContaining({
					data: {
						duration: expect.any(Number),
					},
					startTime: expect.any(Number),
					type: 'idle-time',
				}),
				event2,
			]);
		});

		it('should add all events to the idleBuffer', () => {
			const event1: ElementChangedEvent = {
				type: 'element:changed',
				startTime: performance.now(),
				data: {
					wrapperSectionName: 'section',
					elementName: 'element1',
					rect: new DOMRect(0, 0, 100, 100),
					previousRect: undefined,
					source: 'mutation',
				},
			};

			const event2: ElementChangedEvent = {
				type: 'element:changed',
				startTime: performance.now() + 10,
				data: {
					wrapperSectionName: 'section',
					elementName: 'element2',
					rect: new DOMRect(0, 0, 100, 100),
					previousRect: undefined,
					source: 'mutation',
				},
			};

			timeline.markEvent(event1);
			timeline.markEvent(event2);

			expect(timeline.idleBuffer.unorderedEvents).toContain(event1);
			expect(timeline.idleBuffer.unorderedEvents).toContain(event2);
		});

		it('should clean the idle buffer when a new idle event is added', () => {
			const event1: ElementChangedEvent = {
				type: 'element:changed',
				startTime: performance.now(),
				data: {
					wrapperSectionName: 'section',
					elementName: 'element1',
					rect: new DOMRect(0, 0, 100, 100),
					previousRect: undefined,
					source: 'mutation',
				},
			};

			timeline.markEvent(event1);

			jest.runAllTimers(); // Simulate idle

			// Buffer should be empty after idle
			expect(timeline.idleBuffer.unorderedEvents).toHaveLength(0);

			const event2: ElementChangedEvent = {
				type: 'element:changed',
				startTime: performance.now() + 10,
				data: {
					wrapperSectionName: 'section',
					elementName: 'element2',
					rect: new DOMRect(0, 0, 100, 100),
					previousRect: undefined,
					source: 'mutation',
				},
			};

			timeline.markEvent(event2);

			// Buffer should contain only the new event
			expect(timeline.idleBuffer.unorderedEvents).toContain(event2);
			expect(timeline.idleBuffer.unorderedEvents).not.toContain(event1);
		});
	});

	describe('TimelineController.attemptCleanup', () => {
		describe('when trying to add more events', () => {
			it('should reset timeline state if event count exceeds threshold', () => {
				timeline = new TimelineController({
					cleanup: {
						eventsThreshold: 1000,
					},
				});
				addFakeEvents(timeline, 1001);

				timeline.markEvent({
					type: 'idle-time',
					startTime: performance.now(),
					data: {
						duration: 0,
					},
				});

				expect(timeline.unorderedEvents.length).toBe(2);
				expect(timeline.unorderedEvents[0].type).toBe('timeline:clean-up');
				expect(timeline.unorderedEvents[1].type).toBe('idle-time');
			});
		});

		it('should reset timeline state if event count exceeds threshold', () => {
			timeline = new TimelineController({
				cleanup: {
					eventsThreshold: 1000,
				},
			});
			addFakeEvents(timeline, 1001);
			timeline.attemptCleanup();

			expect(timeline.unorderedEvents.length).toBe(1);
			expect(timeline.unorderedEvents[0].type).toBe('timeline:clean-up');
			expect(timeline.lastIdleTime).toBeNull();
			expect(timeline.lastIdleTask).toBeNull();
		});

		it('should not reset timeline state if event count does not exceed threshold', () => {
			timeline = new TimelineController({
				cleanup: {
					eventsThreshold: 1000,
				},
			});
			addFakeEvents(timeline, 1000);
			timeline.attemptCleanup();

			expect(timeline.unorderedEvents.length).toBe(1000);
		});
	});
});

describe('onIdleBufferFlush - Threshold', () => {
	let timeline: TimelineController;

	beforeEach(() => {
		timeline = new TimelineController({
			buffer: {
				eventsThreshold: 200,
				cyclesThreshold: 10,
			},
		});
		jest.useFakeTimers({
			doNotFake: ['performance'],
		});
		global.requestIdleCallback = jest.fn().mockImplementation((callback) => {
			return setTimeout(callback, 0);
		});
		global.cancelIdleCallback = jest.fn().mockImplementation((id) => {
			clearTimeout(id);
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should call onIdleBufferFlush callback when buffer has at least 200 events', () => {
		const mockCallback = jest.fn();
		timeline.onIdleBufferFlush(mockCallback);

		addFakeEvents(timeline, 199); // Add 198 events, should NOT trigger callback
		jest.runAllTimers();
		expect(mockCallback).toHaveBeenCalledTimes(0);

		timeline.markEvent({
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section',
				elementName: 'element200',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		});

		jest.runAllTimers();
		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it('should call onIdleBufferFlush callback after 10 idle cycles', () => {
		const mockCallback = jest.fn();
		timeline.onIdleBufferFlush(mockCallback);

		for (let i = 0; i < 10; i++) {
			timeline.markEvent({
				type: 'element:changed',
				startTime: performance.now(),
				data: {
					wrapperSectionName: 'section',
					elementName: `element${i}`,
					rect: new DOMRect(0, 0, 100, 100),
					previousRect: undefined,
					source: 'mutation',
				},
			});
			jest.runAllTimers();
		}

		expect(mockCallback).toHaveBeenCalledTimes(0);

		timeline.markEvent({
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section',
				elementName: 'element11',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		});
		jest.runAllTimers();

		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it('should reset idleCycleCount after triggering callback', () => {
		const mockCallback = jest.fn();
		timeline.onIdleBufferFlush(mockCallback);

		for (let i = 0; i < 10; i++) {
			timeline.markEvent({
				type: 'element:changed',
				startTime: performance.now(),
				data: {
					wrapperSectionName: 'section',
					elementName: `element${i}`,
					rect: new DOMRect(0, 0, 100, 100),
					previousRect: undefined,
					source: 'mutation',
				},
			});
			jest.runAllTimers();
		}

		// No callback should have been called yet
		expect(mockCallback).toHaveBeenCalledTimes(0);

		timeline.markEvent({
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section',
				elementName: 'element11',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		});
		jest.runAllTimers();

		// Callback should be called once, and cycle count should reset
		expect(mockCallback).toHaveBeenCalledTimes(1);

		// Verify that the idleCycleCount is reset
		expect(timeline.idleCycleCount).toBe(0);
	});

	it('should not call callback if buffer and cycles thresholds are not met', () => {
		const mockCallback = jest.fn();
		timeline.onIdleBufferFlush(mockCallback);

		// Add 9 idle cycles
		for (let i = 0; i < 9; i++) {
			timeline.markEvent({
				type: 'element:changed',
				startTime: performance.now(),
				data: {
					wrapperSectionName: 'section',
					elementName: `element${i}`,
					rect: new DOMRect(0, 0, 100, 100),
					previousRect: undefined,
					source: 'mutation',
				},
			});
			jest.runAllTimers();
		}

		// Callback should not be called yet
		expect(mockCallback).toHaveBeenCalledTimes(0);

		// Add events to buffer but do not exceed threshold
		addFakeEvents(timeline, 180);
		jest.runAllTimers();

		// Callback still should not be called
		expect(mockCallback).toHaveBeenCalledTimes(0);
	});
});

describe('TimelineController serialise Method', () => {
	let timeline: TimelineController;

	beforeEach(() => {
		timeline = new TimelineController();
	});

	it('should serialize an empty timeline correctly', () => {
		const json = timeline.serialise();
		expect(json).toEqual([]);
	});

	it('should serialize a timeline with events correctly', () => {
		const now = performance.now();
		const event1: ElementChangedEvent = {
			type: 'element:changed',
			startTime: now + 5,
			data: {
				wrapperSectionName: 'section1',
				elementName: 'element1',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		};
		const event2: ElementChangedEvent = {
			type: 'element:changed',
			startTime: now + 10,
			data: {
				wrapperSectionName: 'section2',
				elementName: 'element2',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		};
		const event3: PerformanceFirstPaintEvent = {
			type: 'performance:first-paint',
			startTime: now + 15,
			data: {},
		};

		timeline.markEvent(event1);
		timeline.markEvent(event2);
		timeline.markEvent(event3);

		const json = timeline.serialise();
		expect(json).toEqual([
			['element:changed', [event1, event2]],
			['performance:first-paint', [event3]],
		]);
	});

	it('should not mutate the internal event state when serializing', () => {
		const event: ElementChangedEvent = {
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section',
				elementName: 'element',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		};

		timeline.markEvent(event);

		const initialEvents = timeline.getEvents();
		const json = timeline.serialise();

		expect(json).toEqual([['element:changed', [event]]]);

		// Verify that internal state hasn't changed
		const eventsAfterSerialization = timeline.getEvents();
		expect(eventsAfterSerialization).toEqual(initialEvents);
	});
});

describe('TimelineController - onNextIdle', () => {
	let timeline: TimelineController;
	let mockCallback: jest.Mock<
		ReturnType<OnIdleBufferFlushCallback>,
		Parameters<OnIdleBufferFlushCallback>
	>;

	beforeEach(() => {
		timeline = new TimelineController();
		mockCallback = jest.fn();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	it('should register a callback for the next idle event', () => {
		timeline.onNextIdle(mockCallback);
		expect(timeline.onNextIdleCallbacks.size).toBe(1);
	});

	it('should call the registered callback on the next idle event', () => {
		timeline.onNextIdle(mockCallback);

		// Simulate an event
		timeline.markEvent({
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section',
				elementName: 'element',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		});

		jest.runAllTimers();

		expect(mockCallback).toHaveBeenCalledTimes(1);
		expect(mockCallback).toHaveBeenCalledWith(
			expect.objectContaining({
				idleAt: expect.any(Number),
				timelineBuffer: expect.any(Object),
			}),
		);
	});

	it('should remove the callback after it has been called', () => {
		timeline.onNextIdle(mockCallback);

		timeline.markEvent({
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section',
				elementName: 'element',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		});

		jest.runAllTimers();

		expect(timeline.onNextIdleCallbacks.size).toBe(0);
	});

	it('should handle multiple callbacks', () => {
		const mockCallback2 = jest.fn();
		timeline.onNextIdle(mockCallback);
		timeline.onNextIdle(mockCallback2);

		timeline.markEvent({
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section',
				elementName: 'element',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		});

		jest.runAllTimers();

		expect(mockCallback).toHaveBeenCalledTimes(1);
		expect(mockCallback2).toHaveBeenCalledTimes(1);
		expect(timeline.onNextIdleCallbacks.size).toBe(0);
	});

	it('should return an unsubscribe function', () => {
		const unsubscribe = timeline.onNextIdle(mockCallback);
		expect(typeof unsubscribe).toBe('function');

		unsubscribe();
		expect(timeline.onNextIdleCallbacks.size).toBe(0);
	});

	it('should not call the callback if unsubscribed before idle', () => {
		const unsubscribe = timeline.onNextIdle(mockCallback);
		unsubscribe();

		timeline.markEvent({
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section',
				elementName: 'element',
				rect: new DOMRect(0, 0, 100, 100),
				previousRect: undefined,
				source: 'mutation',
			},
		});

		jest.runAllTimers();

		expect(mockCallback).not.toHaveBeenCalled();
	});
});
