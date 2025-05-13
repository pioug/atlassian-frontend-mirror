import type { TimelineClock } from '../../timelineInterfaces';
import { UserLatencyObservers } from '../UserLatencyOberservers';

jest.mock('../InputEventsObserver');

describe('UserLatencyObservers', () => {
	let mockTimeline: jest.Mocked<TimelineClock>;
	let mockPerformanceObserver: jest.Mock;

	beforeEach(() => {
		mockTimeline = {
			markEvent: jest.fn(),
		} as unknown as jest.Mocked<TimelineClock>;

		mockPerformanceObserver = jest.fn().mockImplementation((callback) => ({
			observe: jest.fn(),
			disconnect: jest.fn(),
		}));

		(global as any).PerformanceObserver = mockPerformanceObserver;

		UserLatencyObservers.resetInstance();
	});

	it('should create a singleton instance', () => {
		const instance1 = new UserLatencyObservers(mockTimeline);
		const instance2 = new UserLatencyObservers(mockTimeline);

		expect(instance1).toBe(instance2);
	});

	it('should start observing on observe call', () => {
		const instance = new UserLatencyObservers(mockTimeline);
		instance.observe();

		expect(instance['inputEventsObserver'].observe).toHaveBeenCalled();
		expect(instance['performance']?.observe).toHaveBeenCalledWith({
			type: 'long-animation-frame',
			buffered: true,
		});
	});

	it('should stop observing on disconnect call', () => {
		const instance = new UserLatencyObservers(mockTimeline);
		instance.observe();
		instance.disconnect();

		expect(instance['inputEventsObserver'].disconnect).toHaveBeenCalled();
		expect(instance['performance']?.disconnect).toHaveBeenCalled();
	});

	it('should handle performance observer entries correctly', () => {
		const mockJsonEntry = {
			name: 'long-animation-frame',
			entryType: 'long-animation-frame',
			startTime: 123,
			duration: 100,
			blockDuration: 50,
		};
		const mockEntry = {
			startTime: 123,
			entryType: 'long-animation-frame',
			toJSON: () => mockJsonEntry,
		};

		new UserLatencyObservers(mockTimeline);
		const instance = mockPerformanceObserver.mock.calls[0][0];

		instance({ getEntries: () => [mockEntry] });

		expect(mockTimeline.markEvent).toHaveBeenCalledWith({
			type: 'performance:long-animation-frame',
			startTime: 123,
			data: {
				entry: mockJsonEntry,
			},
		});
	});
});
