import { backgroundTask } from '../../backgroundTasks';
import { InputEventsObserver, processEntry } from '../InputEventsObserver';

jest.mock('../../backgroundTasks', () => ({
	backgroundTask: jest.fn((fn) => fn()),
}));

describe('processEntry', () => {
	it('should return null if entry is not an instance of PerformanceEventTiming', () => {
		const entry = { startTime: 0, duration: 50 } as PerformanceEntry;
		expect(processEntry(entry)).toBeNull();
	});

	it('should return null if timeToProcessEvent is less than or equal to 0', () => {
		const entry = {
			startTime: 0,
			processingEnd: 0,
			processingStart: 0,
			target: document.createElement('div'),
			duration: 50,
			name: 'click',
			toJSON: () => ({}),
		} as unknown as PerformanceEventTiming;

		expect(processEntry(entry)).toBeNull();
	});

	it('should not return null if target is body/documentElement', () => {
		const entry1 = {
			startTime: 0,
			processingEnd: 50,
			processingStart: 5,
			target: document.body,
			duration: 50,
			name: 'click',
			toJSON: () => ({}),
		} as unknown as PerformanceEventTiming;

		expect(processEntry(entry1)).not.toBeNull();
	});

	it('should return null if duration is less than or equal to ALLOWED_DURATION', () => {
		const entry = {
			startTime: 0,
			processingEnd: 10,
			processingStart: 5,
			target: document.createElement('div'),
			duration: 30,
			name: 'click',
			toJSON: () => ({}),
		} as unknown as PerformanceEventTiming;

		expect(processEntry(entry)).toBeNull();
	});

	it('should return a UserEvent object for valid entries', () => {
		const mockEventEntry = {
			startTime: 0,
			processingEnd: 50,
			processingStart: 5,
			target: document.createElement('div'),
			duration: 50,
			name: 'click',
		};
		const entry = {
			...mockEventEntry,
			toJSON: () => mockEventEntry,
		} as unknown as PerformanceEventTiming;

		const result = processEntry(entry);

		expect(result).toEqual({
			eventName: 'click',
			startTime: 0,
			duration: 50,
			elementRef: expect.any(WeakRef),
			entry: mockEventEntry,
		});
	});
});

describe('InputEventsObserver', () => {
	let mockPerformanceObserver: jest.Mock;
	let mockObserve: jest.Mock;
	let mockDisconnect: jest.Mock;
	let originalPerformanceObserver: any;

	beforeAll(() => {
		originalPerformanceObserver = global.PerformanceObserver;
	});

	beforeEach(() => {
		mockObserve = jest.fn();
		mockDisconnect = jest.fn();
		mockPerformanceObserver = jest.fn().mockImplementation((callback) => ({
			observe: mockObserve,
			disconnect: mockDisconnect,
		}));
		(global as any).PerformanceObserver = mockPerformanceObserver;
	});

	afterAll(() => {
		global.PerformanceObserver = originalPerformanceObserver;
	});

	it('should create a PerformanceObserver and observe entries', () => {
		const onEventEntries = jest.fn();
		const observer = new InputEventsObserver({ onEventEntries });

		expect(mockPerformanceObserver).toHaveBeenCalledTimes(1);
		expect(mockObserve).not.toHaveBeenCalled();

		observer.observe();

		expect(mockObserve).toHaveBeenCalledWith({
			type: 'event',
			buffered: true,
			durationThreshold: 16,
		});
	});

	it('should disconnect the observer', () => {
		const onEventEntries = jest.fn();
		const observer = new InputEventsObserver({ onEventEntries });

		observer.observe();
		observer.disconnect();

		expect(mockDisconnect).toHaveBeenCalledTimes(1);
	});

	it('should call onEventEntries with processed events', () => {
		const mockEntry = {
			startTime: 0,
			processingEnd: 50,
			processingStart: 10,
			target: document.createElement('div'),
			duration: 60,
			name: 'click',
			toJSON: jest.fn().mockReturnValue({ name: 'click' }),
		};
		const mockEntries = {
			getEntries: jest.fn().mockReturnValue([mockEntry]),
		};
		const onEventEntries = jest.fn();
		new InputEventsObserver({ onEventEntries });
		// Simulate the PerformanceObserver callback
		const observerCallback = mockPerformanceObserver.mock.calls[0][0];

		observerCallback(mockEntries);

		expect(backgroundTask).toHaveBeenCalledTimes(1);
		expect(onEventEntries).toHaveBeenCalledWith([
			{
				elementRef: expect.any(WeakRef),
				startTime: 0,
				duration: 50,
				eventName: 'click',
				entry: { name: 'click' },
			},
		]);
	});
});
