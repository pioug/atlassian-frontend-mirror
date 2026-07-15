import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { getCardClickHandler } from '../../../utils/getCardClickHandler';

describe('getCardClickHandler()', () => {
	const mockHandler = jest.fn();
	const mockEvent = {} as React.MouseEvent<HTMLElement>;
	const url = 'https://example.com';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('when feature gate platform_smartlink_xpc_url_wrapping is OFF', () => {
		it('returns undefined when eventHandlers is undefined', () => {
			failGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler(undefined, url);
			expect(result).toBeUndefined();
		});

		it('returns undefined when smartCard handler is not set', () => {
			failGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler({ smartCard: {} }, url);
			expect(result).toBeUndefined();
		});

		it('returns a click handler when smartCard onClick is set', () => {
			failGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } }, url);
			expect(result).toBeDefined();
			expect(typeof result).toBe('function');
		});

		it('calls handler with event and url when clicked', () => {
			failGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } }, url);
			result!(mockEvent);
			expect(mockHandler).toHaveBeenCalledTimes(1);
			expect(mockHandler).toHaveBeenCalledWith(mockEvent, url);
		});

		it('calls handler with event and undefined url when url is not provided', () => {
			failGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } });
			result!(mockEvent);
			expect(mockHandler).toHaveBeenCalledWith(mockEvent, undefined);
		});

		it('returns undefined when no eventHandlers is provided but url is present', () => {
			failGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler(undefined, url);
			expect(result).toBeUndefined();
		});
	});

	describe('when feature gate platform_smartlink_xpc_url_wrapping is ON', () => {
		it('returns undefined when eventHandlers is undefined', () => {
			passGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler(undefined, url);
			expect(result).toBeUndefined();
		});

		it('returns undefined when smartCard handler is not set', () => {
			passGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler({ smartCard: {} }, url);
			expect(result).toBeUndefined();
		});

		it('returns a click handler when smartCard onClick is set', () => {
			passGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } }, url);
			expect(result).toBeDefined();
			expect(typeof result).toBe('function');
		});

		it('calls handler with destinationUrl from data when available', () => {
			passGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } }, url);
			const data = { destinationUrl: 'https://destination.com', url: 'https://card.com' };
			result!(mockEvent, data);
			expect(mockHandler).toHaveBeenCalledWith(mockEvent, 'https://destination.com');
		});

		it('falls back to data.url when destinationUrl is absent', () => {
			passGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } }, url);
			const data = { url: 'https://card.com' };
			// @ts-ignore Suppress for testing purpose
			result!(mockEvent, data);
			expect(mockHandler).toHaveBeenCalledWith(mockEvent, 'https://card.com');
		});

		it('falls back to the url argument when both data.destinationUrl and data.url are absent', () => {
			passGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } }, url);
			const data = {};
			// @ts-ignore Suppress for testing purpose
			result!(mockEvent, data);
			expect(mockHandler).toHaveBeenCalledWith(mockEvent, url);
		});

		it('falls back to the url argument when data is undefined', () => {
			passGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } }, url);
			result!(mockEvent, undefined);
			expect(mockHandler).toHaveBeenCalledWith(mockEvent, url);
		});

		it('passes undefined when data is absent and url is not provided', () => {
			passGate('platform_smartlink_xpc_url_wrapping');
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } });
			result!(mockEvent, undefined);
			expect(mockHandler).toHaveBeenCalledWith(mockEvent, undefined);
		});
	});
});
