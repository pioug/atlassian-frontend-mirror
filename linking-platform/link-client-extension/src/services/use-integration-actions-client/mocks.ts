import type { ExecuteIntegrationActionGraphQLResponse } from './types';

/**
 * Mock AGG `actions { execute }` responses, based on what the ASIMO-5527 spike saw
 * on staging.
 */

export const mockExecuteIntegrationActionSuccessResponse: ExecuteIntegrationActionGraphQLResponse =
	{
		data: {
			actions: {
				execute: {
					status: 200,
					outputs: {
						entities: {
							comments: [
								{
									id: 'comment-1',
									content: 'Looks good to me',
									author: { displayName: 'Jane Smith' },
									createdTime: '2026-10-27T01:00:00.000Z',
								},
							],
						},
					},
				},
			},
		},
	};

export const mockAuthUrl = 'https://id.atlassian.com/outboundAuth/start?key=google-drive';

/** IS returns consent errors in `outputs.errors` with HTTP 200 and no GraphQL `errors`. */
export const mockExecuteIntegrationActionConsentRequiredResponse: ExecuteIntegrationActionGraphQLResponse =
	{
		data: {
			actions: {
				execute: {
					status: 401,
					outputs: {
						errors: [
							{
								message: 'User consent is required to access this integration',
								statusCode: 401,
								extensions: {
									errorType: 'USER_CONSENT_REQUIRED',
									errorCategory: 'AUTH',
									retryable: false,
									authUrl: mockAuthUrl,
								},
							},
						],
					},
				},
			},
		},
	};

export const mockExecuteIntegrationActionOperationFailureResponse: ExecuteIntegrationActionGraphQLResponse =
	{
		data: {
			actions: {
				execute: {
					status: 404,
					outputs: {
						errors: [
							{
								message: 'File not found',
								statusCode: 404,
								extensions: {
									errorType: 'NOT_FOUND',
									errorCategory: 'CLIENT',
									retryable: false,
								},
							},
						],
					},
				},
			},
		},
	};

export const mockExecuteIntegrationActionGraphQLErrorResponse: ExecuteIntegrationActionGraphQLResponse =
	{
		data: { actions: { execute: null } },
		errors: [
			{
				message: 'Action not found for filter',
				path: ['actions', 'execute'],
				extensions: { classification: 'DataFetchingException', statusCode: 400 },
			},
		],
	};
