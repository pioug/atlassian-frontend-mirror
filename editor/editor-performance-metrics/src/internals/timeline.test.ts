/* eslint-disable compat/compat */
import { TimelineController } from './timeline';
import type { OnIdleBufferFlushCallback } from './timelineInterfaces';
import type {
	ElementChangedEvent,
	PerformanceFirstPaintEvent,
	TimelineEvent,
} from './timelineTypes';

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

describe('TimelineController - hold', () => {
	let timeline: TimelineController;

	beforeEach(() => {
		timeline = new TimelineController({ maxHoldDuration: 5000 });
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.runAllTimers();
		jest.useRealTimers();
	});

	describe('when there are multiple holds', () => {
		it('should create hold-idle:start events', () => {
			jest.advanceTimersByTime(1);
			timeline.hold({ source: 'setTimeout' });

			jest.advanceTimersByTime(2);
			timeline.hold({ source: 'setTimeout' });

			expect(timeline.getEvents()).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						type: 'hold-idle:start',
						startTime: 1,
						data: {
							source: 'setTimeout',
							uuid: expect.any(String),
						},
					}),
					expect.objectContaining({
						type: 'hold-idle:start',
						startTime: 3,
						data: {
							source: 'setTimeout',
							uuid: expect.any(String),
						},
					}),
				]),
			);
		});

		it('should create hold-idle:end when unhold is called', () => {
			jest.advanceTimersByTime(1);
			const unhold1 = timeline.hold({ source: 'setTimeout' });

			jest.advanceTimersByTime(2);
			const unhold2 = timeline.hold({ source: 'setTimeout' });

			jest.advanceTimersByTime(10);
			unhold1();

			jest.advanceTimersByTime(10);
			unhold2();

			expect(timeline.getEvents()).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						type: 'hold-idle:end',
						startTime: 13,
						data: {
							source: 'setTimeout',
							duration: 12,
							uuid: expect.any(String),
						},
					}),
					expect.objectContaining({
						type: 'hold-idle:end',
						startTime: 23,
						data: {
							source: 'setTimeout',
							duration: 20,
							uuid: expect.any(String),
						},
					}),
				]),
			);
		});
	});

	describe('when there are multiple timeouts', () => {
		it('should remove all timed out hold', () => {
			jest.advanceTimersByTime(1);
			timeline.hold({ source: 'setTimeout' });

			jest.advanceTimersByTime(2);
			timeline.hold({ source: 'setTimeout' });

			jest.advanceTimersByTime(6000);

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

			expect(timeline.getEvents()).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						type: 'hold-idle:start',
						startTime: expect.any(Number),
						data: {
							source: 'setTimeout',
							uuid: expect.any(String),
						},
					}),
				]),
			);
		});
	});

	describe('when multiple unholds are called before the timeout', () => {
		it('should not create timeout events', () => {
			jest.advanceTimersByTime(1);
			const unhold = timeline.hold({ source: 'setTimeout' });

			jest.advanceTimersByTime(4000);
			timeline.hold({ source: 'setTimeout' });

			unhold();

			jest.advanceTimersByTime(2000);
			timeline.hold({ source: 'setTimeout' });

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

			expect(timeline.getEvents()).not.toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						type: 'hold-idle:timeout',
					}),
				]),
			);
		});
	});

	it('should force idle scheduling after maximum hold duration', () => {
		timeline.hold({ source: 'setTimeout' });

		jest.advanceTimersByTime(6000);

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

		expect(timeline.getEvents()).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					type: 'hold-idle:timeout',
				}),
			]),
		);
	});

	it('should prevent idle scheduling when held', () => {
		timeline.hold({ source: 'setTimeout' });
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

		expect(timeline.getEvents()).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					type: 'idle-time',
				}),
			]),
		);
	});

	it('should resume idle scheduling when unheld', () => {
		const unhold = timeline.hold({ source: 'setTimeout' });
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

		unhold();
		jest.runAllTimers();

		expect(timeline.getEvents()).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					type: 'idle-time',
				}),
			]),
		);
	});

	it('should support multiple holds', () => {
		jest.advanceTimersByTime(100);

		const unhold1 = timeline.hold({ source: 'setTimeout' });

		jest.advanceTimersByTime(100);
		const unhold2 = timeline.hold({ source: 'setTimeout' });

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

		unhold1();
		jest.advanceTimersByTime(100);

		expect(timeline.getEvents()).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					type: 'idle-time',
				}),
			]),
		);

		unhold2();
		jest.runAllTimers();

		expect(timeline.getEvents()).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					type: 'idle-time',
				}),
			]),
		);
	});

	it('should include uuid in hold-idle:timeout events', () => {
		jest.advanceTimersByTime(1);
		timeline.hold({ source: 'setTimeout' });

		jest.advanceTimersByTime(6000); // Exceed the maxHoldDuration

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

		const events = timeline.getEvents();
		const holdEvent = events.find((event) => event.type === 'hold-idle:start');
		const timeoutEvent = events.find((event) => event.type === 'hold-idle:timeout');
		expect(timeoutEvent).toBeDefined();
		expect(timeoutEvent?.data).toHaveProperty('uuid');

		expect(
			// @ts-expect-error
			timeoutEvent?.data.uuid,
		).toEqual(
			// @ts-expect-error
			holdEvent?.data.uuid,
		);
	});
});

describe('TimelineController - Subscription Management', () => {
	let timeline: TimelineController;

	beforeEach(() => {
		timeline = new TimelineController();
	});

	it('should call onceAllSubscribersCleaned callback when all subscribers are unsubscribed', () => {
		const mockCallback = jest.fn();
		timeline.onceAllSubscribersCleaned(mockCallback);

		const unsubscribe1 = timeline.onIdleBufferFlush(() => {});
		const unsubscribe2 = timeline.onNextIdle(() => {});

		unsubscribe1();
		expect(mockCallback).not.toHaveBeenCalled();

		unsubscribe2();
		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it('should not call onceAllSubscribersCleaned callback if there are still active subscribers', () => {
		const mockCallback = jest.fn();
		timeline.onceAllSubscribersCleaned(mockCallback);

		const unsubscribe1 = timeline.onIdleBufferFlush(() => {});
		timeline.onNextIdle(() => {});

		unsubscribe1();
		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('should call onceAllSubscribersCleaned callback every time all subscribers are cleaned', () => {
		const mockCallback = jest.fn();
		timeline.onceAllSubscribersCleaned(mockCallback);

		const unsubscribe1 = timeline.onIdleBufferFlush(() => {});
		const unsubscribe2 = timeline.onNextIdle(() => {});

		unsubscribe1();
		unsubscribe2();
		expect(mockCallback).toHaveBeenCalledTimes(1);

		const unsubscribe3 = timeline.onIdleBufferFlush(() => {});
		unsubscribe3();
		expect(mockCallback).toHaveBeenCalledTimes(2);
	});
});

describe('TimelineController - Hold Race Condition', () => {
	let timeline: TimelineController;

	beforeEach(() => {
		timeline = new TimelineController({ maxHoldDuration: 5000 });
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should not create idle event if hold is active when handleIdle is called', () => {
		const holdUnsubscribe = timeline.hold({ source: 'setTimeout' });

		// Simulate the scenario where handleIdle is called before the hold is released
		(timeline as any).handleIdle(performance.now() - 1000);

		jest.runAllTimers();

		const events = timeline.getEvents();
		const idleEvents = events.filter((event) => event.type === 'idle-time');

		expect(idleEvents).toHaveLength(0);

		holdUnsubscribe();
	});

	it('should create idle event after hold is released', () => {
		const holdUnsubscribe = timeline.hold({ source: 'setTimeout' });

		// Simulate the scenario where handleIdle is called before the hold is released
		(timeline as any).handleIdle(performance.now() - 1000);

		jest.runAllTimers();

		holdUnsubscribe();

		// Trigger a new idle check
		timeline.markEvent({
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'test',
				elementName: 'test',
				rect: new DOMRect(),
				previousRect: undefined,
				source: 'mutation',
			},
		});

		jest.runAllTimers();

		const events = timeline.getEvents();
		const idleEvents = events.filter((event) => event.type === 'idle-time');

		expect(idleEvents).toHaveLength(1);
	});

	it('should handle multiple holds correctly', () => {
		const hold1 = timeline.hold({ source: 'setTimeout' });
		const hold2 = timeline.hold({ source: 'fetch' });

		(timeline as any).handleIdle(performance.now() - 1000);
		jest.runAllTimers();

		hold1();

		(timeline as any).handleIdle(performance.now() - 1000);
		jest.runAllTimers();

		hold2();

		timeline.markEvent({
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'test',
				elementName: 'test',
				rect: new DOMRect(),
				previousRect: undefined,
				source: 'mutation',
			},
		});

		jest.runAllTimers();

		const events = timeline.getEvents();
		const idleEvents = events.filter((event) => event.type === 'idle-time');

		expect(idleEvents).toHaveLength(1);
	});
});

describe('TimelineController - cleanupSubscribers', () => {
	let timeline: TimelineController;
	let mockCallback: jest.Mock;

	beforeEach(() => {
		timeline = new TimelineController();
		mockCallback = jest.fn();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should clear all idle buffer flush callbacks', () => {
		const callback1 = jest.fn();
		const callback2 = jest.fn();

		timeline.onIdleBufferFlush(callback1);
		timeline.onIdleBufferFlush(callback2);

		timeline.cleanupSubscribers();

		expect(timeline.onIdleBufferFlushCallbacks.size).toBe(0);
	});

	it('should clear all next idle callbacks', () => {
		const callback1 = jest.fn();
		const callback2 = jest.fn();

		timeline.onNextIdle(callback1);
		timeline.onNextIdle(callback2);

		timeline.cleanupSubscribers();

		expect(timeline.onNextIdleCallbacks.size).toBe(0);
	});

	it('should trigger onceAllSubscribersCleaned callback', () => {
		timeline.onceAllSubscribersCleaned(mockCallback);
		timeline.onIdleBufferFlush(() => {});
		timeline.onNextIdle(() => {});

		timeline.cleanupSubscribers();

		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it('should flush idle buffer before cleaning up subscribers', () => {
		const flushCallback = jest.fn();
		timeline.onIdleBufferFlush(flushCallback);

		// Add an event to the idle buffer
		timeline.markEvent({
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section',
				elementName: 'element',
				rect: new DOMRect(),
				previousRect: undefined,
				source: 'mutation',
			},
		});

		timeline.cleanupSubscribers();

		expect(timeline.idleBuffer.unorderedEvents).toHaveLength(0);

		expect(flushCallback).toHaveBeenCalledTimes(0); // Make sure the idle callbacks are called later

		jest.runAllTimers();
		expect(flushCallback).toHaveBeenCalledTimes(1);
	});
});

describe('TimelineController - Race Condition between handleIdle and callOnNextIdleCallbacks', () => {
	let timeline: TimelineController;
	let mockNextIdleCallback: jest.Mock;
	let mockBufferFlushCallback: jest.Mock;

	beforeEach(() => {
		timeline = new TimelineController({
			buffer: {
				// @ts-expect-error
				eventsThreshold: 2, // Set a low threshold to trigger buffer flush
				cyclesThreshold: 5,
			},
		});
		mockNextIdleCallback = jest.fn();
		mockBufferFlushCallback = jest.fn();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	it('should preserve idle buffer for onNextIdle callbacks when buffer threshold is met', () => {
		// Register both types of callbacks
		timeline.onNextIdle(mockNextIdleCallback);
		timeline.onIdleBufferFlush(mockBufferFlushCallback);

		// Add events to trigger buffer flush
		timeline.markEvent({
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section1',
				elementName: 'element1',
				rect: new DOMRect(),
				previousRect: undefined,
				source: 'mutation',
			},
		});

		timeline.markEvent({
			type: 'element:changed',
			startTime: performance.now(),
			data: {
				wrapperSectionName: 'section2',
				elementName: 'element2',
				rect: new DOMRect(),
				previousRect: undefined,
				source: 'mutation',
			},
		});

		// Simulate idle
		jest.runAllTimers();

		// Both callbacks should have been called
		expect(mockBufferFlushCallback).toHaveBeenCalledTimes(1);
		expect(mockNextIdleCallback).toHaveBeenCalledTimes(1);

		// Verify that both callbacks received the same buffer content
		const bufferFlushCallArg = mockBufferFlushCallback.mock.calls[0][0];
		const nextIdleCallArg = mockNextIdleCallback.mock.calls[0][0];

		// Both callbacks should receive a buffer containing the two events plus the idle event
		expect(bufferFlushCallArg.timelineBuffer.getEvents()).toHaveLength(3);
		expect(nextIdleCallArg.timelineBuffer.getEvents()).toHaveLength(3);

		// Verify that both received the same events
		expect(bufferFlushCallArg.timelineBuffer.getEvents()).toEqual(
			nextIdleCallArg.timelineBuffer.getEvents(),
		);
	});
});
