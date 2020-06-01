jest.doMock('react', () => mockMemo);

const mockAuthFlow = jest.fn();
const mockMemo = {
  useMemo: jest.fn().mockImplementation(fn => fn()),
};
import { mockEvents } from '../../../view/__tests__/_mocks';

// eslint-disable-next-line no-global-assign
performance = ({
  mark: jest.fn(),
  measure: jest.fn(),
  clearMarks: jest.fn(),
} as unknown) as Performance;

jest.doMock('../../../utils/analytics', () => mockEvents);
jest.doMock('@atlaskit/outbound-auth-flow-client', () => ({
  auth: mockAuthFlow,
}));

const getMockContext = (): CardContext => ({
  config: { maxAge: 100, maxLoadingDelay: 100 },
  connections: {
    client: {
      fetchData: jest.fn(),
      postData: jest.fn(),
    },
  },
  store: {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  },
  extractors: {
    getPreview: jest.fn(),
  },
});

let mockContext: CardContext;
jest.doMock('../../context', () => ({
  useSmartLinkContext: jest.fn(() => mockContext),
}));

import { useSmartCardActions } from '..';
import { mocks } from '../../../utils/mocks';
import { APIError } from '../../../client/errors';
import { CardContext } from '../../context';
import { CardState } from '../../types';
import { useSmartLinkAnalytics } from '../../analytics';
import { JsonLd } from 'json-ld-types';

describe('Smart Card: Actions', () => {
  let url: string;
  let id: string;
  let dispatchAnalytics: jest.Mock;
  const mockFetchData = (response: Promise<JsonLd.Response | undefined>) => {
    (mockContext.connections.client
      .fetchData as jest.Mock).mockImplementationOnce(() => response);
  };
  const mockState = (state: CardState) => {
    (mockContext.store.getState as jest.Mock).mockImplementationOnce(() => ({
      [url]: state,
    }));
  };

  beforeEach(() => {
    mockContext = getMockContext();
    url = 'https://some/url';
    id = 'my-id';
    dispatchAnalytics = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register()', () => {
    it('dispatches pending action if card not in store', async () => {
      mockFetchData(Promise.resolve(mocks.success));
      const analytics = useSmartLinkAnalytics(dispatchAnalytics);
      const actions = useSmartCardActions(id, url, analytics);
      await actions.register();

      expect(mockContext.connections.client.fetchData).toBeCalledWith(url);
    });
  });

  describe('resolve()', () => {
    it('throws (allowing editor to handle) if resolving fails and there is no previous data', async () => {
      const mockError = new APIError('fatal', 'https://my.url', '0xBAADF00D');
      mockFetchData(Promise.reject(mockError));
      mockState({
        status: 'pending',
        lastUpdatedAt: 0,
        details: undefined,
      });

      const analytics = useSmartLinkAnalytics(dispatchAnalytics);
      const actions = useSmartCardActions(id, url, analytics);
      const promise = actions.register();
      await expect(promise).rejects.toThrow(Error);
      await expect(promise).rejects.toHaveProperty('kind', 'fatal');

      expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
        url,
      );
      expect(mockContext.store.dispatch).toHaveBeenCalledTimes(1);
      expect(mockContext.store.dispatch).toHaveBeenCalledWith({
        payload: undefined,
        type: 'pending',
        url: 'https://some/url',
      });
    });

    it('falls back to previous data if the URL failed to be resolved', async () => {
      const mockError = new APIError('fatal', 'https://my.url', '0xBAADF00D');
      mockFetchData(Promise.reject(mockError));
      mockState({
        status: 'resolved',
        lastUpdatedAt: 0,
        details: mocks.success,
      });

      const analytics = useSmartLinkAnalytics(dispatchAnalytics);
      const actions = useSmartCardActions(id, url, analytics);
      const promise = actions.register();
      await expect(promise).resolves.toBeUndefined();

      expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
        url,
      );
      expect(mockContext.store.dispatch).toHaveBeenCalledTimes(1);
      expect(mockContext.store.dispatch).toHaveBeenCalledWith({
        payload: mocks.success,
        type: 'resolved',
        url: 'https://some/url',
      });
    });

    it('resolves to authentication error data if resolving failed for auth reasons', async () => {
      const mockError = new APIError(
        'auth',
        'https://my.url',
        'YOU SHALL NOT PASS',
      );
      mockFetchData(Promise.reject(mockError));
      mockState({
        status: 'pending',
        lastUpdatedAt: 0,
        details: undefined,
      });

      const analytics = useSmartLinkAnalytics(dispatchAnalytics);
      const actions = useSmartCardActions(id, url, analytics);
      const promise = actions.register();
      await expect(promise).resolves.toBeUndefined();

      expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
        url,
      );
      expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
      expect(mockContext.store.dispatch).toHaveBeenCalledWith({
        payload: {
          meta: {
            access: 'unauthorized',
            auth: [],
            definitionId: 'provider-not-found',
            visibility: 'restricted',
          },
          data: {
            '@context': {
              '@vocab': 'https://www.w3.org/ns/activitystreams#',
              atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
              schema: 'http://schema.org/',
            },
            '@type': 'Object',
          },
        },
        type: 'resolved',
        url: 'https://some/url',
      });
    });

    it('resolves to error data if no authFlow is available and authorisation is required', async () => {
      mockContext = {
        ...mockContext,
        config: {
          ...mockContext.config,
          authFlow: 'disabled',
        },
      };
      mockFetchData(Promise.resolve(mocks.unauthorized));
      mockState({
        status: 'unauthorized',
        lastUpdatedAt: 0,
        details: undefined,
      });

      const analytics = useSmartLinkAnalytics(dispatchAnalytics);
      const actions = useSmartCardActions(id, url, analytics);
      const promise = actions.register();
      await expect(promise).resolves.toBeUndefined();

      expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
        url,
      );
      expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
      expect(mockContext.store.dispatch).nthCalledWith(2, {
        type: 'fallback',
        url: 'https://some/url',
        error: new APIError(
          'fallback',
          'https://some',
          'Provider.authFlow is not set to OAuth2.',
        ),
      });
    });

    it('resolves to error data response is undefined', async () => {
      mockFetchData(Promise.resolve(undefined));
      mockState({
        status: 'pending',
        lastUpdatedAt: 0,
        details: undefined,
      });

      const analytics = useSmartLinkAnalytics(dispatchAnalytics);
      const actions = useSmartCardActions(id, url, analytics);
      const promise = actions.register();
      expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
        url,
      );
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toHaveProperty('kind', 'fatal');
    });
  });
});
