import { MentionIdChangeTracker } from '../../mention-id-change-tracker';
import { diffMentionIds } from '../../mention-id-diff';

describe('diffMentionIds', () => {
	it('reports new and removed occurrences in document order, including duplicate IDs', () => {
		expect(diffMentionIds(['a', 'b', 'a'], ['c', 'a', 'b', 'c'])).toEqual({
			addedIds: ['c', 'c'],
			removedIds: ['a'],
		});
	});

	it('does not treat moving an existing mention as an addition', () => {
		expect(diffMentionIds(['a', 'b'], ['b', 'a'])).toEqual({
			addedIds: [],
			removedIds: [],
		});
	});
});

describe('MentionIdChangeTracker', () => {
	it('tracks the first snapshot and copies later snapshots', () => {
		const tracker = new MentionIdChangeTracker();
		const ids = ['a'];
		expect(tracker.reconcile(ids)).toEqual({
			isInitial: true,
			addedIds: ['a'],
			removedIds: [],
		});

		ids.push('b');
		expect(tracker.reconcile(['a'])).toEqual({
			isInitial: false,
			addedIds: [],
			removedIds: [],
		});
		expect(tracker.reconcile(['b', 'a'])).toEqual({
			isInitial: false,
			addedIds: ['b'],
			removedIds: [],
		});
	});
});
