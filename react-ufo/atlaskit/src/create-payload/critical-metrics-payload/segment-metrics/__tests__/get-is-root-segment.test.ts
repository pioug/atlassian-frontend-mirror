import type { LabelStack } from '../../../../interaction-context';
import getIsRootSegment from '../get-is-root-segment';

describe('getIsRootSegment', () => {
	it('should return true for single element label stack', () => {
		const labelStack: LabelStack = [{ name: 'root', segmentId: 'root-segment' }];

		const result = getIsRootSegment(labelStack);

		expect(result).toBe(true);
	});

	it('should return false for multiple element label stack', () => {
		const labelStack: LabelStack = [
			{ name: 'root', segmentId: 'root-segment' },
			{ name: 'child', segmentId: 'child-segment' },
		];

		const result = getIsRootSegment(labelStack);

		expect(result).toBe(false);
	});

	it('should return false for empty label stack', () => {
		const labelStack: LabelStack = [];

		const result = getIsRootSegment(labelStack);

		expect(result).toBe(false);
	});

	it('should return false for deeply nested label stack', () => {
		const labelStack: LabelStack = [
			{ name: 'root', segmentId: 'root-segment' },
			{ name: 'level1' },
			{ name: 'level2' },
			{ name: 'level3', segmentId: 'deep-segment' },
		];

		const result = getIsRootSegment(labelStack);

		expect(result).toBe(false);
	});
});
