import type { LabelStack } from '../../../../interaction-context';
import isLabelStackUnderSegment from '../is-label-stack-under-segment';

describe('isLabelStackUnderSegment', () => {
	it('should return true when labelStack contains the target segmentId', () => {
		const labelStack: LabelStack = [
			{ name: 'root', segmentId: 'root-segment' },
			{ name: 'child' },
			{ name: 'target', segmentId: 'target-segment' },
		];

		const result = isLabelStackUnderSegment(labelStack, 'target-segment');

		expect(result).toBe(true);
	});

	it('should return false when labelStack does not contain the target segmentId', () => {
		const labelStack: LabelStack = [
			{ name: 'root', segmentId: 'root-segment' },
			{ name: 'child' },
			{ name: 'other', segmentId: 'other-segment' },
		];

		const result = isLabelStackUnderSegment(labelStack, 'target-segment');

		expect(result).toBe(false);
	});

	it('should return false when labelStack is empty', () => {
		const labelStack: LabelStack = [];

		const result = isLabelStackUnderSegment(labelStack, 'target-segment');

		expect(result).toBe(false);
	});

	it('should return false when labelStack contains only labels without segmentId', () => {
		const labelStack: LabelStack = [{ name: 'label1' }, { name: 'label2' }, { name: 'label3' }];

		const result = isLabelStackUnderSegment(labelStack, 'target-segment');

		expect(result).toBe(false);
	});

	it('should return true when the first element matches the target segmentId', () => {
		const labelStack: LabelStack = [
			{ name: 'target', segmentId: 'target-segment' },
			{ name: 'child' },
		];

		const result = isLabelStackUnderSegment(labelStack, 'target-segment');

		expect(result).toBe(true);
	});

	it('should return true when the last element matches the target segmentId', () => {
		const labelStack: LabelStack = [
			{ name: 'root', segmentId: 'root-segment' },
			{ name: 'child' },
			{ name: 'target', segmentId: 'target-segment' },
		];

		const result = isLabelStackUnderSegment(labelStack, 'target-segment');

		expect(result).toBe(true);
	});

	it('should return true when any element in the middle matches the target segmentId', () => {
		const labelStack: LabelStack = [
			{ name: 'root', segmentId: 'root-segment' },
			{ name: 'target', segmentId: 'target-segment' },
			{ name: 'child' },
			{ name: 'leaf', segmentId: 'leaf-segment' },
		];

		const result = isLabelStackUnderSegment(labelStack, 'target-segment');

		expect(result).toBe(true);
	});

	it('should return true when multiple elements match the target segmentId', () => {
		const labelStack: LabelStack = [
			{ name: 'first', segmentId: 'target-segment' },
			{ name: 'middle' },
			{ name: 'second', segmentId: 'target-segment' },
		];

		const result = isLabelStackUnderSegment(labelStack, 'target-segment');

		expect(result).toBe(true);
	});

	it('should handle single element labelStack with matching segmentId', () => {
		const labelStack: LabelStack = [{ name: 'single', segmentId: 'target-segment' }];

		const result = isLabelStackUnderSegment(labelStack, 'target-segment');

		expect(result).toBe(true);
	});

	it('should handle single element labelStack without matching segmentId', () => {
		const labelStack: LabelStack = [{ name: 'single', segmentId: 'other-segment' }];

		const result = isLabelStackUnderSegment(labelStack, 'target-segment');

		expect(result).toBe(false);
	});
});
