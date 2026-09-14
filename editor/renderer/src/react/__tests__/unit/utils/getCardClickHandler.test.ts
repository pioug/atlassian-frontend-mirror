import { getCardClickHandler } from '../../../utils/getCardClickHandler';

describe('getCardClickHandler()', () => {
	const mockHandler = jest.fn();
	const mockEvent = {} as React.MouseEvent<HTMLElement>;
	const url = 'https://example.com';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getCardClickHandler with XPC URL wrapping enabled', () => {
		it('returns undefined when eventHandlers is undefined', () => {
			const result = getCardClickHandler(undefined, url);
			expect(result).toBeUndefined();
		});

		it('returns undefined when smartCard handler is not set', () => {
			const result = getCardClickHandler({ smartCard: {} }, url);
			expect(result).toBeUndefined();
		});

		it('returns a click handler when smartCard onClick is set', () => {
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } }, url);
			expect(result).toBeDefined();
			expect(typeof result).toBe('function');
		});

		it('calls handler with destinationUrl from data when available', () => {
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } }, url);
			const data = { destinationUrl: 'https://destination.com', url: 'https://card.com' };
			result!(mockEvent, data);
			expect(mockHandler).toHaveBeenCalledWith(mockEvent, 'https://destination.com');
		});

		it('falls back to data.url when destinationUrl is absent', () => {
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } }, url);
			const data = { url: 'https://card.com' };
			result!(mockEvent, data);
			expect(mockHandler).toHaveBeenCalledWith(mockEvent, 'https://card.com');
		});

		it('falls back to the url argument when both data.destinationUrl and data.url are absent', () => {
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } }, url);
			const data = {};
			result!(mockEvent, data);
			expect(mockHandler).toHaveBeenCalledWith(mockEvent, url);
		});

		it('falls back to the url argument when data is undefined', () => {
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } }, url);
			result!(mockEvent, undefined);
			expect(mockHandler).toHaveBeenCalledWith(mockEvent, url);
		});

		it('passes undefined when data is absent and url is not provided', () => {
			const result = getCardClickHandler({ smartCard: { onClick: mockHandler } });
			result!(mockEvent, undefined);
			expect(mockHandler).toHaveBeenCalledWith(mockEvent, undefined);
		});
	});
});
