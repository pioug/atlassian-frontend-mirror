import { transformIconData } from './utils';

describe('transformIconData', () => {
	it('should transform the response', () => {
		const response = [
			{
				status: 200,
				body: {
					data: {
						url: 'https://example.com',
						generator: {
							name: 'confluence',
							icon: 'https://example.com/favicon.ico',
						},
					},
				},
			},
		];

		const expected = [
			{
				linkUrl: 'https://example.com',
				iconUrl: 'https://example.com/favicon.ico',
				productName: 'confluence',
			},
		];
		expect(true).toBeTruthy();
		expect(transformIconData(response)).toEqual(expected);
	});
});
