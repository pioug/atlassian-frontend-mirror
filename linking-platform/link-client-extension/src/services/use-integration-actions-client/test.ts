import { renderHook } from '@testing-library/react';

import CardClient from '@atlaskit/link-provider/client';
import type { ProductType } from '@atlaskit/linking-common/types';

import {
	EXECUTE_INTEGRATION_ACTION_MUTATION,
	EXECUTE_INTEGRATION_ACTION_OPERATION_NAME,
} from './constants';
import { getAggUrl } from './get-agg-url';
import { useIntegrationActionsClient } from './index';
import { IntegrationActionError } from './integration-action-error';
import {
	mockAuthUrl,
	mockExecuteIntegrationActionConsentRequiredResponse,
	mockExecuteIntegrationActionGraphQLErrorResponse,
	mockExecuteIntegrationActionOperationFailureResponse,
	mockExecuteIntegrationActionSuccessResponse,
} from './mocks';
import { parseExecuteIntegrationActionResponse } from './parse-execute-integration-action-response';
import type { ExecuteIntegrationActionRequest } from './types';

const data: ExecuteIntegrationActionRequest = {
	actionTypeKey: 'atlassian::custom:action',
	filter: { actionId: 'google-drive:list-comments', integrationKey: 'google-drive' },
	actionInput: {
		cloudId: 'cloud-id',
		inputs: { fileId: 'file-id' },
		target: { url: 'https://docs.google.com/document/d/file-id/edit' },
	},
};

const mockJsonResponse = (body: unknown, status = 200) => ({
	ok: status >= 200 && status < 300,
	status,
	json: async () => body,
	text: async () => JSON.stringify(body),
});

const setup = (cardClient: CardClient = new CardClient(), product?: ProductType) =>
	renderHook(() => useIntegrationActionsClient(cardClient, { product })).result.current;

const getRequestHeaders = (mockFetch: jest.Mock): Record<string, string> =>
	mockFetch.mock.calls[0][1].headers;

const getAttribution = (mockFetch: jest.Mock): Record<string, unknown> =>
	JSON.parse(getRequestHeaders(mockFetch)['atl-attribution']);

const getError = async (promise: Promise<unknown>): Promise<IntegrationActionError> => {
	try {
		await promise;
	} catch (error) {
		return error as IntegrationActionError;
	}
	throw new Error('Expected promise to reject');
};

describe('useIntegrationActionsClient', () => {
	let mockFetch: jest.Mock;

	beforeEach(() => {
		mockFetch = jest.fn();
		(global as any).fetch = mockFetch;
	});

	it('returns the client methods', () => {
		expect(setup()).toEqual({ executeAction: expect.any(Function) });
	});

	describe('executeAction', () => {
		it('posts the execute mutation to same-origin AGG', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse(mockExecuteIntegrationActionSuccessResponse),
			);

			await setup().executeAction(data);

			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(mockFetch).toHaveBeenCalledWith(
				`${window.location.origin}/gateway/api/graphql?operationName=${EXECUTE_INTEGRATION_ACTION_OPERATION_NAME}`,
				{
					body: JSON.stringify({
						operationName: EXECUTE_INTEGRATION_ACTION_OPERATION_NAME,
						query: EXECUTE_INTEGRATION_ACTION_MUTATION,
						variables: {
							actionTypeKey: data.actionTypeKey,
							filter: data.filter,
							actionInput: data.actionInput,
						},
					}),
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'Cache-Control': 'no-cache',
						'Content-Type': 'application/json',
						'atl-attribution': JSON.stringify({
							tenantId: 'cloud-id',
							service: 'link-client-extension',
						}),
					},
					method: 'post',
				},
			);
		});

		it('sends the GTM product name in the attribution header', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse(mockExecuteIntegrationActionSuccessResponse),
			);

			await setup(new CardClient(), 'CONFLUENCE').executeAction(data);

			expect(getAttribution(mockFetch)).toEqual({
				tenantId: 'cloud-id',
				product: 'Confluence Cloud',
				service: 'link-client-extension',
			});
		});

		it('leaves product out of the attribution header when it has no GTM name', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse(mockExecuteIntegrationActionSuccessResponse),
			);

			await setup(new CardClient(), 'ELEVATE').executeAction(data);

			expect(getAttribution(mockFetch)).not.toHaveProperty('product');
		});

		it('sends a null tenantId when there is no cloudId', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse(mockExecuteIntegrationActionSuccessResponse),
			);

			await setup().executeAction({ ...data, actionInput: { inputs: { fileId: 'file-id' } } });

			expect(getAttribution(mockFetch)).toEqual({
				tenantId: null,
				service: 'link-client-extension',
			});
		});

		it('uses the Stargate AGG endpoint when the CardClient has an envKey', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse(mockExecuteIntegrationActionSuccessResponse),
			);

			await setup(new CardClient('stg')).executeAction(data);

			expect(mockFetch).toHaveBeenCalledWith(
				`https://pug.jira-dev.com/gateway/api/graphql?operationName=${EXECUTE_INTEGRATION_ACTION_OPERATION_NAME}`,
				expect.any(Object),
			);
		});

		it('passes workspace through to the mutation variables', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse(mockExecuteIntegrationActionSuccessResponse),
			);

			await setup().executeAction({ ...data, workspace: 'workspace-ari' });

			const { variables } = JSON.parse(mockFetch.mock.calls[0][1].body);
			expect(variables.workspace).toBe('workspace-ari');
		});

		it('passes all filter and action input fields through to the mutation variables', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse(mockExecuteIntegrationActionSuccessResponse),
			);
			const request: ExecuteIntegrationActionRequest = {
				actionTypeKey: 'atlassian:document:comment:list',
				filter: {
					actionAri: 'ari:cloud:actions::action/google-drive/list-comments',
					authType: ['THREE_LEGGED'],
					extensionAri: 'ari:cloud:ecosystem::extension/extension-id',
					oauthClientId: 'oauth-client-id',
					providerId: 'provider-id',
				},
				actionInput: {
					meta: { source: 'smart-card' },
					target: { ids: { fileId: 'file-id' } },
				},
			};

			await setup().executeAction(request);

			const { variables } = JSON.parse(mockFetch.mock.calls[0][1].body);
			expect(variables).toEqual({
				actionTypeKey: request.actionTypeKey,
				filter: request.filter,
				actionInput: request.actionInput,
			});
		});

		it('resolves with the status and outputs', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse(mockExecuteIntegrationActionSuccessResponse),
			);

			const response = await setup().executeAction(data);

			expect(response).toEqual({
				status: 200,
				outputs: mockExecuteIntegrationActionSuccessResponse.data?.actions?.execute?.outputs,
			});
		});

		it('throws a consent-required error with the auth URL', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse(mockExecuteIntegrationActionConsentRequiredResponse),
			);

			const error = await getError(setup().executeAction(data));

			expect(error).toBeInstanceOf(IntegrationActionError);
			expect(error).toMatchObject({
				kind: 'consent-required',
				authUrl: mockAuthUrl,
				errorType: 'USER_CONSENT_REQUIRED',
				retryable: false,
				statusCode: 401,
				message: 'User consent is required to access this integration',
			});
		});

		it('throws an operation error when IS reports the action failed', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse(mockExecuteIntegrationActionOperationFailureResponse),
			);

			const error = await getError(setup().executeAction(data));

			expect(error).toMatchObject({
				kind: 'operation',
				errorType: 'NOT_FOUND',
				statusCode: 404,
				message: 'File not found',
				authUrl: undefined,
			});
			expect(error.operationErrors).toHaveLength(1);
		});

		it('throws a graphql error when AGG returns errors and no result', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse(mockExecuteIntegrationActionGraphQLErrorResponse),
			);

			const error = await getError(setup().executeAction(data));

			expect(error).toMatchObject({
				kind: 'graphql',
				message: 'Action not found for filter',
				errorType: 'DataFetchingException',
				statusCode: 200,
			});
			expect(error.graphQLErrors).toHaveLength(1);
		});

		it('reads GraphQL errors from a non-2xx response body', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse(mockExecuteIntegrationActionGraphQLErrorResponse, 400),
			);

			const error = await getError(setup().executeAction(data));

			expect(error).toMatchObject({
				kind: 'graphql',
				message: 'Action not found for filter',
				statusCode: 400,
			});
		});

		it('rejects partial data returned alongside GraphQL errors', async () => {
			mockFetch.mockResolvedValueOnce(
				mockJsonResponse({
					data: { actions: { execute: { status: 200, outputs: null } } },
					errors: [{ message: 'Failed to fetch outputs', path: ['actions', 'execute', 'outputs'] }],
				}),
			);

			const error = await getError(setup().executeAction(data));

			expect(error).toMatchObject({
				kind: 'graphql',
				message: 'Failed to fetch outputs',
				statusCode: 200,
			});
		});

		it('throws an http error for a non-2xx response without GraphQL errors', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 503,
				json: async () => {
					throw new SyntaxError('Unexpected token');
				},
			});

			const error = await getError(setup().executeAction(data));

			expect(error).toMatchObject({
				kind: 'http',
				statusCode: 503,
				message: 'Request failed with status 503',
			});
		});

		it('throws an http error with the original error when the request fails', async () => {
			mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

			const error = await getError(setup().executeAction(data));

			expect(error).toBeInstanceOf(IntegrationActionError);
			expect(error.kind).toBe('http');
			expect(error.statusCode).toBeUndefined();
			// `request` from linking-common wraps network errors in a new Error.
			expect(error.originalError).toBeInstanceOf(Error);
			expect((error.originalError as Error).message).toContain('Failed to fetch');
		});
	});
});

describe('getAggUrl', () => {
	const query = `?operationName=${EXECUTE_INTEGRATION_ACTION_OPERATION_NAME}`;

	it('uses same-origin AGG when there is no envKey', () => {
		expect(getAggUrl()).toBe(`${window.location.origin}/gateway/api/graphql${query}`);
	});

	it.each([
		['stg', 'https://pug.jira-dev.com/gateway/api/graphql'],
		['dev', 'https://api-private.dev.atlassian.com/graphql'],
		['prod', 'https://api-private.atlassian.com/graphql'],
	] as const)('uses the Stargate AGG endpoint for %s', (envKey, expected) => {
		expect(getAggUrl(envKey)).toBe(`${expected}${query}`);
	});

	it('uses the relative edge proxy path for the custom environment', () => {
		// For `custom`, baseUrlOverride is a full object resolver URL, so it can't be used to build
		// an AGG URL.
		expect(getAggUrl('custom')).toBe(`/gateway/api/graphql${query}`);
	});

	it('ignores baseUrlOverride for the custom environment', async () => {
		const mockFetch = jest
			.fn()
			.mockResolvedValueOnce(mockJsonResponse(mockExecuteIntegrationActionSuccessResponse));
		(global as any).fetch = mockFetch;

		await setup(new CardClient('custom', 'https://ors.internal/object-resolver')).executeAction(
			data,
		);

		expect(mockFetch.mock.calls[0][0]).toBe(`/gateway/api/graphql${query}`);
	});
});

describe('parseExecuteIntegrationActionResponse', () => {
	const parseError = (body: Parameters<typeof parseExecuteIntegrationActionResponse>[0]) => {
		try {
			parseExecuteIntegrationActionResponse(body);
		} catch (error) {
			return error as IntegrationActionError;
		}
		throw new Error('Expected parse to throw');
	};

	it('throws a graphql error when the body is empty', () => {
		expect(parseError(undefined)).toMatchObject({
			kind: 'graphql',
			message: 'No action result returned',
		});
	});

	it('throws an operation error for a non-2xx status without errors', () => {
		expect(
			parseError({ data: { actions: { execute: { status: 500, outputs: {} } } } }),
		).toMatchObject({ kind: 'operation', statusCode: 500 });
	});

	it('treats a consent error in GraphQL extensions as consent-required', () => {
		expect(
			parseError({
				data: { actions: { execute: null } },
				errors: [{ message: 'Consent required', extensions: { authUrl: mockAuthUrl } }],
			}),
		).toMatchObject({ kind: 'consent-required', authUrl: mockAuthUrl });
	});

	it('keeps consent-required from GraphQL errors returned with partial data', () => {
		expect(
			parseError({
				data: { actions: { execute: { status: 200, outputs: null } } },
				errors: [
					{
						message: 'Consent required',
						path: ['actions', 'execute', 'outputs'],
						extensions: { authUrl: mockAuthUrl },
					},
				],
			}),
		).toMatchObject({ kind: 'consent-required', authUrl: mockAuthUrl });
	});

	it('prefers IS operation errors over GraphQL errors', () => {
		expect(
			parseError({
				data: {
					actions: {
						execute: { status: 404, outputs: { errors: [{ message: 'File not found' }] } },
					},
				},
				errors: [{ message: 'Partial failure', extensions: { authUrl: mockAuthUrl } }],
			}),
		).toMatchObject({ kind: 'operation', message: 'File not found', authUrl: undefined });
	});

	it('uses the consent error when IS returns several errors', () => {
		expect(
			parseError({
				data: {
					actions: {
						execute: {
							status: 401,
							outputs: {
								errors: [
									{ message: 'Something else' },
									{
										message: 'Consent required',
										extensions: { errorType: 'USER_CONSENT_REQUIRED', authUrl: mockAuthUrl },
									},
								],
							},
						},
					},
				},
			}),
		).toMatchObject({
			kind: 'consent-required',
			message: 'Consent required',
			authUrl: mockAuthUrl,
			statusCode: 401,
		});
	});

	it('reports USER_CONSENT_REQUIRED without an auth URL as an operation error', () => {
		expect(
			parseError({
				data: {
					actions: {
						execute: {
							status: 401,
							outputs: {
								errors: [
									{
										message: 'Consent required',
										extensions: { errorType: 'USER_CONSENT_REQUIRED' },
									},
								],
							},
						},
					},
				},
			}),
		).toMatchObject({ kind: 'operation', errorType: 'USER_CONSENT_REQUIRED', authUrl: undefined });
	});

	it.each([
		['an entry without a message', [{ code: 'NOT_FOUND' }]],
		['a non-object entry', [42]],
		['an empty message', [{ message: '' }]],
	])('throws an operation error for %s in outputs.errors', (_, errors) => {
		expect(
			parseError({ data: { actions: { execute: { status: 200, outputs: { errors } } } } }),
		).toMatchObject({ kind: 'operation', message: 'Action failed', statusCode: 200 });
	});

	it('uses a string entry in outputs.errors as the message', () => {
		expect(
			parseError({
				data: { actions: { execute: { status: 200, outputs: { errors: ['Quota exceeded'] } } } },
			}),
		).toMatchObject({ kind: 'operation', message: 'Quota exceeded' });
	});

	it('ignores extension values with the wrong type', () => {
		expect(
			parseError({
				data: {
					actions: {
						execute: {
							status: 500,
							outputs: {
								errors: [{ message: 'Oops', extensions: { errorType: 1, retryable: 'yes' } }],
							},
						},
					},
				},
			}),
		).toMatchObject({ kind: 'operation', errorType: undefined, retryable: undefined });
	});

	it.each([
		['a javascript: URL', 'javascript:alert(1)'],
		['an http: URL', 'http://id.atlassian.com/outboundAuth/start'],
		['a relative URL', '/outboundAuth/start'],
	])('ignores %s as an IS auth URL', (_, authUrl) => {
		expect(
			parseError({
				data: {
					actions: {
						execute: {
							status: 401,
							outputs: {
								errors: [
									{
										message: 'Consent required',
										extensions: { errorType: 'USER_CONSENT_REQUIRED', authUrl },
									},
								],
							},
						},
					},
				},
			}),
		).toMatchObject({ kind: 'operation', authUrl: undefined });
	});

	it('ignores a non-https auth URL in GraphQL extensions', () => {
		expect(
			parseError({
				errors: [{ message: 'Consent required', extensions: { authUrl: 'javascript:alert(1)' } }],
			}),
		).toMatchObject({ kind: 'graphql', authUrl: undefined });
	});

	it('normalises malformed GraphQL errors instead of crashing', () => {
		const error = parseError({
			errors: [null, { code: 'BAD' }, 'Rate limited'] as unknown as { message: string }[],
		});

		expect(error).toBeInstanceOf(IntegrationActionError);
		expect(error).toMatchObject({
			kind: 'graphql',
			message: 'GraphQL error; GraphQL error; Rate limited',
		});
		expect(error.graphQLErrors).toEqual([
			{ message: 'GraphQL error' },
			{ message: 'GraphQL error' },
			{ message: 'Rate limited' },
		]);
	});

	it('rejects with an IntegrationActionError for malformed GraphQL errors', async () => {
		(global as any).fetch = jest
			.fn()
			.mockResolvedValueOnce(mockJsonResponse({ data: null, errors: [null] }));

		const error = await getError(setup().executeAction(data));

		expect(error).toBeInstanceOf(IntegrationActionError);
		expect(error).toMatchObject({ kind: 'graphql', message: 'GraphQL error' });
	});

	it('resolves when outputs have no errors and status is missing', () => {
		expect(
			parseExecuteIntegrationActionResponse({
				data: { actions: { execute: { outputs: { ok: true } } } },
			}),
		).toEqual({ status: undefined, outputs: { ok: true } });
	});

	it('ignores an empty outputs.errors array', () => {
		expect(
			parseExecuteIntegrationActionResponse({
				data: { actions: { execute: { status: 200, outputs: { errors: [] } } } },
			}),
		).toEqual({ status: 200, outputs: { errors: [] } });
	});
});
