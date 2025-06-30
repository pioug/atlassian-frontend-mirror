import type { LabelStack } from '../../../../interaction-context';
import getSegmentId from '../get-segment-id';

describe('getSegmentId', () => {
	it('should return segmentId when leaf node has segmentId', () => {
		const labelStack: LabelStack = [
			{ name: 'root' },
			{ name: 'segment', segmentId: 'test-segment-id' },
		];

		const result = getSegmentId(labelStack);

		expect(result).toBe('test-segment-id');
	});

	it('should return undefined when no element has segmentId', () => {
		const labelStack: LabelStack = [{ name: 'root' }, { name: 'label' }];

		const result = getSegmentId(labelStack);

		expect(result).toBeUndefined();
	});

	it('should return segmentId from the rightmost element that has segmentId', () => {
		const labelStack: LabelStack = [
			{ name: 'root', segmentId: 'root-segment' },
			{ name: 'child' },
			{ name: 'leaf', segmentId: 'leaf-segment' },
		];

		const result = getSegmentId(labelStack);

		expect(result).toBe('leaf-segment');
	});

	it('should return segmentId from earlier element when leaf node has no segmentId', () => {
		const labelStack: LabelStack = [
			{ name: 'root', segmentId: 'root-segment' },
			{ name: 'child' },
			{ name: 'leaf' },
		];

		const result = getSegmentId(labelStack);

		expect(result).toBe('root-segment');
	});

	it('should return the last segmentId when multiple elements have segmentId', () => {
		const labelStack: LabelStack = [
			{ name: 'first', segmentId: 'first-segment' },
			{ name: 'second', segmentId: 'second-segment' },
			{ name: 'third', segmentId: 'third-segment' },
		];

		const result = getSegmentId(labelStack);

		expect(result).toBe('third-segment');
	});

	it('should handle single element label stack', () => {
		const labelStack: LabelStack = [{ name: 'single', segmentId: 'single-segment' }];

		const result = getSegmentId(labelStack);

		expect(result).toBe('single-segment');
	});

	it('should handle single element without segmentId', () => {
		const labelStack: LabelStack = [{ name: 'single' }];

		const result = getSegmentId(labelStack);

		expect(result).toBeUndefined();
	});

	it('should handle empty label stack', () => {
		const labelStack: LabelStack = [];

		const result = getSegmentId(labelStack);

		expect(result).toBeUndefined();
	});

	it('should find segmentId in middle element when surrounded by elements without segmentId', () => {
		const labelStack: LabelStack = [
			{ name: 'first' },
			{ name: 'middle', segmentId: 'middle-segment' },
			{ name: 'last' },
		];

		const result = getSegmentId(labelStack);

		expect(result).toBe('middle-segment');
	});
});
