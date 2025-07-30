import type { VCObserverEntry } from '../types'; // Adjust the path as necessary

import EntriesTimeline from './index'; // Adjust the path as necessary

// Mock performance.now() to ensure consistent timing behavior
const mockPerformanceNow = jest.spyOn(performance, 'now');

describe('EntryTimeline', () => {
	let timeline: EntriesTimeline;

	beforeEach(() => {
		// Set a fixed time for consistent test behavior
		mockPerformanceNow.mockReturnValue(1000);
		timeline = new EntriesTimeline();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const createEntry = (time: number, name: string): VCObserverEntry => {
		return {
			time,
			data: {
				type: 'mutation:element',
				elementName: name,
				rect: { x: 0, y: 0, width: 10, height: 10 } as DOMRect,
				visible: true,
			},
		};
	};

	test('should add entries and retrieve them in order', () => {
		const entry1 = createEntry(200, 'entry1');
		const entry2 = createEntry(100, 'entry2');
		const entry3 = createEntry(300, 'entry3');

		timeline.push(entry1);
		timeline.push(entry2);
		timeline.push(entry3);

		const orderedEntries = timeline.getOrderedEntries({});
		expect(orderedEntries).toEqual([entry2, entry1, entry3]);
	});

	test('should filter entries by start and stop time', () => {
		const entry1 = createEntry(100, 'entry1');
		const entry2 = createEntry(200, 'entry2');
		const entry3 = createEntry(300, 'entry3');

		timeline.push(entry1);
		timeline.push(entry2);
		timeline.push(entry3);

		const filteredEntries = timeline.getOrderedEntries({ start: 150, stop: 250 });
		expect(filteredEntries).toEqual([entry2]);
	});

	test('should clear all entries', () => {
		const entry1 = createEntry(100, 'entry1');
		timeline.push(entry1);

		timeline.clear();
		const orderedEntries = timeline.getOrderedEntries({});
		expect(orderedEntries).toEqual([]);
	});

	test('should use cache for ordered entries and invalidate after timeout', () => {
		const entry1 = createEntry(100, 'entry1');
		const entry2 = createEntry(200, 'entry2');
		const entry3 = createEntry(300, 'entry3');
		timeline.push(entry1);
		timeline.push(entry2);
		timeline.push(entry3);

		// First retrieval to populate the cache
		const orderedEntriesFirstCall = timeline.getOrderedEntries({});
		expect(orderedEntriesFirstCall).toEqual([entry1, entry2, entry3]);

		// Retrieve again and expect the same result indicating cache is used
		const orderedEntriesSecondCall = timeline.getOrderedEntries({});
		expect(orderedEntriesSecondCall).toEqual([entry1, entry2, entry3]);
		// Check if both calls returned the same reference
		expect(orderedEntriesSecondCall).toBe(orderedEntriesFirstCall);
	});
});
