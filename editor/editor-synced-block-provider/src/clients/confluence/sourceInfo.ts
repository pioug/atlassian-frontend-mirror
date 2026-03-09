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
		content: {
			nodes: {
				id: string;
				links: {
					base: string;
					editui: string;
					webui: string;
				};
				space: {
					key: string;
				};
				status: string;
				subType: string | null;
				title: string;
			}[];
		} | null;
	};
};

/**
 * Query to get the page subtype by id (i.e. live or classic)
 * @param documentARI
 * @returns subType live if livePage, subType null if classic page
 */
const GET_SOURCE_INFO_QUERY = `query ${GET_SOURCE_INFO_OPERATION_NAME} ($id: ID!, $status: [String]) {
	content (id: $id, status: $status) {
		nodes {
			id
			links {
				base
				editui
				webui
			}
			space {
				key
			}
			status
			subType
			title
		}
	}
}`;

const getConfluenceSourceInfo = async (
	ari: string,
	status?: string[],
): Promise<GetSourceInfoResult> => {
	const variables: { id: string; status?: string[] } = {
		id: ari,
	};

	if (status) {
		variables.status = status;
	}

	const bodyData = {
		query: GET_SOURCE_INFO_QUERY,
		operationName: GET_SOURCE_INFO_OPERATION_NAME,
		variables,
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

const resolveNoAccessPageInfo = async (ari: string): Promise<SyncBlockSourceInfo> => {
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

export const fetchConfluencePageInfo = async (
	pageAri: string,
	hasAccess: boolean,
	localId?: string,
): Promise<SyncBlockSourceInfo | undefined> => {
	if (hasAccess) {
		const status = ['draft', 'archived', 'current'];
		const response = await getConfluenceSourceInfo(pageAri, status);

		const contentData = response.data?.content?.nodes?.[0];
		const { title, subType } = contentData || {};

		let url;
		const { base, editui, webui } = contentData?.links || {};
		const pageStatus = contentData?.status;

		if (base && editui && pageStatus !== 'archived') {
			url = `${base}${editui}`;
		} else if (base && webui && pageStatus === 'archived') {
			url = `${base}${webui}`;
		}

		url = url && localId ? `${url}#block-${localId}` : url;

		return Promise.resolve({
			title,
			url,
			sourceAri: pageAri,
			subType,
		});
	} else {
		return await resolveNoAccessPageInfo(pageAri);
	}
};
