/* eslint-disable require-unicode-regexp  */
import { fg } from '@atlaskit/platform-feature-flags';

import type { SyncBlockSourceInfo } from '../../providers/types';
import { fetchWithRetry } from '../../utils/retry';

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
				id: string;
				/**
				 * Issue-type metadata used by the SyncedLocationDropdown to render the correct
				 * ADS icon. Optional in the AGG schema, may be `null` for partially indexed
				 * issues. Mapping to `SyncBlockSourceInfo.issueType` is gated by
				 * `platform_synced_block_patch_11`.
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
// `issueType` is requested unconditionally because GraphQL field selection cannot be
// gated at the network layer without a separate operation; AGG ignores unknown
// front-end gating. The runtime mapping into `SyncBlockSourceInfo.issueType` is gated
// by `platform_synced_block_patch_11` below.
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

const getJiraWorkItemSourceInfo = async (ari: string): Promise<GetSourceInfoResult> => {
	const bodyData = {
		query: GET_SOURCE_INFO_QUERY,
		operationName: GET_SOURCE_INFO_OPERATION_NAME,
		variables: {
			id: ari,
		},
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

const resolveNoAccessWorkItemInfo = async (ari: string): Promise<SyncBlockSourceInfo> => {
	const response = await fetch('/gateway/api/object-resolver/resolve/ari', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({ ari }),
	});

	if (response.ok) {
		const payload = await response.json();
		const url = payload?.data?.url;
		const title = payload?.data?.name;

		return {
			url: typeof url === 'string' ? url : undefined,
			title: typeof title === 'string' ? title : undefined,
			sourceAri: ari,
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
	if (hasAccess) {
		const response = await getJiraWorkItemSourceInfo(workItemAri);

		const contentData = response.data?.jira?.issueById;

		// Defensive narrowing (gated by `platform_synced_block_patch_11`):
		// AGG may return `null` (not just omit the field) for `webUrl` / `summary` on
		// partially indexed issues. Without these guards, downstream consumers that
		// expect `string | undefined` would receive `null` and either crash or render
		// the literal string "null". The pre-gate path preserves the legacy behaviour
		// so this can be dialled off independently.
		if (fg('platform_synced_block_patch_11')) {
			const webUrl = typeof contentData?.webUrl === 'string' ? contentData.webUrl : undefined;
			const summary = typeof contentData?.summary === 'string' ? contentData.summary : undefined;

			// Surface issue-type metadata so consumers can render the correct ADS issue-type
			// icon. Defensive narrowing mirrors the webUrl/summary treatment above: only
			// surfaced when `name` is a non-empty string; AGG values like `{ name: null }`
			// collapse back to `undefined`.
			const rawIssueType = contentData?.issueType;
			const issueTypeName =
				typeof rawIssueType?.name === 'string' && rawIssueType.name.length > 0
					? rawIssueType.name
					: undefined;
			const issueType = issueTypeName
				? {
						name: issueTypeName,
						iconUrl:
							typeof rawIssueType?.avatar?.xsmall === 'string'
								? rawIssueType.avatar.xsmall
								: undefined,
					}
				: undefined;

			return Promise.resolve({
				url: webUrl,
				sourceAri: workItemAri,
				title: summary,
				issueType,
			});
		}

		const webUrl = contentData?.webUrl ?? undefined;
		const summary = contentData?.summary ?? undefined;

		return Promise.resolve({
			url: webUrl,
			sourceAri: workItemAri,
			title: summary,
		});
	} else {
		return await resolveNoAccessWorkItemInfo(workItemAri);
	}
};
