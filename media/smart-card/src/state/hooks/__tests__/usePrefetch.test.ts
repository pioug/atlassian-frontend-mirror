import { usePrefetch } from '../usePrefetch';
import { mocks } from '../../../utils/mocks';

let mockUseSmartLinkContext = jest.fn();
jest.mock('../../context', () => ({
  useSmartLinkContext: () => mockUseSmartLinkContext(),
}));

let mockUseCallback = jest.fn().mockImplementation((fn) => fn);
jest.mock('react', () => ({
  useCallback: (...args: any) => mockUseCallback(...args),
}));

interface MockStore {
  getState: jest.Mock;
  dispatch: jest.Mock;
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
    const prefetcher = usePrefetch(mockUrl);
    await prefetcher();

    expect(mockPrefetchStore[mockUrl]).toBe(true);

    expect(mockConnections.client.prefetchData).toBeCalled();
    expect(mockConnections.client.prefetchData).toBeCalledTimes(1);
    expect(mockConnections.client.prefetchData).toBeCalledWith(mockUrl);

    expect(mockStore.dispatch).toBeCalled();
    expect(mockStore.dispatch).toBeCalledTimes(1);
    expect(mockStore.dispatch).toBeCalledWith({
      url: mockUrl,
      type: 'resolved',
      payload: mocks.success,
    });
  });

  it('does not trigger client.prefetchData() when duplicate prefetch requests are made', async () => {
    const prefetcher = usePrefetch(mockUrl);
    await prefetcher();
    await prefetcher();

    expect(mockPrefetchStore[mockUrl]).toBe(true);

    expect(mockConnections.client.prefetchData).toBeCalled();
    expect(mockConnections.client.prefetchData).toBeCalledTimes(1);
    expect(mockConnections.client.prefetchData).toBeCalledWith(mockUrl);

    expect(mockStore.dispatch).toBeCalled();
    expect(mockStore.dispatch).toBeCalledTimes(1);
    expect(mockStore.dispatch).toBeCalledWith({
      url: mockUrl,
      type: 'resolved',
      payload: mocks.success,
    });
  });

  it('does not trigger client.prefetchData() when already registered in store', async () => {
    mockStore.getState.mockImplementationOnce(() => ({
      [mockUrl]: {
        status: 'pending',
        details: mocks.success,
      },
    }));

    const prefetcher = usePrefetch(mockUrl);
    await prefetcher();

    expect(mockPrefetchStore[mockUrl]).toBeUndefined();

    expect(mockConnections.client.prefetchData).not.toBeCalled();
    expect(mockStore.dispatch).not.toBeCalled();
  });

  it('does not fall over when client.prefetchData() throws an error (prefetch failures should not be visible)', async () => {
    mockPrefetchData.mockImplementationOnce(async () => {
      throw new Error();
    });

    const prefetcher = usePrefetch(mockUrl);
    await prefetcher();

    expect(mockConnections.client.prefetchData).toBeCalled();
    expect(mockConnections.client.prefetchData).toBeCalledTimes(1);
    expect(mockConnections.client.prefetchData).toBeCalledWith(mockUrl);
  });
});
