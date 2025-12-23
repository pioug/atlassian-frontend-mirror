/* eslint-disable require-unicode-regexp  */

/**
 * Generates the Jira work item ARI
 * @param workItemId - the ID of the work item
 * @param cloudId - the cloud ID
 * @returns the Jira work item ARI
 */
export const getJiraWorkItemAri = (
	workItemId: string,
	cloudId: string,
) => `ari:cloud:jira:${cloudId}:issue/${workItemId}`;

/**
 * Extracts the Jira work item ID from the Jira work item ARI
 * @param ari - the Jira work item ARI
 * @returns the Jira work item ID
 */
export const getJiraWorkItemIdFromAri = (ari: string) => {
	const match = ari.match(/ari:cloud:jira:([^:]+):issue\/(\d+)/);
	if (match?.[2]) {
		return match[2];
	}
	throw new Error(`Invalid Jira work item ARI: ${ari}`);
};
