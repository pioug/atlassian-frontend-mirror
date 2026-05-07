import 'jest-extended';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { renderHook } from '@atlassian/testing-library';

import { currentSiteCloudIdService } from '../../../services/current-site-cloud-id';
import useIncomingOutgoingAri from '../index';
import { queryIncomingOutgoingLinks } from '../query';

describe('useIncomingOutgoingLinks', () => {
	const FALLBACK_CLOUD_ID = 'fallback-cloud-id-123';

	const setup = () => {
		const {
			current: { getIncomingOutgoingAris },
		} = renderHook(() => useIncomingOutgoingAri());
		return { getIncomingOutgoingAris };
	};

	const mockTenantInfo = () => {
		fetchMock.mockOnceIf('/_edge/tenant_info', JSON.stringify({ cloudId: FALLBACK_CLOUD_ID }));
	};

	beforeEach(() => {
		currentSiteCloudIdService.clearCache();
		window.localStorage?.clear?.();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getIncomingOutgoingLinksForAri', () => {
		it.each([
			['ari-1', 5, 10],
			['ari-2', 10, 15],
			['ari-2', undefined, undefined],
		])(
			'makes the right query to graphql with ari: %s firstIncoming: %s firstOutgoing %s',
			async (ari, firstIncoming, firstOutgoing) => {
				const { getIncomingOutgoingAris } = setup();
				mockTenantInfo();
				fetchMock.mockOnce('{}');
				await getIncomingOutgoingAris(ari, firstIncoming, firstOutgoing);
				const url = fetchMock.mock.calls[1][0] as string;
				const request = fetchMock.mock.calls[1][1] as Request;
				expect(url).toEqual(`/gateway/api/graphql`);
				const requestBodyJson = await new Response(request.body).json();
				expect(requestBodyJson.query).toEqual(queryIncomingOutgoingLinks);
				expect(requestBodyJson.variables).toEqual({
					id: ari,
					firstIncoming: firstIncoming ?? 50, // 50 is default size
					firstOutgoing: firstOutgoing ?? 50, // 50 is default size
				});
			},
		);

		// FIXME: Jest upgrade
		// throws error
		it('throws when the request fails', async () => {
			const { getIncomingOutgoingAris } = setup();
			mockTenantInfo();
			fetchMock.mockRejectOnce();
			expect(getIncomingOutgoingAris('test-ari')).rejects.toEqual(undefined);
		});

		it.each([
			[{}, [], []],
			[{ data: {} }, [], []],
			[{ data: { graphStore: {} } }, [], []],
			[
				{
					data: { graphStore: { outgoing: {}, incoming: {} } },
				},
				[],
				[],
			],
			[
				{
					data: {
						graphStore: { outgoing: { aris: null }, incoming: { aris: null } },
					},
				},
				[],
				[],
			],
			[
				{
					data: {
						graphStore: { outgoing: { aris: [] }, incoming: { aris: [] } },
					},
				},
				[],
				[],
			],
			[
				{
					data: {
						graphStore: {
							outgoing: {
								aris: [
									{
										id: 'O-ARI-TO-1',
									},
								],
							},
							incoming: {
								aris: [
									{
										id: 'I-ARI-FROM-1',
									},
								],
							},
						},
					},
				},
				['I-ARI-FROM-1'],
				['O-ARI-TO-1'],
			],
			[
				{
					data: {
						graphStore: {
							outgoing: {
								aris: [
									{
										id: 'O-ARI-TO-1',
									},
									undefined,
									null,
									{
										id: 'O-ARI-TO-2',
									},
								],
							},
							incoming: {
								aris: [
									{
										id: 'I-ARI-FROM-1',
									},
									undefined,
									null,
									{
										id: 'I-ARI-FROM-2',
									},
								],
							},
						},
					},
				},
				['I-ARI-FROM-1', 'I-ARI-FROM-2'],
				['O-ARI-TO-1', 'O-ARI-TO-2'],
			],
			[
				{
					data: {
						graphStore: {
							outgoing: {
								aris: [
									{
										id: 'ARI-TO-1',
									},
									{
										id: 'ARI-TO-2',
									},
									{
										id: 'ARI-TO-3',
									},
									{
										id: 'ARI-TO-4',
									},
								],
							},
							incoming: {
								aris: [
									{
										id: 'ARI-FROM-1',
									},
									{
										id: 'ARI-FROM-2',
									},
									{
										id: 'ARI-FROM-3',
									},
								],
							},
						},
					},
				},
				['ARI-FROM-1', 'ARI-FROM-2', 'ARI-FROM-3'],
				['ARI-TO-1', 'ARI-TO-2', 'ARI-TO-3', 'ARI-TO-4'],
			],
		])(
			'%# for given graphql response, incomingAris should be %s and outgoingAris should be %s',
			async (response, expectedIncomingAris, expectedOutgoingAris) => {
				const { getIncomingOutgoingAris } = setup();
				mockTenantInfo();
				fetchMock.mockOnceIf('/gateway/api/graphql', JSON.stringify(response));
				const { incomingAris, outgoingAris } = await getIncomingOutgoingAris('test-ari', 50, 50);
				expect(incomingAris).toEqual(expectedIncomingAris);
				expect(outgoingAris).toEqual(expectedOutgoingAris);
			},
		);
	});

	describe('X-Query-Context header', () => {
		const EXPECTED_SITE_ID = 'a436116f-02ce-4520-8fbb-7301462a1674';
		const JIRA_ARI = `ari:cloud:jira:${EXPECTED_SITE_ID}:issue/10532973`;
		const CONFLUENCE_ARI = `ari:cloud:confluence:${EXPECTED_SITE_ID}:page/6214783529`;
		const CLOUD_ARI_WITHOUT_SITE_ID =
			'ari:cloud:graph::customer-org-category/activation/5fd9b3db-3a95-4c43-b119-79d12ab4182e/bc2c8785-dddb-4406-8c2c-060f11e5fbcc';
		const THIRD_PARTY_ARI =
			'ari:third-party:google.google-drive::document/spreadsheetId/1XR-jbjSqdOY_cP2wqKTe4gljZnwLoXAUWCafOSRkQcg';
		it.each([
			['Jira', JIRA_ARI],
			['Confluence', CONFLUENCE_ARI],
		])('should send X-Query-Context header with siteId extracted from %s ARI', async (_, ari) => {
			const { getIncomingOutgoingAris } = setup();
			fetchMock.mockOnce('{}');
			await getIncomingOutgoingAris(ari);

			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock).toHaveBeenCalledWith(
				'/gateway/api/graphql',
				expect.objectContaining({
					headers: expect.objectContaining({
						'X-Query-Context': `ari:cloud:platform::site/${EXPECTED_SITE_ID}`,
					}),
				}),
			);
		});

		describe.each([
			['third-party ARI', THIRD_PARTY_ARI],
			['cloud ARI without siteId', CLOUD_ARI_WITHOUT_SITE_ID],
		])('with %s', (_, ari) => {
			ffTest.both(
				'platform_sl_incoming_outgoing_tenant_info_killswitch',
				'tenant_info killswitch',
				() => {
					it(`should call /_edge/tenant_info`, async () => {
						const { getIncomingOutgoingAris } = setup();
						mockTenantInfo();
						fetchMock.mockOnce('{}');

						await getIncomingOutgoingAris(ari);

						expect(fetchMock).toHaveBeenCalledTimes(2);
						expect(fetchMock).toHaveBeenNthCalledWith(1, '/_edge/tenant_info', expect.any(Object));
						expect(fetchMock).toHaveBeenNthCalledWith(
							2,
							'/gateway/api/graphql',
							expect.objectContaining({
								headers: expect.objectContaining({
									'X-Query-Context': `ari:cloud:platform::site/${FALLBACK_CLOUD_ID}`,
								}),
							}),
						);
					});

					it(`should return empty arrays when tenant_info fails`, async () => {
						const { getIncomingOutgoingAris } = setup();

						// Call to /_edge/tenant_info fails
						fetchMock.mockRejectOnce(new Error('Failed to fetch tenant info'));

						const result = await getIncomingOutgoingAris(ari);

						// Verify it returns empty arrays without making the graphql call
						expect(result).toEqual({ incomingAris: [], outgoingAris: [] });

						// Verify only the tenant_info endpoint was called (no graphql call)
						expect(fetchMock).toHaveBeenCalledTimes(1);
						expect(fetchMock).toHaveBeenCalledWith('/_edge/tenant_info', expect.any(Object));
					});
				},
			);
		});
	});
});
