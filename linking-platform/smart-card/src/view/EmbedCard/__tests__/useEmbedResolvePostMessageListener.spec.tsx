import { renderHook } from '@testing-library/react';

import { useEmbedResolvePostMessageListener } from '../useEmbedResolvePostMessageListener';

const mockFetchData = jest.fn();
mockFetchData.mockResolvedValue({ data: {} } as any);
jest.mock('@atlaskit/link-provider', () => ({
	...jest.requireActual('@atlaskit/link-provider'),
	useSmartLinkContext: () => ({
		store: { getState: () => ({}), dispatch: jest.fn() },
		config: { authFlow: 'disabled' },
		connections: {
			client: {
				fetchData: mockFetchData,
			},
		},
	}),
}));

describe('useEmbedResolvePostMessageListener', () => {
	const url = 'https://some.url';

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should not re-resolve if no message is posted', () => {
		renderHook(() => useEmbedResolvePostMessageListener({ url, embedIframeRef: null }));
		expect(mockFetchData).not.toHaveBeenCalled();
	});

	it("should force resolve when 'force-resolve-smart-link' message is posted", () => {
		const ref = {
			current: { contentWindow: window } as unknown as HTMLIFrameElement,
		};
		renderHook(() => useEmbedResolvePostMessageListener({ url, embedIframeRef: ref }));
		const messageEvent = new MessageEvent('message', {
			data: 'force-resolve-smart-link',
			source: ref.current.contentWindow,
		});
		window.dispatchEvent(messageEvent);
		expect(mockFetchData).toHaveBeenCalledWith(url, true);
	});

	it('should not re-resolve when a different message is posted', () => {
		renderHook(() => useEmbedResolvePostMessageListener({ url, embedIframeRef: null }));
		const messageEvent = new MessageEvent('message', {
			data: 'some-other-message',
		});
		window.dispatchEvent(messageEvent);
		expect(mockFetchData).not.toHaveBeenCalled();
	});
});
