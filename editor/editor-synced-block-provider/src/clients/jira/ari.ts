/* eslint-disable require-unicode-regexp  */

const JIRA_WORK_ITEM_ARI_REGEX = /ari:cloud:jira:([^:]+):issue\/(\d+)/;
const JIRA_ISSUE_FIELD_VALUE_ARI_REGEX = /ari:cloud:jira:([^:]+):issuefieldvalue\/([^/]+)\/([^/]+)/;

/**
 * Generates the Jira work item ARI
 * @param workItemId - the ID of the work item
 * @param cloudId - the cloud ID
 * @returns the Jira work item ARI
 */
export const getJiraWorkItemAri = ({
	cloudId,
	workItemId,
}: {
	cloudId: string;
	workItemId: string;
}): string => {
	return `ari:cloud:jira:${cloudId}:issue/${workItemId}` as const;
};

const getFieldValueAriParts = (
	ari: string,
): { cloudId: string; fieldId: string; issueId: string } | undefined => {
	const match = ari.match(JIRA_ISSUE_FIELD_VALUE_ARI_REGEX);
	if (match?.[1] && match[2] && match[3]) {
		return {
			cloudId: match[1],
			issueId: match[2],
			fieldId: match[3],
		};
	}
	return undefined;
};

/**
 * Extracts the Jira work item ID from an issue ARI or a field-value source ARI.
 * Field identity stays on `sourceAri`; callers that need an issue id for AGG
 * or media must not read `fieldId` from `blockAri`.
 * @param ari - the Jira issue or issuefieldvalue ARI
 * @returns the Jira work item ID
 */
export const getJiraWorkItemIdFromAri = ({ ari }: { ari: string }): string => {
	const match = ari.match(JIRA_WORK_ITEM_ARI_REGEX);
	if (match?.[2]) {
		return match[2];
	}

	const fieldValueParts = getFieldValueAriParts(ari);
	if (fieldValueParts) {
		return fieldValueParts.issueId;
	}

	throw new Error(`Invalid Jira work item ARI: ${ari}`);
};

/**
 * Rewrites a Jira field-value source ARI to the parent issue ARI used by AGG
 * (`issueById`, media tokens, object-resolver). All other ARIs, including
 * issue ARIs and unrecognized Media context ids, are returned as-is.
 */
export const getJiraIssueAriFromSourceAri = ({ ari }: { ari: string }): string => {
	const fieldValueParts = getFieldValueAriParts(ari);
	if (fieldValueParts) {
		return getJiraWorkItemAri({
			cloudId: fieldValueParts.cloudId,
			workItemId: fieldValueParts.issueId,
		});
	}

	return ari;
};
