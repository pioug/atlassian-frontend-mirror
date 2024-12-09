import { processEntry } from './userEventsObserver'; // Adjust the import path as needed

jest.mock('./backgroundTasks', () => ({
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
			serialise: () => ({}),
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
			serialise: () => ({}),
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
			serialise: () => ({}),
		} as unknown as PerformanceEventTiming;

		expect(processEntry(entry)).toBeNull();
	});

	it('should return a UserEvent object for valid entries', () => {
		const entry = {
			startTime: 0,
			processingEnd: 100,
			processingStart: 5,
			target: document.createElement('div'),
			duration: 50,
			name: 'click',
			serialise: () => ({}),
		} as unknown as PerformanceEventTiming;

		const result = processEntry(entry);

		expect(result).toEqual({
			eventName: 'click',
			startTime: 0,
			duration: 50,
			elementRef: expect.any(WeakRef),
		});
	});
});
