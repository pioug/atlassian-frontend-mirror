import { mocks } from '../__fixtures__/mocks';

import { getResolvedAttributes } from './get-resolved-attributes';

describe('getResolvedAttributes', () => {
	const linkDetails = {
		url: 'some-url',
	};

	it('returns attributes for unresolved links', async () => {
		const resolvedAttributes = getResolvedAttributes(linkDetails, mocks.notFound);

		expect(resolvedAttributes).toEqual(
			expect.objectContaining({
				status: 'not_found',
				displayCategory: 'link',
			}),
		);
	});

	it('returns Analytics attributes successfully', async () => {
		const resolvedAttributes = getResolvedAttributes(linkDetails, mocks.success);

		expect(resolvedAttributes).toEqual(
			expect.objectContaining({
				status: 'resolved',
				displayCategory: 'smartLink',
				extensionKey: 'object-provider',
				canBeDatasource: false,
			}),
		);
	});

	it('returns Analytics attributes successfully with canBeDatasource = true when datasources are present in the response details', async () => {
		const resolvedAttributes = getResolvedAttributes(linkDetails, mocks.withDatasources);

		expect(resolvedAttributes).toEqual(
			expect.objectContaining({
				status: 'resolved',
				displayCategory: 'smartLink',
				extensionKey: 'object-provider',
				canBeDatasource: true,
			}),
		);
	});

	it('should return `displayCategory` as `link` even if the link can be resolved', () => {
		const resolvedAttributes = getResolvedAttributes(
			{ ...linkDetails, displayCategory: 'link' },
			mocks.success,
		);

		expect(resolvedAttributes).toEqual(
			expect.objectContaining({
				status: 'resolved',
				displayCategory: 'link',
				extensionKey: 'object-provider',
			}),
		);
	});
});
