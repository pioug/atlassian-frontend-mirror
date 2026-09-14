import { print } from 'graphql';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { aggUserQuery } from './aggUserQuery';
import { aggUserQueryString } from './aggUserQueryString';

export const buildAggUserQuery = (
	userId: string,
): {
	query: string;
	variables: {
		userId: string;
	};
} => ({
	query: fg('platform_agg_user_query_doc_change') ? print(aggUserQuery) : aggUserQueryString,
	variables: {
		userId,
	},
});
