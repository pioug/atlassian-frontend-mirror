import { print } from 'graphql';

import { aggUserQuery } from './aggUserQuery';

export const buildAggUserQuery = (
	userId: string,
): {
	query: string;
	variables: {
		userId: string;
	};
} => ({
	query: print(aggUserQuery),
	variables: {
		userId,
	},
});
