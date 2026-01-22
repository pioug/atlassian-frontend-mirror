/* eslint-disable require-unicode-regexp  */
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
				summary: string;
				webUrl: string;
			} | null;
		} | null;
	};
};

/**
 * Query to get the work item url by id
 * @param id - the ID of the work item
 * @returns url of the work item
 */
const GET_SOURCE_INFO_QUERY = `query ${GET_SOURCE_INFO_OPERATION_NAME} ($id: ID!) {
  jira {
    issueById(id: $id) {
      id
      webUrl
      summary
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

export const fetchJiraWorkItemInfo = async (
	workItemAri: string,
	hasAccess: boolean,
): Promise<SyncBlockSourceInfo | undefined> => {
	if (hasAccess) {
		const response = await getJiraWorkItemSourceInfo(workItemAri);

		const contentData = response.data?.jira?.issueById;
		const webUrl = contentData?.webUrl;
		const summary = contentData?.summary;

		return Promise.resolve({
			url: webUrl,
			sourceAri: workItemAri,
			title: summary,
		});
	} else {
		return await resolveNoAccessWorkItemInfo(workItemAri);
	}
};
