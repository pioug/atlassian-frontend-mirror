export const getJoinOrRequestDefaultAccessToProductsBulkSuccessResponse = (aris: string[]) =>
	aris.map((ari) => ({
		ari,
		result: 'ACCESS_GRANTED',
		resultsV2: {
			[ari]: [
				{
					accessMode: 'ACCESS_EXISTS',
					role: 'product/member',
				},
			],
		},
		errorReason: null,
	}));
