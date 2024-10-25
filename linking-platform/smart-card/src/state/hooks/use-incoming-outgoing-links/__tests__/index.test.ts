import 'jest-extended';
import { renderHook } from '@testing-library/react-hooks';

import useIncomingOutgoingAri from '../index';
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
				fetchMock.mockOnceIf('/gateway/api/graphql', JSON.stringify(response));
				const { incomingAris, outgoingAris } = await getIncomingOutgoingAris('test-ari', 50, 50);
				expect(incomingAris).toEqual(expectedIncomingAris);
				expect(outgoingAris).toEqual(expectedOutgoingAris);
			},
		);
	});
});
