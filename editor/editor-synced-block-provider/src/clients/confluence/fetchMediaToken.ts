import { logException } from '@atlaskit/editor-common/monitoring';

import { fetchWithRetry } from '../../utils/retry';

const COMMON_HEADERS = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
};

const AGG_HEADERS = {
	'X-ExperimentalApi': 'confluence-agg-beta',
};

const GRAPHQL_ENDPOINT = '/gateway/api/graphql';

const GET_CONTENT_MEDIA_SESSION_OPERATION_NAME = 'MediaUploadTokenQuery';

type GetContentMediaSessionResult = {
	data: {
		contentMediaSession: {
			collection: string;
			configuration: {
				clientId: string;
				fileStoreUrl: string;
			};
			token: {
				value: string;
			};
		};
	};
};

const GET_CONTENT_MEDIA_SESSION_QUERY = `query ${GET_CONTENT_MEDIA_SESSION_OPERATION_NAME}($contentId: ID!) {
	contentMediaSession(contentId: $contentId) {
		token {
			value
		}
		configuration {
			clientId
			fileStoreUrl
		}
		collection
	}
}`;

const getContentMediaSession = async (contentId: string): Promise<GetContentMediaSessionResult> => {
	const bodyData = {
		query: GET_CONTENT_MEDIA_SESSION_QUERY,
		operationName: GET_CONTENT_MEDIA_SESSION_OPERATION_NAME,
		variables: {
			contentId: contentId,
		},
	};

	const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { ...COMMON_HEADERS, ...AGG_HEADERS },
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new Error(`Failed to get content media session: ${response.statusText}`);
	}

	const result = (await response.json()) as GetContentMediaSessionResult;
	return result;
};

type ConfigData = {
	readonly clientId: string;
	readonly fileStoreUrl: string;
};

type TokenData = {
	collectionId?: string;
	config: ConfigData;
	token: string;
};

export const fetchMediaToken = async (contentId: string): Promise<TokenData> => {
	try {
		const response = await getContentMediaSession(contentId);

		const contentData = response.data?.contentMediaSession;
		const token = contentData?.token?.value;
		const configuration = contentData?.configuration;
		const collection = contentData?.collection;

		if (!token || !configuration || !collection) {
			throw new Error('Failed to get content media session data');
		}

		return Promise.resolve({ config: configuration, token, collectionId: collection });
	} catch (error) {
		logException(error as Error, {
			location: 'editor-synced-block-provider/fetchMediaToken',
		});
		throw new Error(`Failed to get content media session: ${error}`);
	}
};
