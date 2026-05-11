import { act, renderHook } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { generateUrlWithParams } from '../src/generateUrlWithParams';
import GlobalInteractionSessionTracking, {
	type InteractionSessionTracking,
} from '../src/globalInteractionSessionTracking';
import useCrossProductUrl, {
	INTERACTION_SESSION_ID_UPDATED_EVENT,
} from '../src/useCrossProductUrlWrapper';

const getInstanceMock = jest.spyOn(GlobalInteractionSessionTracking, 'getInstance');

const expectedUrl = 'http://some.url/';
jest.mock('../src/generateUrlWithParams');
(generateUrlWithParams as jest.Mock).mockImplementation(() => expectedUrl);

describe('useCrossProductUrlWrapper', () => {
	const mockGetCurrentInteractionSessionId = jest.fn();
	const mockInteractionSessionTracking: InteractionSessionTracking = {
		getCurrentInteractionSessionId() {
			return mockGetCurrentInteractionSessionId();
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockGetCurrentInteractionSessionId.mockReset();
	});

	ffTest.on('atlaskit-analytics-cross-product', 'Feature flag on', () => {
		describe('Global interaction session tracking already exists on window', () => {
			beforeEach(() => {
				getInstanceMock.mockReturnValue(mockInteractionSessionTracking);
			});

			test('should return no-op function if interaction session ID is unavailable', () => {
				mockGetCurrentInteractionSessionId.mockReturnValue(undefined);

				const baseUrl = 'https://example.com/';
				const { result } = renderHook(() =>
					useCrossProductUrl({
						bridge: 'test-bridge',
						product: 'test-product',
						subProduct: 'test-subproduct',
					}),
				);
				const generatedUrl = result.current(baseUrl);
				expect(generatedUrl).toBe(baseUrl);
			});

			test('should return a function that generates URLs with cross-product interaction parameters', () => {
				mockGetCurrentInteractionSessionId.mockReturnValue('12345');

				const baseUrl = 'https://example.com/';
				const { result } = renderHook(() =>
					useCrossProductUrl({
						bridge: 'test-bridge',
						product: 'test-product',
						subProduct: 'test-subproduct',
					}),
				);
				const generatedUrl = result.current(baseUrl);

				expect(generatedUrl).toBe(expectedUrl);

				expect((generateUrlWithParams as jest.Mock).mock.calls[0][0]).toBe('https://example.com/');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][1]).toBe('test-bridge');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][2]).toBe('12345');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][3]).toBe('test-product');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][4]).toBe('test-subproduct');
			});

			test('should persist same interactionSessionId if no update event detected', () => {
				mockGetCurrentInteractionSessionId
					.mockReturnValueOnce('12345')
					.mockReturnValueOnce('67890'); // This call should not be made

				const baseUrl = 'https://example.com/';
				const { result, rerender } = renderHook(() =>
					useCrossProductUrl({
						bridge: 'test-bridge',
						product: 'test-product',
						subProduct: 'test-subproduct',
					}),
				);

				expect(result.current(baseUrl)).toBe(expectedUrl);

				expect((generateUrlWithParams as jest.Mock).mock.calls[0][0]).toBe('https://example.com/');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][1]).toBe('test-bridge');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][2]).toBe('12345');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][3]).toBe('test-product');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][4]).toBe('test-subproduct');

				// No change on rerender if ID update event not triggered
				rerender();
				expect(mockGetCurrentInteractionSessionId).toHaveBeenCalledTimes(1);
			});

			test('should fetch latest interactionSessionId when update event detected', () => {
				mockGetCurrentInteractionSessionId
					.mockReturnValueOnce('12345')
					.mockReturnValueOnce('67890');

				const baseUrl = 'https://example.com/';
				const { result, rerender } = renderHook(() =>
					useCrossProductUrl({
						bridge: 'test-bridge',
						product: 'test-product',
						subProduct: 'test-subproduct',
					}),
				);

				expect(result.current(baseUrl)).toBe(expectedUrl);

				expect((generateUrlWithParams as jest.Mock).mock.calls[0][0]).toBe('https://example.com/');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][1]).toBe('test-bridge');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][2]).toBe('12345');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][3]).toBe('test-product');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][4]).toBe('test-subproduct');

				// Instructed by #help-afm to continue using deprecated module for now
				// https://atlassian.slack.com/archives/CL6HC337Z/p1755151033713329?thread_ts=1754881932.764349&cid=CL6HC337Z
				act(() => {
					document.dispatchEvent(new Event(INTERACTION_SESSION_ID_UPDATED_EVENT));
				});
				rerender();

				// After ID update event dispatched, the hook should have retrieved the new session ID
				expect(mockGetCurrentInteractionSessionId).toHaveBeenCalledTimes(2);
				expect(result.current(baseUrl)).toBe(expectedUrl);
				expect((generateUrlWithParams as jest.Mock).mock.calls[1][0]).toBe('https://example.com/');
				expect((generateUrlWithParams as jest.Mock).mock.calls[1][1]).toBe('test-bridge');
				expect((generateUrlWithParams as jest.Mock).mock.calls[1][2]).toBe('67890');
				expect((generateUrlWithParams as jest.Mock).mock.calls[1][3]).toBe('test-product');
				expect((generateUrlWithParams as jest.Mock).mock.calls[1][4]).toBe('test-subproduct');
			});
		});

		describe('Global interaction session tracking missing on hook intialisation', () => {
			test('should return no-op function', () => {
				getInstanceMock.mockReturnValue(undefined);
				mockGetCurrentInteractionSessionId.mockReturnValue('12345');

				const baseUrl = 'https://example.com/';
				const { result } = renderHook(() =>
					useCrossProductUrl({
						bridge: 'test-bridge',
						product: 'test-product',
						subProduct: 'test-subproduct',
					}),
				);
				const generatedUrl = result.current(baseUrl);
				expect(generatedUrl).toBe(baseUrl);
			});

			test('should fetch global interaction session client when update event detected', () => {
				getInstanceMock
					.mockReturnValueOnce(undefined)
					.mockReturnValueOnce(mockInteractionSessionTracking);

				mockGetCurrentInteractionSessionId.mockReturnValue('12345');

				const baseUrl = 'https://example.com/';
				const { result, rerender } = renderHook(() =>
					useCrossProductUrl({
						bridge: 'test-bridge',
						product: 'test-product',
						subProduct: 'test-subproduct',
					}),
				);
				const generatedUrl = result.current(baseUrl);
				expect(generatedUrl).toBe(baseUrl);

				// Instructed by #help-afm to continue using deprecated module for now
				// https://atlassian.slack.com/archives/CL6HC337Z/p1755151033713329?thread_ts=1754881932.764349&cid=CL6HC337Z
				act(() => {
					document.dispatchEvent(new Event(INTERACTION_SESSION_ID_UPDATED_EVENT));
				});
				rerender();

				// After ID update event dispatched, the hook should have retrieved the new session ID
				expect(mockGetCurrentInteractionSessionId).toHaveBeenCalledTimes(1);
				expect(result.current(baseUrl)).toBe(expectedUrl);
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][0]).toBe('https://example.com/');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][1]).toBe('test-bridge');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][2]).toBe('12345');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][3]).toBe('test-product');
				expect((generateUrlWithParams as jest.Mock).mock.calls[0][4]).toBe('test-subproduct');
			});

			test('should return no-op if global interaction session client does not exist even when update event detected', () => {
				getInstanceMock.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

				mockGetCurrentInteractionSessionId.mockReturnValue('12345');

				const baseUrl = 'https://example.com/';
				const { result, rerender } = renderHook(() =>
					useCrossProductUrl({
						bridge: 'test-bridge',
						product: 'test-product',
						subProduct: 'test-subproduct',
					}),
				);
				const generatedUrl = result.current(baseUrl);
				expect(generatedUrl).toBe(baseUrl);

				// Instructed by #help-afm to continue using deprecated module for now
				// https://atlassian.slack.com/archives/CL6HC337Z/p1755151033713329?thread_ts=1754881932.764349&cid=CL6HC337Z
				act(() => {
					document.dispatchEvent(new Event(INTERACTION_SESSION_ID_UPDATED_EVENT));
				});
				rerender();

				// After ID update event dispatched, the hook should have retrieved the new session ID
				expect(mockGetCurrentInteractionSessionId).toHaveBeenCalledTimes(0);
				expect(result.current(baseUrl)).toBe(baseUrl);
			});
		});
	});

	ffTest.off('atlaskit-analytics-cross-product', 'Feature flag off', () => {
		test('should return a a no-op function even if interaction session data is available', () => {
			getInstanceMock.mockReturnValue(mockInteractionSessionTracking);
			mockGetCurrentInteractionSessionId.mockReturnValue('12345');

			const baseUrl = 'https://example.com/';
			const { result } = renderHook(() =>
				useCrossProductUrl({
					bridge: 'test-bridge',
					product: 'test-product',
					subProduct: 'test-subproduct',
				}),
			);
			const generatedUrl = result.current(baseUrl);

			expect(generatedUrl).toBe(baseUrl);
		});
	});
});
