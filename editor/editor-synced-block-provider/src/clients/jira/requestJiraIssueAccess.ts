/**
 * Sends a "request access" notification for a Jira work item the current viewer
 * cannot see. A copy of jira/src/packages/platform/space-not-found-with-request-access/src/requestSpaceAccess.tsx
 */
const REQUEST_ACCESS_URL = '/rest/internal/latest/project-access/access-requested';

/**
 * Note: the type definition is copied from jira/src/packages/platform/space-not-found-with-request-access/src/requestSpaceAccess.tsx
 * Though 'null' is a possible value, if we want notification to actually be sent, accountId and projectKey or issueId have to have actual values.
 */
export type AccessRequestPayload = {
	accountId: string | null;
	boardId?: number | null;
	issueId?: number | null;
	issueKey?: string | null;
	message?: string | null;
	projectKey: string | null;
};

export const requestJiraSpaceAccess = (payload: AccessRequestPayload): Promise<Response> => {
	// we return nothing on purpose to be vague, not disclose if the project exists or not,
	// so we use fetch instead of performPutRequest as performPutRequest will return null for empty response

	return fetch(REQUEST_ACCESS_URL, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});
};
