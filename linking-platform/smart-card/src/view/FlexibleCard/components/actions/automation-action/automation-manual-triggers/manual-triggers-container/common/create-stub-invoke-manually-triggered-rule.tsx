import type { Ari, Environment, InvocationResponse, InvocationResult, UserInputs } from './types';

/**
 * Creates a stubbed invocation API call for triggering rules. Will return
 * the supplied invocation result for all objects the rule was called
 * for.
 */
export const createStubInvokeManuallyTriggeredRule: any =
	(stubbedInvocationResultForAllObjects: InvocationResult, responseDelay?: number) =>
	async (
		_env: Environment | null,
		_site: Ari,
		_ruleId: number,
		objects: string[],
		_inputs?: UserInputs,
	): Promise<InvocationResponse> => {
		const response = objects.reduce(
			(acc, current) => ({
				...acc,
				[current]: stubbedInvocationResultForAllObjects,
			}),
			{},
		);

		return responseDelay
			? new Promise((resolve) => setTimeout(resolve, responseDelay))
			: Promise.resolve(response);
	};
