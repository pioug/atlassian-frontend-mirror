import type { Ari, GetManualRulesResponse, ManualRulesById, RuleQuery } from '../common/types';
import { getSearchUrl } from '../common/utils/getSearchUrl';
import { performPostRequest } from '../common/utils/performPostRequest';

/**
 * Manual trigger rules API fetch. Fetches a list of manually triggered rules according to the context provided
 * in query.
 * @param site - the site ARI to fetch the rules against
 * @param query - the workspace/container/objects to fetch rules against
 */
export const searchManuallyTriggeredRules = async (
	site: Ari,
	query: RuleQuery,
): Promise<ManualRulesById> => {
	const url = await getSearchUrl(site);
	// TODO this will in the new API be a GET request instead, with the above getSearchUrl method
	// constructing a URL with the appropriate query parameters. For now, instead, we pass the
	// destructured query through as a POST body.
	const response: GetManualRulesResponse = await performPostRequest(url, {
		body: JSON.stringify(query),
	});

	return response.data.reduce(
		(acc: ManualRulesById, { id, name, ruleScope, userInputs }) => ({
			// eslint-disable-next-line
			...acc,
			[id]: {
				id,
				name,
				ruleScope,
				userInputPrompts: userInputs,
			},
		}),
		{},
	);
};
