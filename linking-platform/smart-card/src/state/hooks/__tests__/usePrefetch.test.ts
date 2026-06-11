import { ffTest } from '@atlassian/feature-flags-test-utils';
import { renderHook } from '@atlassian/testing-library';

import { mocks } from '../../../utils/mocks';
import { usePrefetch } from '../usePrefetch';

let mockUseSmartLinkContext = jest.fn();
jest.mock('@atlaskit/link-provider', () => ({
	...jest.requireActual('@atlaskit/link-provider'),
	useSmartLinkContext: () => mockUseSmartLinkContext(),
}));

jest.mock('react', () => ({
	...jest.requireActual<Object>('react'),
	useCallback: jest.fn().mockImplementation((fn) => fn),
}));

interface MockStore {
	dispatch: jest.Mock;
	getState: jest.Mock;
}
interface MockPrefetchStore extends Record<string, string> {}
interface MockConnections {
	client: {
		prefetchData: jest.Mock;
	};
}

describe('usePrefetch', () => {
	let mockUrl: string;
	let mockStore: MockStore;
	let mockGetState: jest.Mock;
	let mockPrefetchStore: MockPrefetchStore;
	let mockConnections: MockConnections;
	let mockPrefetchData: jest.Mock;

	beforeEach(() => {
		mockUrl = 'https://my.mock.com/url/path';
		mockGetState = jest.fn().mockImplementation(() => ({}));
		mockStore = {
			getState: jest.fn().mockImplementation(() => mockGetState()),
			dispatch: jest.fn(),
		};
		mockPrefetchStore = {};
		mockPrefetchData = jest.fn().mockImplementation(async (url: string, _appearance?: string) => {
			expect(url).toBe(mockUrl);
			return mocks.success;
		});
		mockConnections = {
			client: {
				prefetchData: mockPrefetchData,
			},
		};

		mockUseSmartLinkContext.mockImplementation(() => ({
			store: mockStore,
			prefetchStore: mockPrefetchStore,
			connections: mockConnections,
		}));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('triggers client.prefetchData() when new prefetch request is made', async () => {
		const result = renderHook(() => usePrefetch(mockUrl));
		const prefetcher = result.current;
		await prefetcher();

		expect(mockPrefetchStore[mockUrl]).toBe(true);

		expect(mockConnections.client.prefetchData).toHaveBeenCalled();
		expect(mockConnections.client.prefetchData).toHaveBeenCalledTimes(1);
		expect(mockConnections.client.prefetchData).toHaveBeenCalledWith(mockUrl, undefined);

		expect(mockStore.dispatch).toHaveBeenCalled();
		expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
		expect(mockStore.dispatch).toHaveBeenCalledWith({
			url: mockUrl,
			type: 'resolved',
			payload: mocks.success,
		});
		expect(mockStore.dispatch).toHaveBeenCalledWith({
			url: mockUrl,
			type: 'metadata',
			metadataStatus: 'resolved',
		});
	});

	it('does not trigger client.prefetchData() when duplicate prefetch requests are made', async () => {
		const result = renderHook(() => usePrefetch(mockUrl));
		const prefetcher = result.current;
		await prefetcher();
		await prefetcher();

		expect(mockPrefetchStore[mockUrl]).toBe(true);

		expect(mockConnections.client.prefetchData).toHaveBeenCalled();
		expect(mockConnections.client.prefetchData).toHaveBeenCalledTimes(1);
		expect(mockConnections.client.prefetchData).toHaveBeenCalledWith(mockUrl, undefined);

		expect(mockStore.dispatch).toHaveBeenCalled();
		expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
		expect(mockStore.dispatch).toHaveBeenCalledWith({
			url: mockUrl,
			type: 'resolved',
			payload: mocks.success,
		});
		expect(mockStore.dispatch).toHaveBeenCalledWith({
			url: mockUrl,
			type: 'metadata',
			metadataStatus: 'resolved',
		});
	});

	it('does not trigger client.prefetchData() when already registered in store', async () => {
		mockStore.getState.mockImplementationOnce(() => ({
			[mockUrl]: {
				status: 'pending',
				details: mocks.success,
			},
		}));

		const result = renderHook(() => usePrefetch(mockUrl));
		const prefetcher = result.current;
		await prefetcher();

		expect(mockPrefetchStore[mockUrl]).toBeUndefined();

		expect(mockConnections.client.prefetchData).not.toHaveBeenCalled();
		expect(mockStore.dispatch).not.toHaveBeenCalled();
	});

	it('does not fall over when client.prefetchData() throws an error (prefetch failures should not be visible)', async () => {
		mockPrefetchData.mockImplementationOnce(async () => {
			throw new Error();
		});

		const result = renderHook(() => usePrefetch(mockUrl));
		const prefetcher = result.current;
		await prefetcher();

		expect(mockConnections.client.prefetchData).toHaveBeenCalled();
		expect(mockConnections.client.prefetchData).toHaveBeenCalledTimes(1);
		expect(mockConnections.client.prefetchData).toHaveBeenCalledWith(mockUrl, undefined);
	});

	it('does not throw errors when CardContext props are undefined', async () => {
		mockUseSmartLinkContext.mockImplementation(() => ({
			store: undefined,
			prefetchStore: undefined,
			connections: undefined,
		}));

		const result = renderHook(() => usePrefetch(mockUrl));
		const prefetcher = result.current;
		await prefetcher();

		expect(mockConnections.client.prefetchData).not.toHaveBeenCalled();
		expect(mockStore.dispatch).not.toHaveBeenCalled();
	});

	it('passes appearance parameter to prefetchData when provided', async () => {
		const result = renderHook(() => usePrefetch(mockUrl, 'inline'));
		const prefetcher = result.current;
		await prefetcher();

		expect(mockConnections.client.prefetchData).toHaveBeenCalledWith(mockUrl, 'inline');
	});

	it('passes block appearance parameter to prefetchData when provided', async () => {
		const result = renderHook(() => usePrefetch(mockUrl, 'block'));
		const prefetcher = result.current;
		await prefetcher();

		expect(mockConnections.client.prefetchData).toHaveBeenCalledWith(mockUrl, 'block');
	});

	ffTest.on(
		'platform_smartlink_inline_resolve_optimization',
		'when FG is on, inline prefetch dispatches metadataStatus pending',
		() => {
			it('dispatches metadataStatus pending for inline appearance when FG is on', async () => {
				const result = renderHook(() => usePrefetch(mockUrl, 'inline'));
				const prefetcher = result.current;
				await prefetcher();

				expect(mockStore.dispatch).toHaveBeenCalledWith(
					expect.objectContaining({
						url: mockUrl,
						type: 'metadata',
						metadataStatus: 'pending',
					}),
				);
			});
		},
	);

	it('dispatches metadataStatus resolved for block appearance regardless of FG', async () => {
		const result = renderHook(() => usePrefetch(mockUrl, 'block'));
		const prefetcher = result.current;
		await prefetcher();

		expect(mockStore.dispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				url: mockUrl,
				type: 'metadata',
				metadataStatus: 'resolved',
			}),
		);
	});

	ffTest.off(
		'platform_smartlink_inline_resolve_optimization',
		'when FG is off, inline prefetch dispatches metadataStatus resolved',
		() => {
			it('dispatches metadataStatus resolved for inline appearance when FG is off', async () => {
				const result = renderHook(() => usePrefetch(mockUrl, 'inline'));
				const prefetcher = result.current;
				await prefetcher();

				expect(mockStore.dispatch).toHaveBeenCalledWith(
					expect.objectContaining({
						url: mockUrl,
						type: 'metadata',
						metadataStatus: 'resolved',
					}),
				);
			});
		},
	);
});
