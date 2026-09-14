import type { Ari, InvocationResponse, InvokeManualRulePayload, UserInputs } from '../common/types';
import { getInvocationUrl } from '../common/utils/getInvocationUrl';
import { performPostRequest } from '../common/utils/performPostRequest';

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
