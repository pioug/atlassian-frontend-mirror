import * as testMocks from '../../use-resolve/__tests__/index.test.mock';
import { APIError, type CardState } from '@atlaskit/linking-common';
import { type CardContext } from '@atlaskit/smart-card';
import { mocks } from '../../../../utils/mocks';
import useResponse from '../index';
import { asMockFunction } from '@atlaskit/media-test-helpers';
import { useSmartLinkContext } from '@atlaskit/link-provider';
import { renderHook } from '@testing-library/react-hooks';

describe('useResponse', () => {
	let url: string;
	let mockContext: CardContext;

	beforeEach(() => {
		mockContext = testMocks.mockGetContext();
		asMockFunction(useSmartLinkContext).mockImplementation(() => mockContext);
		url = 'https://some/url';
	});

	const mockState = (state: CardState) => {
		asMockFunction(mockContext.store.getState).mockImplementationOnce(() => ({
			[url]: state,
		}));
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('handleResolvedLinkResponse', () => {
		it('should dispatch resolved response on link success', () => {
			const { handleResolvedLinkResponse } = renderHook(() => useResponse()).result.current;
			handleResolvedLinkResponse(url, mocks.success, false, false);

			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'metadata',
					url: 'https://some/url',
					payload: undefined,
					error: undefined,
					metadataStatus: 'resolved',
				}),
			);

			expect(mockContext.store.dispatch).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'resolved',
					url: 'https://some/url',
					payload: mocks.success,
					error: undefined,
					metadataStatus: undefined,
				}),
			);
		});

		it('should dispatch reloading response on link success when isReloading is true', () => {
			const { handleResolvedLinkResponse } = renderHook(() => useResponse()).result.current;
			handleResolvedLinkResponse(url, mocks.success, true, false);

			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'metadata',
					url: 'https://some/url',
					payload: undefined,
					error: undefined,
					metadataStatus: 'resolved',
				}),
			);

			expect(mockContext.store.dispatch).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'reloading',
					url: 'https://some/url',
					payload: mocks.success,
				}),
			);
		});

		it('should dispatch fallback error for forbidden responses when authFlow is disabled', () => {
			mockContext = {
				...mockContext,
				config: {
					...mockContext.config,
					authFlow: 'disabled',
				},
			};
			const { handleResolvedLinkResponse } = renderHook(() => useResponse()).result.current;
			handleResolvedLinkResponse(url, mocks.forbidden, false, false);

			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(1);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'fallback',
					url: 'https://some/url',
					payload: mocks.forbidden,
					error: new APIError('fallback', 'some', 'Provider.authFlow is not set to OAuth2.'),
				}),
			);
		});

		it('should dispatch fallback error for unauthorized responses when authFlow is disabled', () => {
			mockContext = {
				...mockContext,
				config: {
					...mockContext.config,
					authFlow: 'disabled',
				},
			};
			const { handleResolvedLinkResponse } = renderHook(() => useResponse()).result.current;
			handleResolvedLinkResponse(url, mocks.unauthorized, false, false);

			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(1);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'fallback',
					url: 'https://some/url',
					payload: mocks.unauthorized,
					error: new APIError('fallback', 'some', 'Provider.authFlow is not set to OAuth2.'),
				}),
			);
		});

		const expectToThrowAndDispatchError = (cb: () => void) => {
			expect(cb).toThrow();

			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(1);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'errored',
					url: 'https://some/url',
					payload: undefined,
					error: new APIError('fatal', 'some', 'Fatal error resolving URL'),
				}),
			);
		};

		it('should throw fatal error and dispatch error for an undefined response', () => {
			const { handleResolvedLinkResponse } = renderHook(() => useResponse()).result.current;

			expectToThrowAndDispatchError(() => {
				handleResolvedLinkResponse(url, undefined, false, false);
			});
		});

		it('should dispatch metadata error if isMetadataRequest is true and is an error', () => {
			const { handleResolvedLinkResponse } = renderHook(() => useResponse()).result.current;
			handleResolvedLinkResponse(url, mocks.notFound, false, true);

			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(1);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'metadata',
					url: 'https://some/url',
					payload: undefined,
					metadataStatus: 'errored',
					error: undefined,
				}),
			);
		});
	});

	describe('handleResolvedLinkError', () => {
		it('should return error metadata status if isMetadataRequest is true', () => {
			const apiError = new APIError('error', 'hostname', 'errormessage');
			const { handleResolvedLinkError } = renderHook(() => useResponse()).result.current;
			handleResolvedLinkError(url, apiError, undefined, true);

			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(1);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'metadata',
					url: 'https://some/url',
					payload: undefined,
					metadataStatus: 'errored',
					error: undefined,
				}),
			);
		});

		it('should dispatch successful resolve response when store has existing data with fatal error', () => {
			const state: CardState = {
				status: 'pending',
				details: {
					meta: {
						access: 'granted',
						visibility: 'public',
					},
					data: {
						'@context': {
							'@vocab': 'https://www.w3.org/ns/activitystreams#',
							atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
							schema: 'http://schema.org/',
						},
						'@type': 'Object',
						name: 'I love cheese',
						url: 'https://some.url',
					},
				},
			};
			mockState(state);
			const { handleResolvedLinkError } = renderHook(() => useResponse()).result.current;
			const apiError = new APIError('fatal', 'hostname', 'this is an error message');
			handleResolvedLinkError(url, apiError, undefined, false);

			expect(mockContext.store.dispatch).toHaveBeenCalledTimes(1);
			expect(mockContext.store.dispatch).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'resolved',
					url: 'https://some/url',
					error: undefined,
					payload: state.details,
				}),
			);
		});
	});
});
