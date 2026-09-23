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

const JIRA_DESCRIPTION_FIELD_ID = 'description';

/**
 * One synced block location on a Jira work item, parsed once from its document ARI.
 * Two locations name the same field when both members match, whichever of the two ARI
 * forms each was written in.
 */
export type JiraFieldLocation = Readonly<{
	/** Bare field id, the shape AGG `fieldsById(ids:)` takes and returns. */
	fieldId: string;
	/** Parent issue ARI. `issueById` and the object resolver take this one. */
	issueAri: string;
}>;

const toJiraFieldLocation = ({
	cloudId,
	fieldId,
	issueId,
}: {
	cloudId: string;
	fieldId: string;
	issueId: string;
}): JiraFieldLocation => ({
	fieldId,
	issueAri: getJiraWorkItemAri({ cloudId, workItemId: issueId }),
});

/** A plain issue ARI is the work item's description field. */
export const parseJiraFieldLocation = ({ ari }: { ari: string }): JiraFieldLocation | undefined => {
	const workItemMatch = ari.match(JIRA_WORK_ITEM_ARI_REGEX);
	if (workItemMatch?.[1] && workItemMatch[2]) {
		return toJiraFieldLocation({
			cloudId: workItemMatch[1],
			fieldId: JIRA_DESCRIPTION_FIELD_ID,
			issueId: workItemMatch[2],
		});
	}

	const fieldValueParts = getFieldValueAriParts(ari);
	return fieldValueParts && toJiraFieldLocation(fieldValueParts);
};
