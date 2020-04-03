const mockEvents = {
  resolvedEvent: jest.fn(),
  unresolvedEvent: jest.fn(),
  connectSucceededEvent: jest.fn(),
  connectFailedEvent: jest.fn(),
  trackAppAccountConnected: jest.fn(),
  uiAuthEvent: jest.fn(),
  uiAuthAlternateAccountEvent: jest.fn(),
  uiCardClickedEvent: jest.fn(),
  uiClosedAuthEvent: jest.fn(),
  screenAuthPopupEvent: jest.fn(),
  fireSmartLinkEvent: jest.fn(),
};
const mockAuthFlow = jest.fn();

jest.doMock('../../../utils/analytics', () => mockEvents);
jest.doMock('@atlaskit/outbound-auth-flow-client', () => ({
  auth: mockAuthFlow,
}));

const getMockContext = (): CardContext => ({
  config: { maxAge: 100, maxLoadingDelay: 100 },
  connections: {
    client: {
      fetchData: jest.fn(),
    },
  },
  store: {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  },
});

let mockContext: CardContext;
jest.doMock('../../context', () => ({
  useSmartLinkContext: jest.fn(() => mockContext),
}));

import { useSmartCardActions } from '..';
import { mocks } from '../../../utils/mocks';
import { FetchError } from '../../../client/errors';
import { CardContext } from '../../context';
import { JsonLd } from '../../../client/types';
import { CardState } from '../../types';

describe('Smart Card: Actions', () => {
  let url: string;
  let dispatchAnalytics: jest.Mock;
  const mockFetchData = (response: Promise<JsonLd | undefined>) => {
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
    dispatchAnalytics = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register()', () => {
    it('dispatches pending action if card not in store', async () => {
      mockFetchData(Promise.resolve(mocks.success));
      const actions = useSmartCardActions(url, dispatchAnalytics);
      await actions.register();

      expect(mockContext.connections.client.fetchData).toBeCalledWith(url);
      expect(dispatchAnalytics).toBeCalled();
      expect(mockEvents.resolvedEvent).toBeCalled();
    });
  });

  describe('resolve()', () => {
    it('throws (allowing editor to handle) if resolving fails and there is no previous data', async () => {
      mockFetchData(Promise.reject(new FetchError('fatal', '0xBAADF00D')));
      mockState({
        status: 'pending',
        lastUpdatedAt: 0,
        details: undefined,
      });

      const actions = useSmartCardActions(url, dispatchAnalytics);
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
      mockFetchData(Promise.reject(new FetchError('fatal', '0xBAADF00D')));
      mockState({
        status: 'resolved',
        lastUpdatedAt: 0,
        details: mocks.success,
      });

      const actions = useSmartCardActions(url, dispatchAnalytics);
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
      mockFetchData(
        Promise.reject(new FetchError('auth', 'YOU SHALL NOT PASS')),
      );
      mockState({
        status: 'pending',
        lastUpdatedAt: 0,
        details: undefined,
      });

      const actions = useSmartCardActions(url, dispatchAnalytics);
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
          data: {},
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

      const actions = useSmartCardActions(url, dispatchAnalytics);
      const promise = actions.register();
      await expect(promise).resolves.toBeUndefined();

      expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
        url,
      );
      expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
      expect(mockContext.store.dispatch).toHaveBeenCalledWith({
        payload: 'fallback: Provider.authFlow is not set to OAuth2.',
        type: 'errored',
        url: 'https://some/url',
      });
    });

    it('resolves to error data response is undefined', async () => {
      mockFetchData(Promise.resolve(undefined));
      mockState({
        status: 'pending',
        lastUpdatedAt: 0,
        details: undefined,
      });

      const actions = useSmartCardActions(url, dispatchAnalytics);
      const promise = actions.register();
      await expect(promise).resolves.toBeUndefined();

      expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
        url,
      );
      expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
      expect(mockContext.store.dispatch).toHaveBeenCalledWith({
        payload: 'fallback: Fatal error resolving URL',
        type: 'errored',
        url: 'https://some/url',
      });
    });
  });
});
