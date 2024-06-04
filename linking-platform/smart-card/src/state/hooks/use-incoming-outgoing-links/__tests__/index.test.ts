import 'jest-extended';
import { renderHook } from '@testing-library/react-hooks';
import { useIncomingOutgoingAri } from '..';
import { queryIncomingOutgoingLinks } from '../query';

describe('useIncomingOutgoingLinks', () => {
	const setup = () => {
		const {
			result: {
				current: { getIncomingOutgoingAris },
			},
		} = renderHook(() => useIncomingOutgoingAri());
		return { getIncomingOutgoingAris };
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('returns getIncomingOutgoingLinksForAri function', () => {
		const { getIncomingOutgoingAris } = setup();
		expect(getIncomingOutgoingAris).toBeFunction();
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
				fetchMock.mockOnce('{}');
				await getIncomingOutgoingAris(ari, firstIncoming, firstOutgoing);
				const url = fetchMock.mock.calls[0][0] as string;
				const request = fetchMock.mock.calls[0][1] as Request;
				expect(url).toEqual(`/gateway/api/graphql`);
				const requestBodyJson = await new Response(request.body).json();
				expect(requestBodyJson.query).toEqual(queryIncomingOutgoingLinks);
				expect(requestBodyJson.variables).toEqual({
					ids: [ari],
					firstIncoming: firstIncoming ?? 50, // 50 is default size
					firstOutgoing: firstOutgoing ?? 50, // 50 is default size
				});
			},
		);

		it('throws when the request fails', async () => {
			const { getIncomingOutgoingAris } = setup();
			fetchMock.mockRejectOnce();
			expect(getIncomingOutgoingAris('test-ari')).toReject();
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
						graphStore: { outgoing: { nodes: null }, incoming: { nodes: null } },
					},
				},
				[],
				[],
			],
			[
				{
					data: {
						graphStore: { outgoing: { nodes: [] }, incoming: { nodes: [] } },
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
								nodes: [
									{
										from: {
											id: 'ARI-FROM-1',
										},
									},
								],
							},
							incoming: {
								nodes: [
									{
										to: {
											id: 'ARI-TO-1',
										},
									},
								],
							},
						},
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
								nodes: [
									{
										to: {
											id: 'O-ARI-TO-1',
										},
									},
								],
							},
							incoming: {
								nodes: [
									{
										from: {
											id: 'I-ARI-FROM-1',
										},
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
								nodes: [
									{
										to: {
											id: 'O-ARI-TO-1',
										},
									},
									undefined,
									null,
									{
										to: {
											id: 'O-ARI-TO-2',
										},
									},
								],
							},
							incoming: {
								nodes: [
									{
										from: {
											id: 'I-ARI-FROM-1',
										},
									},
									undefined,
									null,
									{
										from: {
											id: 'I-ARI-FROM-2',
										},
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
								nodes: [
									{
										to: {
											id: 'ARI-TO-1',
										},
									},
									{
										to: {
											id: 'ARI-TO-2',
										},
									},
									{
										to: {
											id: 'ARI-TO-3',
										},
									},
									{
										to: {
											id: 'ARI-TO-4',
										},
									},
								],
							},
							incoming: {
								nodes: [
									{
										from: {
											id: 'ARI-FROM-1',
										},
									},
									{
										from: {
											id: 'ARI-FROM-2',
										},
									},
									{
										from: {
											id: 'ARI-FROM-3',
										},
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
			'when graphql response is %s, incomingAris should be %s and outgoingAris should be %s',
			async (response, expectedIncomingAris, expectedOutgoingAris) => {
				const { getIncomingOutgoingAris } = setup();
				fetchMock.mockOnceIf('/gateway/api/graphql', JSON.stringify(response));
				const { incomingAris, outgoingAris } = await getIncomingOutgoingAris('test-ari', 50, 50);
				expect(incomingAris).toEqual(expectedIncomingAris);
				expect(outgoingAris).toEqual(expectedOutgoingAris);
			},
		);
	});
});
