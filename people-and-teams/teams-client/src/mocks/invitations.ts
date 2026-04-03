export const getJoinOrRequestDefaultAccessToProductsBulkSuccessResponse = (aris: string[]): {
    ari: string;
    result: string;
    resultsV2: {
        [x: string]: {
            accessMode: string;
            role: string;
        }[];
    };
    errorReason: null;
}[] =>
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
