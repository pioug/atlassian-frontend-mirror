import { renderHook } from '@testing-library/react';

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
		mockPrefetchData = jest.fn().mockImplementation(async (url: string) => {
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
		const { result } = renderHook(() => usePrefetch(mockUrl));
		const prefetcher = result.current;
		await prefetcher();

		expect(mockPrefetchStore[mockUrl]).toBe(true);

		expect(mockConnections.client.prefetchData).toHaveBeenCalled();
		expect(mockConnections.client.prefetchData).toHaveBeenCalledTimes(1);
		expect(mockConnections.client.prefetchData).toHaveBeenCalledWith(mockUrl);

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
		const { result } = renderHook(() => usePrefetch(mockUrl));
		const prefetcher = result.current;
		await prefetcher();
		await prefetcher();

		expect(mockPrefetchStore[mockUrl]).toBe(true);

		expect(mockConnections.client.prefetchData).toHaveBeenCalled();
		expect(mockConnections.client.prefetchData).toHaveBeenCalledTimes(1);
		expect(mockConnections.client.prefetchData).toHaveBeenCalledWith(mockUrl);

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

		const { result } = renderHook(() => usePrefetch(mockUrl));
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

		const { result } = renderHook(() => usePrefetch(mockUrl));
		const prefetcher = result.current;
		await prefetcher();

		expect(mockConnections.client.prefetchData).toHaveBeenCalled();
		expect(mockConnections.client.prefetchData).toHaveBeenCalledTimes(1);
		expect(mockConnections.client.prefetchData).toHaveBeenCalledWith(mockUrl);
	});

	it('does not throw errors when CardContext props are undefined', async () => {
		mockUseSmartLinkContext.mockImplementation(() => ({
			store: undefined,
			prefetchStore: undefined,
			connections: undefined,
		}));

		const { result } = renderHook(() => usePrefetch(mockUrl));
		const prefetcher = result.current;
		await prefetcher();

		expect(mockConnections.client.prefetchData).not.toHaveBeenCalled();
		expect(mockStore.dispatch).not.toHaveBeenCalled();
	});
});
