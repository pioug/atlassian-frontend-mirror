/* eslint-disable require-unicode-regexp  */

import type { SyncBlockSourceInfo } from '../providers/types';

import { getPageIdAndTypeFromAri } from './ari';
import { isBlogPageType } from './utils';

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

const getSourceInfo = async (ari: string): Promise<GetSourceInfoResult> => {
	const bodyData = {
		query: GET_SOURCE_INFO_QUERY,
		operationName: GET_SOURCE_INFO_OPERATION_NAME,
		variables: {
			id: ari,
		},
	};

	const response = await fetch(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { ...COMMON_HEADERS, ...AGG_HEADERS },
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new Error(`Failed to get url: ${response.statusText}`);
	}

	return (await response.json()) as GetSourceInfoResult;
};

export const fetchSourceInfo = async (
	ari: string,
	localId?: string,
): Promise<SyncBlockSourceInfo | undefined> => {
	try {
		const { type: pageType } = getPageIdAndTypeFromAri(ari);
		const response = await getSourceInfo(ari);

		const contentData = response.data?.content?.nodes?.[0];
		if (!contentData) {
			throw new Error(`Failed to get content data`);
		}

		const title = contentData.title;

		let url;
		const { base } = contentData.links || {};
		if (base && contentData.space?.key && contentData.id) {
			if (isBlogPageType(pageType)) {
				url = `${base}/spaces/${contentData.space.key}/blog/edit-v2/${contentData.id}`;
			} else if (contentData.subType === 'live') {
				url = `${base}/spaces/${contentData.space.key}/pages/${contentData.id}`;
			} else {
				url = `${base}/spaces/${contentData.space.key}/pages/edit-v2/${contentData.id}`;
			}
		}

		url = url && localId ? `${url}#block-${localId}` : url;

		return Promise.resolve({ title, url });
	} catch (error) {
		// TODO: EDITOR-1921 - add error analytics
		return Promise.resolve(undefined);
	}
};
