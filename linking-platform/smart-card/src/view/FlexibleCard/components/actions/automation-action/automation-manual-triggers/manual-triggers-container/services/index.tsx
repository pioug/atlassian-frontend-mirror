import type {
  Ari,
  GetManualRulesResponse,
  InvocationResponse,
  InvokeManualRulePayload,
  ManualRulesById,
  RuleQuery,
  UserInputs,
} from './../common/types';
import {
  getInvocationUrl,
  getSearchUrl,
  performPostRequest,
} from './../common/utils';

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

/**
 * Invoke a manually triggered rule via the API.
 * @param cloudId - the site the rule belongs to
 * @param ruleId - the identifier of the rule you want to invoke
 * @param objects - the list of objects you wish to create an automation event for.
 * @param userInputs - the optional user inputs if this manual trigger requires them
 */
export const invokeManuallyTriggeredRule = async (
  site: Ari,
  ruleId: number,
  objects: string[],
  userInputs?: UserInputs,
): Promise<InvocationResponse> => {
  const url = await getInvocationUrl(site, ruleId);
  const bodyRaw: InvokeManualRulePayload = {
    objects,
  };
  if (userInputs) {
    bodyRaw.userInputs = userInputs;
  }
  return performPostRequest(url, {
    body: JSON.stringify(bodyRaw),
  });
};
