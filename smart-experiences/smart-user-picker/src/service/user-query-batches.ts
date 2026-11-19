const MAX_USERS_PER_QUERY = 90;

const batchAccountIds = (accountIds: string[]): string[][] => {
	const batches: string[][] = [];
	for (let index = 0; index < accountIds.length; index += MAX_USERS_PER_QUERY) {
		batches.push(accountIds.slice(index, index + MAX_USERS_PER_QUERY));
	}
	return batches;
};

export default batchAccountIds;
