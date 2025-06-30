import type { InteractionMetrics } from '../../../../common';
import hasSegmentFailed from '../has-segment-failed';

describe('hasSegmentFailed', () => {
	it('should return true when an error matches the segment ID', () => {
		const errors: InteractionMetrics['errors'] = [
			{
				name: 'TestError',
				errorType: 'runtime',
				errorMessage: 'Something went wrong',
				labelStack: [
					{ name: 'root', segmentId: 'root-segment' },
					{ name: 'target', segmentId: 'target-segment' },
				],
			},
		];

		const result = hasSegmentFailed(errors, 'target-segment');

		expect(result).toBe(true);
	});

	it('should return false when no errors match the segment ID', () => {
		const errors: InteractionMetrics['errors'] = [
			{
				name: 'TestError',
				errorType: 'runtime',
				errorMessage: 'Something went wrong',
				labelStack: [
					{ name: 'root', segmentId: 'root-segment' },
					{ name: 'other', segmentId: 'other-segment' },
				],
			},
		];

		const result = hasSegmentFailed(errors, 'target-segment');

		expect(result).toBe(false);
	});

	it('should return false when errors array is empty', () => {
		const errors: InteractionMetrics['errors'] = [];

		const result = hasSegmentFailed(errors, 'target-segment');

		expect(result).toBe(false);
	});

	it('should return false when error has no labelStack', () => {
		const errors: InteractionMetrics['errors'] = [
			{
				name: 'TestError',
				errorType: 'runtime',
				errorMessage: 'Something went wrong',
				labelStack: null,
			},
		];

		const result = hasSegmentFailed(errors, 'target-segment');

		expect(result).toBe(false);
	});

	it('should return false when error labelStack has no segmentId', () => {
		const errors: InteractionMetrics['errors'] = [
			{
				name: 'TestError',
				errorType: 'runtime',
				errorMessage: 'Something went wrong',
				labelStack: [{ name: 'root' }, { name: 'leaf' }],
			},
		];

		const result = hasSegmentFailed(errors, 'target-segment');

		expect(result).toBe(false);
	});

	it('should return true when any error in multiple errors matches', () => {
		const errors: InteractionMetrics['errors'] = [
			{
				name: 'FirstError',
				errorType: 'runtime',
				errorMessage: 'First error',
				labelStack: [{ name: 'root', segmentId: 'root-segment' }],
			},
			{
				name: 'SecondError',
				errorType: 'runtime',
				errorMessage: 'Second error',
				labelStack: [{ name: 'target', segmentId: 'target-segment' }],
			},
			{
				name: 'ThirdError',
				errorType: 'runtime',
				errorMessage: 'Third error',
				labelStack: [{ name: 'other', segmentId: 'other-segment' }],
			},
		];

		const result = hasSegmentFailed(errors, 'target-segment');

		expect(result).toBe(true);
	});

	it('should handle mixed errors with and without labelStack', () => {
		const errors: InteractionMetrics['errors'] = [
			{
				name: 'ErrorWithoutStack',
				errorType: 'runtime',
				errorMessage: 'No stack',
				labelStack: null,
			},
			{
				name: 'ErrorWithStack',
				errorType: 'runtime',
				errorMessage: 'With stack',
				labelStack: [{ name: 'target', segmentId: 'target-segment' }],
			},
		];

		const result = hasSegmentFailed(errors, 'target-segment');

		expect(result).toBe(true);
	});
});
