/* eslint-disable require-unicode-regexp  */
import { type RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SyncBlockSourceInfo } from '../../providers/types';
import { getSourceInfoErrorPayload } from '../../utils/errorHandling';
import { fetchWithRetry } from '../../utils/retry';

import { getPageIdAndTypeFromConfluencePageAri } from './ari';
import { isBlogPageType } from './utils';

type UnpublishedPageResponse = {
	_links?: {
		base?: string;
		edituiv2?: string;
	};
	title?: string;
	subtype?: string | null;
};

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
				};
				space: {
					key: string;
				};
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
const GET_SOURCE_INFO_QUERY = `query ${GET_SOURCE_INFO_OPERATION_NAME} ($id: ID!) {
	content (id: $id) {
		nodes {
			id
			links {
				base
			}
			space {
				key
			}
			subType
			title
		}
	}
}`;

const getConfluenceSourceInfo = async (ari: string): Promise<GetSourceInfoResult> => {
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

/**
 * Fetches unpublished page info from the v2 pages API
 * Used when the GraphQL query returns empty content.nodes for unpublished pages
 * @param pageAri - The page ARI
 * @param localId - Optional local ID to append as block anchor
 * @returns Source info with URL, title, and optional subtype
 */
const fetchUnpublishedConfluencePageInfo = async (
	pageAri: string,
	localId?: string,
): Promise<SyncBlockSourceInfo | undefined> => {
	try {
		const { id: pageId } = getPageIdAndTypeFromConfluencePageAri({ ari: pageAri });

		const response = await fetchWithRetry(`/wiki/api/v2/pages/${pageId}?draft=true`, {
			method: 'GET',
			headers: COMMON_HEADERS,
		});

		if (!response.ok) {
			throw new Error(`Failed to get unpublished page info: ${response.statusText}`);
		}

		const pageData = (await response.json()) as UnpublishedPageResponse;

		const base = pageData._links?.base;
		const edituiv2 = pageData._links?.edituiv2;
		const title = pageData.title;
		const subType = pageData.subtype;

		let url: string | undefined;
		if (base && edituiv2) {
			url = `${base}${edituiv2}`;
			url = url && localId ? `${url}#block-${localId}` : url;
		}

		return {
			title,
			url,
			sourceAri: pageAri,
			subType,
		};
	} catch (error) {
		logException(error as Error, {
			location: 'editor-synced-block-provider/sourceInfo/fetchUnpublishedConfluencePageInfo',
		});
		return Promise.resolve(undefined);
	}
};

export const fetchConfluencePageInfoOld = async (
	pageAri: string,
	localId?: string,
	fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
): Promise<SyncBlockSourceInfo | undefined> => {
	try {
		const { type: pageType } = getPageIdAndTypeFromConfluencePageAri({ ari: pageAri });
		const response = await getConfluenceSourceInfo(pageAri);

		const contentData = response.data?.content?.nodes?.[0];
		const title = contentData?.title;

		let url;
		const { base } = contentData?.links || {};
		if (base && contentData?.space?.key && contentData?.id) {
			if (isBlogPageType(pageType)) {
				url = `${base}/spaces/${contentData.space.key}/blog/edit-v2/${contentData.id}`;
			} else if (contentData.subType === 'live') {
				url = `${base}/spaces/${contentData.space.key}/pages/${contentData.id}`;
			} else {
				url = `${base}/spaces/${contentData.space.key}/pages/edit-v2/${contentData.id}`;
			}
		}

		url = url && localId ? `${url}#block-${localId}` : url;

		if (!title || !url) {
			fireAnalyticsEvent?.(getSourceInfoErrorPayload('Failed to get confluence page source info'));
		}

		return Promise.resolve({ title, url, sourceAri: pageAri });
	} catch (error) {
		logException(error as Error, {
			location: 'editor-synced-block-provider/sourceInfo',
		});
		fireAnalyticsEvent?.(getSourceInfoErrorPayload((error as Error).message));
		return Promise.resolve(undefined);
	}
};

export const fetchConfluencePageInfo = async (
	pageAri: string,
	hasAccess: boolean,
	urlType: 'view' | 'edit',
	localId?: string,
	isUnpublished?: boolean,
): Promise<SyncBlockSourceInfo | undefined> => {
	// For unpublished pages, use the v2 pages API as GraphQL returns empty content.nodes
	if (isUnpublished && fg('platform_synced_block_patch_1')) {
		return await fetchUnpublishedConfluencePageInfo(pageAri, localId);
	}

	if (hasAccess) {
		const { type: pageType } = getPageIdAndTypeFromConfluencePageAri({ ari: pageAri });
		const response = await getConfluenceSourceInfo(pageAri);

		const contentData = response.data?.content?.nodes?.[0];
		const { title, subType } = contentData || {};

		let url;
		const { base } = contentData?.links || {};
		if (base && contentData?.space?.key && contentData?.id) {
			if (isBlogPageType(pageType)) {
				url = `${base}/spaces/${contentData.space.key}/blog${
					urlType === 'edit' ? '/edit-v2' : ''
				}/${contentData.id}`;
			} else if (contentData.subType === 'live') {
				url = `${base}/spaces/${contentData.space.key}/pages/${contentData.id}`;
			} else {
				url = `${base}/spaces/${contentData.space.key}/pages${
					urlType === 'edit' ? '/edit-v2' : ''
				}/${contentData.id}`;
			}
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
