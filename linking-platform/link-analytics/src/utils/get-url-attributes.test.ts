import { getUrlAttributes } from './get-url-attributes';

describe('getUrlAttributes', () => {
	it('should return an object with `urlHash`', async () => {
		const resolvedAttributes = getUrlAttributes('some-url');

		expect(resolvedAttributes).toEqual(
			expect.objectContaining({
				urlHash: expect.not.stringContaining('some-url'),
			}),
		);
	});
});
