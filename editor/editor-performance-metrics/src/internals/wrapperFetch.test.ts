import type { TimelineHoldable } from './timelineInterfaces';
import { wrapperFetch } from './wrapperFetch';

describe('wrapperFetch', () => {
	let mockGlobalContext: Window;
	let mockTimelineHoldable: TimelineHoldable;
	let originalFetch: typeof fetch;
	let unholdMock = jest.fn();

	beforeEach(() => {
		originalFetch = global.fetch;

		mockGlobalContext = {
			fetch: originalFetch,
		} as unknown as Window;

		unholdMock = jest.fn();
		mockTimelineHoldable = {
			hold: jest.fn().mockReturnValue(unholdMock),
		};
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('should wrap fetch', () => {
		wrapperFetch({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		expect(mockGlobalContext.fetch).not.toBe(originalFetch);
	});

	it('should properly restore the original fetch implementation', () => {
		const cleanup = wrapperFetch({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		expect(mockGlobalContext.fetch).not.toBe(originalFetch);

		cleanup();

		expect(mockGlobalContext.fetch).toBe(originalFetch);
	});

	it('should call hold when fetch is called', async () => {
		wrapperFetch({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		(mockGlobalContext.fetch as jest.Mock).mockResolvedValue(new Response());

		await mockGlobalContext.fetch('https://example.com');

		expect(mockTimelineHoldable.hold).toHaveBeenCalledWith({ source: 'fetch' });
	});

	it('should call unhold when fetch resolves', async () => {
		wrapperFetch({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		const unhold = mockTimelineHoldable.hold({ source: 'fetch' });
		(mockGlobalContext.fetch as jest.Mock).mockResolvedValue(new Response());

		await mockGlobalContext.fetch('https://example.com');

		expect(unhold).toHaveBeenCalled();
	});

	it('should call unhold when fetch rejects', async () => {
		wrapperFetch({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		const unhold = mockTimelineHoldable.hold({ source: 'fetch' });
		const error = new Error('Network error');
		(mockGlobalContext.fetch as jest.Mock).mockRejectedValue(error);

		await expect(mockGlobalContext.fetch('https://example.com')).rejects.toThrow('Network error');

		expect(unhold).toHaveBeenCalled();
	});

	it('should preserve the original fetch behavior', async () => {
		wrapperFetch({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		const mockResponse = new Response('OK');
		(mockGlobalContext.fetch as jest.Mock).mockResolvedValue(mockResponse);

		const response = await mockGlobalContext.fetch('https://example.com');

		expect(response).toBe(mockResponse);
	});

	describe('when there are chainned fetch', () => {
		it('should call hold multiple times', async () => {
			wrapperFetch({
				globalContext: mockGlobalContext,
				timelineHoldable: mockTimelineHoldable,
			});

			(mockGlobalContext.fetch as jest.Mock).mockResolvedValue(new Response());

			await mockGlobalContext
				.fetch('https://example.com')
				.then((r) => {
					expect(unholdMock).toHaveBeenCalledTimes(1);
					return mockGlobalContext.fetch('https://example.com/1');
				})
				.then((r) => {
					expect(unholdMock).toHaveBeenCalledTimes(2);
					return mockGlobalContext.fetch('https://example.com/2');
				});

			expect(mockTimelineHoldable.hold).toHaveBeenCalledTimes(3);
		});
	});
});
