import { logException } from '@atlaskit/editor-common/monitoring';

import { fetchWithRetry } from '../../utils/retry';
import type { TokenData } from '../confluence/fetchMediaToken';

const COMMON_HEADERS = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
};

const AGG_HEADERS = {
	'X-ExperimentalApi': 'confluence-agg-beta',
};

const GRAPHQL_ENDPOINT = '/gateway/api/graphql';
const JIRA_MEDIA_READ_TOKEN_MAX_TOKEN_LENGTH = 2048;

const GET_JIRA_MEDIA_READ_TOKEN_OPERATION_NAME = 'EDITOR_SYNCED_BLOCK_GET_JIRA_MEDIA_TOKEN';

type GetJiraMediaReadTokenResult = {
	data: {
		jira: {
			issueById: {
				mediaReadToken: {
					clientId: string;
					endpointUrl: string;
					tokenLifespanInSeconds: number | null;
					tokensWithFiles: {
						edges: Array<{
							node: {
								token: string;
							} | null;
						} | null> | null;
					} | null;
				} | null;
			} | null;
		} | null;
	};
};

const GET_JIRA_MEDIA_READ_TOKEN_QUERY = `query ${GET_JIRA_MEDIA_READ_TOKEN_OPERATION_NAME}($issueAri: ID!, $maxTokenLength: Int!) {
  jira {
    issueById(id: $issueAri) {
      mediaReadToken(maxTokenLength: $maxTokenLength) @optIn(to: "JiraMediaReadTokenInIssue") {
        clientId
        endpointUrl
        tokenLifespanInSeconds
        tokensWithFiles {
          edges {
            node {
              token
            }
          }
        }
      }
    }
  }
}`;

const getJiraMediaReadToken = async (issueAri: string): Promise<GetJiraMediaReadTokenResult> => {
	const bodyData = {
		query: GET_JIRA_MEDIA_READ_TOKEN_QUERY,
		operationName: GET_JIRA_MEDIA_READ_TOKEN_OPERATION_NAME,
		variables: {
			issueAri,
			maxTokenLength: JIRA_MEDIA_READ_TOKEN_MAX_TOKEN_LENGTH,
		},
	};

	const response = await fetchWithRetry(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { ...COMMON_HEADERS, ...AGG_HEADERS },
		body: JSON.stringify(bodyData),
	});

	if (!response.ok) {
		throw new Error(`Failed to get Jira media read token: ${response.statusText}`);
	}

	return (await response.json()) as GetJiraMediaReadTokenResult;
};

/**
 * Fetches a media read token for a Jira issue, to allow media uploaded to Jira
 * to be rendered in cross-product synced block references (e.g. in Confluence).
 *
 * @param issueAri - the Jira issue ARI (e.g. ari:cloud:jira:{cloudId}:issue/{issueId})
 * @returns TokenData with token, config (clientId + fileStoreUrl), and optional collectionId
 */
export const fetchJiraMediaToken = async (issueAri: string): Promise<TokenData> => {
	try {
		const response = await getJiraMediaReadToken(issueAri);

		const mediaReadToken = response.data?.jira?.issueById?.mediaReadToken;
		const clientId = mediaReadToken?.clientId;
		const endpointUrl = mediaReadToken?.endpointUrl;

		// Use the first available token from tokensWithFiles, or fall back to empty string.
		// A generic read token (without specific file IDs) is sufficient for rendering.
		const token = mediaReadToken?.tokensWithFiles?.edges?.[0]?.node?.token ?? '';

		if (!clientId || !endpointUrl) {
			throw new Error('Missing clientId or endpointUrl');
		}

		return {
			config: {
				clientId,
				fileStoreUrl: endpointUrl,
			},
			token,
		};
	} catch (error) {
		logException(error as Error, {
			location: 'editor-synced-block-provider/fetchJiraMediaToken',
		});
		const errorMsg = error instanceof Error ? error.message : String(error);
		throw new Error(`Failed to get Jira media read token: ${errorMsg}`);
	}
};
