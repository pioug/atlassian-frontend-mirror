import { GRAPHQL_ENDPOINT } from './duplicateFetch';

/**
 * Calls the agentStudio_duplicateAgent mutation via raw GraphQL fetch.
 *
 * TODO: Add SLO tracking and Sentry error reporting.
 * See: https://product-fabric.atlassian.net/browse/RAGE-2822
 */
export const fetchDuplicateAgentMutation = async (
	agentAri: string,
): Promise<{ success: boolean; newAgentAri?: string; errorMessage?: string }> => {
	try {
		const response = await fetch(GRAPHQL_ENDPOINT, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: `mutation profilecardDuplicateAgentMutation($agentId: ID!) {
					agentStudio_duplicateAgent(id: $agentId) @optIn(to: "AgentStudio") {
						agent { id }
						success
						errors { message }
					}
				}`,
				variables: { agentId: agentAri },
			}),
		});
		const json = await response.json();
		const result = json?.data?.agentStudio_duplicateAgent;
		if (result?.success && result?.agent?.id) {
			return { success: true, newAgentAri: result.agent.id };
		}
		return {
			success: false,
			errorMessage: result?.errors?.[0]?.message ?? 'Duplicate agent mutation failed',
		};
	} catch (error) {
		return {
			success: false,
			errorMessage: error instanceof Error ? error.message : 'Network error during duplication',
		};
	}
};
