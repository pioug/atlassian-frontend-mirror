import { renderHook } from '@testing-library/react-hooks';

import { CardClient } from '@atlaskit/link-provider';
import { NetworkError } from '@atlaskit/linking-common';
import {
	InvokeError,
	type InvokeRequest,
	SmartLinkActionType,
	type StatusUpdateActionPayload,
} from '@atlaskit/linking-types';

import { useSmartLinkClientExtension } from './index';

describe('useSmartLinkClientExtension', () => {
	let mockFetch: jest.Mock;

	beforeEach(() => {
		jest.resetModules();
		mockFetch = jest.fn();
		(global as any).fetch = mockFetch;
	});

	it('returns smart card client extension methods', () => {
		const { result } = renderHook(() => {
			const cardClient = new CardClient();
			return useSmartLinkClientExtension(cardClient);
		});

		expect(result.current).toEqual({
			invoke: expect.any(Function),
		});
	});

	describe('invoke', () => {
		const commonTests = (data: InvokeRequest) => {
			it('makes request to /invoke', async () => {
				mockFetch.mockResolvedValueOnce({
					json: async () => undefined,
					ok: true,
					text: async () => undefined,
				});

				const { result } = renderHook(() => {
					const cardClient = new CardClient();
					return useSmartLinkClientExtension(cardClient);
				});
				await result.current.invoke(data);

				expect(mockFetch).toHaveBeenNthCalledWith(1, expect.stringContaining('/invoke'), {
					body: JSON.stringify(data),
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'Cache-Control': 'no-cache',
						'Content-Type': 'application/json',
					},
					method: 'post',
				});
			});

			it('returns error response', async () => {
				const error = new Error();
				mockFetch.mockRejectedValueOnce(error);

				const { result } = renderHook(() => {
					const cardClient = new CardClient();
					return useSmartLinkClientExtension(cardClient);
				});

				await expect(result.current.invoke(data)).rejects.toBe(error);
			});

			it.each([
				...[
					400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417,
					421, 422, 423, 424, 425, 426, 428, 429, 431, 451, 500, 501, 502, 503, 504, 505, 506, 507,
					508, 511,
				].map((status) => [status]),
			])('throws %s response', async (status: number) => {
				const expectedResponse = { ok: false, status };
				mockFetch.mockResolvedValueOnce(expectedResponse);

				const { result } = renderHook(() => {
					const cardClient = new CardClient();
					return useSmartLinkClientExtension(cardClient);
				});

				await expect(result.current.invoke(data)).rejects.toBe(expectedResponse);
			});

			it('throws network error on string error', async () => {
				const errorMessage = 'API is down';
				mockFetch.mockRejectedValueOnce(errorMessage);

				const { result } = renderHook(() => {
					const cardClient = new CardClient();
					return useSmartLinkClientExtension(cardClient);
				});

				await expect(result.current.invoke(data)).rejects.toThrow(new NetworkError(errorMessage));
			});

			it('throws network error response on TypeError', async () => {
				const error = TypeError('null has no properties');
				mockFetch.mockRejectedValueOnce(error);

				const { result } = renderHook(() => {
					const cardClient = new CardClient();
					return useSmartLinkClientExtension(cardClient);
				});

				await expect(result.current.invoke(data)).rejects.toThrow(new NetworkError(error));
			});

			it('returns InvokeError for unexpected response statuses', async () => {
				const errorResponse = {
					error: {
						message: 'Field Labels is required.',
						status: 400,
						title: 'JiraObjectProvider.JiraCustomError',
					},
				};

				const error = new Response(
					new Blob([JSON.stringify(errorResponse)], {
						type: 'application/json',
					}),
					{ status: 400 },
				);
				mockFetch.mockRejectedValueOnce(error);

				const { result } = renderHook(() => {
					const cardClient = new CardClient();
					return useSmartLinkClientExtension(cardClient);
				});

				await expect(result.current.invoke(data)).rejects.toThrow(
					new InvokeError('Field Labels is required.', 400),
				);
			});

			it('throws error if provided with invalid json', async () => {
				const invalidJson = '{';

				const error = new Response(
					new Blob([invalidJson], {
						type: 'application/json',
					}),
					{ status: 400 },
				);
				mockFetch.mockRejectedValueOnce(error);

				const { result } = renderHook(() => {
					const cardClient = new CardClient();
					return useSmartLinkClientExtension(cardClient);
				});

				// NODE_UPGRADE_CLEANUP
				if (process.version === 'v22.17.1') {
					await expect(result.current.invoke(data)).rejects.toThrow(
						new InvokeError(
							`Expected property name or '}' in JSON at position 1 (line 1 column 2)`,
							400,
						),
					);
				} else {
					await expect(result.current.invoke(data)).rejects.toThrow(
						new InvokeError(`Expected property name or '}' in JSON at position 1`, 400),
					);
				}
			});
		};

		describe(SmartLinkActionType.GetStatusTransitionsAction, () => {
			const data: InvokeRequest = {
				action: {
					actionType: SmartLinkActionType.GetStatusTransitionsAction,
					resourceIdentifiers: {},
				},
				providerKey: 'jira-object-provider',
			};

			commonTests(data);

			it('returns success response', async () => {
				const expectedResponse = {
					transitions: [
						{ id: '1', name: 'In Progress', appearance: 'inprogress' },
						{ id: '2', name: 'Done', appearance: 'success' },
					],
				};
				mockFetch.mockResolvedValueOnce({
					body: '{}',
					json: async () => expectedResponse,
					ok: true,
					text: async () => JSON.stringify(expectedResponse),
				});

				const { result } = renderHook(() => {
					const cardClient = new CardClient();
					return useSmartLinkClientExtension(cardClient);
				});
				const response = await result.current.invoke(data);

				expect(response).toEqual(expectedResponse);
			});
		});

		describe(SmartLinkActionType.StatusUpdateAction, () => {
			const data: InvokeRequest<StatusUpdateActionPayload> = {
				action: {
					actionType: SmartLinkActionType.StatusUpdateAction,
					resourceIdentifiers: {},
					payload: {
						newStatusId: '1',
					},
				},
				providerKey: 'jira-object-provider',
			};

			commonTests(data);

			// FIXME: Jest upgrade
			// NetworkError: TypeError: response.text is not a function
			it.skip('returns success response', async () => {
				mockFetch.mockResolvedValueOnce({ ok: true });

				const { result } = renderHook(() => {
					const cardClient = new CardClient();
					return useSmartLinkClientExtension(cardClient);
				});

				await expect(() => result.current.invoke(data)).not.toThrow();
			});
		});
	});
});
