import { renderHook } from '@testing-library/react-hooks';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import type { Site } from '../../common/types';
import { getAccessibleProducts } from '../getAvailableSites';
import { useAvailableSites } from '../useAvailableSites';

jest.mock('../getAvailableSites', () => ({
	getAccessibleProducts: jest.fn((_: string) => Promise.resolve<Site[]>([])),
}));

describe('useAvailableSites', () => {
	const siteA = {
		cloudId: 'site-a',
		displayName: 'Foo',
		url: 'https://localhost/site-a/',
	};
	const siteB = {
		cloudId: 'site-b',
		displayName: 'Bar',
		url: 'https://localhost/site-b',
	};

	beforeEach(() => {
		asMock(getAccessibleProducts).mockResolvedValue([siteA, siteB]);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it.each(['confluence', 'jira'] as const)('should fetch sites for product %s', async (product) => {
		const { waitForNextUpdate } = renderHook(() => useAvailableSites(product));
		await waitForNextUpdate();

		expect(getAccessibleProducts).toHaveBeenCalledWith(product);
	});

	it('should sort found sites by displayName', async () => {
		const { result, waitForNextUpdate } = renderHook(() => useAvailableSites('confluence'));

		await waitForNextUpdate();

		expect(result.current.availableSites).toStrictEqual([siteB, siteA]);
	});

	describe('selected site', () => {
		it('should be site matching current location when no cloud id provided', async () => {
			const siteC = {
				cloudId: 'some-cloud-id',
				displayName: 'Matching Browser URL',
				url: window.location.origin,
			};

			asMock(getAccessibleProducts).mockResolvedValue([siteB, siteA, siteC]);

			const { result, waitForNextUpdate } = renderHook(() => useAvailableSites('confluence'));

			await waitForNextUpdate();

			expect(result.current.availableSites).toStrictEqual([siteB, siteA, siteC]);
			expect(result.current.selectedSite).toStrictEqual(siteC);
		});

		it('should be first site when no cloud id if none match current location', async () => {
			const { result, waitForNextUpdate } = renderHook(() => useAvailableSites('confluence'));

			await waitForNextUpdate();

			expect(result.current.availableSites).toStrictEqual([siteB, siteA]);
			expect(result.current.selectedSite).toStrictEqual(siteB);
		});

		it('should be matching site when cloud id found', async () => {
			const { result, waitForNextUpdate } = renderHook(() =>
				useAvailableSites('confluence', siteA.cloudId),
			);

			await waitForNextUpdate();

			expect(result.current.availableSites).toStrictEqual([siteB, siteA]);
			expect(result.current.selectedSite).toStrictEqual(siteA);
		});

		it('should return correct site when cloud id changes', async () => {
			const { result, waitForNextUpdate, rerender } = renderHook(
				(props: Parameters<typeof useAvailableSites>) => useAvailableSites(...props),
				{
					initialProps: ['confluence', siteA.cloudId],
				},
			);

			await waitForNextUpdate();

			expect(result.current.availableSites).toStrictEqual([siteB, siteA]);
			expect(result.current.selectedSite).toStrictEqual(siteA);

			rerender(['confluence', siteB.cloudId]);

			expect(result.current.availableSites).toStrictEqual([siteB, siteA]);
			expect(result.current.selectedSite).toStrictEqual(siteB);
		});
	});
});
