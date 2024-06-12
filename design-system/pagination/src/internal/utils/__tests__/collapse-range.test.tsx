import collapseRange from '../collapse-range';

describe('#collapseRange', () => {
	const ellipsis = jest.fn(({ key }) => key);
	const transform = jest.fn((p: any) => p);

	beforeEach(jest.clearAllMocks);

	it('should not throw', () => {
		expect(() => {
			collapseRange<number>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2, {
				max: 5,
				ellipsis,
				transform,
			});
		}).not.toThrow();
	});

	it('should not add ellipsis when not needed', () => {
		const pages = collapseRange<number>([1, 2, 3, 4], 2, {
			max: 4,
			ellipsis,
			transform,
		});

		expect(pages).toEqual([1, 2, 3, 4]);
		expect(ellipsis).not.toHaveBeenCalledTimes(1);
	});

	it('should show ellipsis in start', () => {
		const pages = collapseRange<number>(
			[1, 2, 3, 4, 5, 6, 7, 8],
			7,
			{
				max: 7,
				ellipsis,
				transform,
			},
			'pagination',
		);
		const initialEllipsis = 'ellipsis-1';

		expect(pages).toEqual([1, initialEllipsis, 4, 5, 6, 7, 8]);
		expect(ellipsis).toHaveBeenCalledWith({
			key: initialEllipsis,
			testId: 'pagination-ellipsis',
			from: 2,
			to: 3,
		});
	});

	it('should show ellipsis in last', () => {
		const pages = collapseRange<number>(
			[1, 2, 3, 4, 5, 6, 7, 8],
			0,
			{
				max: 7,
				ellipsis,
				transform,
			},
			'pagination',
		);
		const endEllipsis = 'ellipsis-1';

		expect(pages).toEqual([1, 2, 3, 4, 5, endEllipsis, 8]);
		expect(ellipsis).toHaveBeenCalledWith({
			key: endEllipsis,
			testId: 'pagination-ellipsis',
			from: 6,
			to: 7,
		});
	});

	it('should not show ellipsis in last, if there is only one element need to collapse', () => {
		const pages = collapseRange<number>(
			[1, 2, 3, 4, 5, 6, 7, 8],
			4,
			{
				max: 7,
				ellipsis,
				transform,
			},
			'pagination',
		);
		const startEllipsis = 'ellipsis-1';

		expect(pages).toEqual([1, startEllipsis, 4, 5, 6, 7, 8]);
		expect(ellipsis).toHaveBeenCalledWith({
			key: startEllipsis,
			testId: 'pagination-ellipsis',
			from: 2,
			to: 3,
		});
	});

	it('should show ellipsis in start and end', () => {
		const pages = collapseRange<number>(
			[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			4,
			{
				max: 7,
				ellipsis,
				transform,
			},
			'pagination',
		);
		const initialEllipsis = 'ellipsis-1';
		const endEllipsis = 'ellipsis-2';

		expect(pages).toEqual([1, initialEllipsis, 4, 5, 6, endEllipsis, 10]);
		expect(ellipsis).toHaveBeenNthCalledWith(1, {
			key: initialEllipsis,
			testId: 'pagination-ellipsis',
			from: 2,
			to: 3,
		});
		expect(ellipsis).toHaveBeenNthCalledWith(2, {
			key: endEllipsis,
			testId: 'pagination-ellipsis',
			from: 7,
			to: 9,
		});
	});
});
