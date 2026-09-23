/* eslint-disable require-unicode-regexp  */

import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { SyncBlockSourceInfo } from '../../providers/types';
import { fetchWithRetry } from '../../utils/retry';
import { getJiraIssueAriFromSourceAri, parseJiraFieldLocation } from './ari';

const COMMON_HEADERS = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
};

const AGG_HEADERS = {
	'X-ExperimentalApi': 'confluence-agg-beta',
};

const GRAPHQL_ENDPOINT = '/gateway/api/graphql';

const GET_SOURCE_INFO_OPERATION_NAME = 'EDITOR_SYNCED_BLOCK_GET_SOURCE_INFO';

type GetSourceInfoResult = {
	data: {
		jira: {
			issueById: {
				/**
				 * The connection, the edge list, each edge and each node are all independently
				 * nullable in AGG.
				 */
				fieldsById?: {
					edges?: Array<{ node?: { fieldId: string; name: string | null } | null } | null> | null;
				} | null;
				id: string;
				/**
				 * Issue-type metadata used by the SyncedLocationDropdown to render the correct
				 * ADS icon. Optional in the AGG schema, may be `null` for partially indexed
				 * issues.
				 */
				issueType?: {
					avatar?: {
						xsmall: string | null;
					} | null;
					name: string | null;
				} | null;
				// `summary` and `webUrl` are nullable in the AGG schema for partially indexed
				// issues; surface that here so callers must defensively narrow before use.
				summary: string | null;
				webUrl: string | null;
			} | null;
		} | null;
	};
};

/**
 * Query to get the work item url by id
 * @param id - the ID of the work item
 * @returns url of the work item
 */
// `issueType` is requested alongside `summary` and `webUrl` so the
// SyncedLocationDropdown can render the correct ADS issue-type icon.
const GET_SOURCE_INFO_QUERY = `query ${GET_SOURCE_INFO_OPERATION_NAME} ($id: ID!) {
  jira {
	issueById(id: $id) {
	id
	webUrl
	summary
	issueType {
		name
		avatar {
		xsmall
		}
	}
	}
  }}`;

type JiraIssueSourceInfo = NonNullable<GetSourceInfoResult['data']['jira']>['issueById'];

// `fieldsById(ids:)` takes bare field ids, the same shape it returns on `node.fieldId`.
// Its schema doc gives `issuefieldvalue` ARIs as the example, but AGG resolves those to a
// null node. Verified against hello.atlassian.net by sending an ARI and a bare id together.
const GET_SOURCE_INFO_WITH_FIELD_QUERY = `query ${GET_SOURCE_INFO_OPERATION_NAME} ($id: ID!, $fieldIds: [ID!]!) {
  jira {
	issueById(id: $id) {
	id
	webUrl
	summary
	issueType {
		name
		avatar {
		xsmall
		}
	}
	fieldsById(ids: $fieldIds) {
		edges {
		node {
			fieldId
			name
		}
		}
	}
	}
  }}`;

// AGG does not promise `edges` follows the order of the requested ids.
const getFieldName = (
	contentData: JiraIssueSourceInfo | undefined,
	fieldId: string,
): string | undefined => {
	const name = contentData?.fieldsById?.edges?.find((edge) => edge?.node?.fieldId === fieldId)?.node
		?.name;

	return typeof name === 'string' && name.length > 0 ? name : undefined;
};

const getJiraWorkItemSourceInfo = async (
	issueAri: string,
	fieldId: string | undefined,
): Promise<GetSourceInfoResult> => {
	const bodyData = {
		query: fieldId ? GET_SOURCE_INFO_WITH_FIELD_QUERY : GET_SOURCE_INFO_QUERY,
		operationName: GET_SOURCE_INFO_OPERATION_NAME,
		variables: fieldId ? { id: issueAri, fieldIds: [fieldId] } : { id: issueAri },
	};

	const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { ...COMMON_HEADERS, ...AGG_HEADERS },
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new Error(`Failed to get url: ${response.statusText}`);
	}

	return (await response.json()) as GetSourceInfoResult;
};

const resolveNoAccessWorkItemInfo = async (
	sourceAri: string,
	issueAri: string,
): Promise<SyncBlockSourceInfo> => {
	const response = await fetch('/gateway/api/object-resolver/resolve/ari', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({ ari: issueAri }),
	});

	if (response.ok) {
		const payload = await response.json();
		const url = payload?.data?.url;
		const title = payload?.data?.name;

		return {
			url: typeof url === 'string' ? url : undefined,
			title: typeof title === 'string' ? title : undefined,
			sourceAri,
		};
	} else {
		throw new Error(`Failed to resolve ari: ${response.statusText}`);
	}
};

/**
 * Fetch source-info metadata for a Jira work item used by reference sync blocks.
 *
 * Parity notes vs the Confluence equivalent (`fetchConfluencePageInfo`):
 *
 * - **Archived / draft URL variants** are intentionally omitted. Confluence pages can be
 *   "unpublished" (draft, archived, in-trash) and need REST fallbacks plus alternate URL
 *   shapes. Jira work items have no equivalent lifecycle — an issue either exists in AGG
 *   or it does not — so a single `webUrl` is sufficient.
 *
 * - **`#block-{localId}` deep-link anchor** is intentionally not appended. The current
 *   Jira issue view does not implement scroll-to-anchor for unknown fragments, so the
 *   anchor would be dead weight on the URL. The dispatching code in
 *   `syncBlockProvider.fetchSyncBlockSourceInfo` deliberately does not pass `localId`
 *   here for the same reason. If/when Jira issue view supports anchor scrolling for
 *   sync-block local IDs, accept `localId?: string` here and append `#block-{localId}`.
 *
 * - **`subType` / page-type variants** are not modeled — Jira issue type is exposed via
 *   the separate `issueType` field returned alongside `summary` / `webUrl`.
 */
export const fetchJiraWorkItemInfo = async (
	workItemAri: string,
	hasAccess: boolean,
): Promise<SyncBlockSourceInfo | undefined> => {
	// AGG `issueById` and object-resolver only understand issue ARIs. Field-value
	// source ARIs keep their original identity on the returned `sourceAri`.
	const issueAri = getJiraIssueAriFromSourceAri({ ari: workItemAri });

	if (hasAccess) {
		const fieldLocation = isExperimentEnabled('editor_synced_blocks_jira_custom_rich_text')
			? parseJiraFieldLocation({ ari: workItemAri })
			: undefined;
		const response = await getJiraWorkItemSourceInfo(issueAri, fieldLocation?.fieldId);

		const contentData = response.data?.jira?.issueById;

		const webUrl = typeof contentData?.webUrl === 'string' ? contentData.webUrl : undefined;
		const summary = typeof contentData?.summary === 'string' ? contentData.summary : undefined;

		// Surface issue-type metadata for the SyncedLocationDropdown's ADS icon.
		// Defensive narrowing: only surface when `name` is a non-empty string;
		// AGG values like `{ name: null }` collapse back to `undefined`.
		const issueTypeName = contentData?.issueType?.name;
		const issueType =
			typeof issueTypeName === 'string' && issueTypeName.length > 0
				? {
						name: issueTypeName,
						iconUrl:
							typeof contentData?.issueType?.avatar?.xsmall === 'string'
								? contentData.issueType.avatar.xsmall
								: undefined,
					}
				: undefined;

		const fieldName = fieldLocation && getFieldName(contentData, fieldLocation.fieldId);

		return Promise.resolve({
			url: webUrl,
			sourceAri: workItemAri,
			title: summary,
			issueType,
			...(fieldName !== undefined && { fieldName }),
		});
	} else {
		return await resolveNoAccessWorkItemInfo(workItemAri, issueAri);
	}
};
