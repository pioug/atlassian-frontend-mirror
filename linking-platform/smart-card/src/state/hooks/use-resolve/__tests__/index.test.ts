import * as testMocks from './index.test.mock';
import { APIError, CardState } from '@atlaskit/linking-common';
import { CardContext } from '@atlaskit/smart-card';
import { mocks } from '../../../../utils/mocks';
import useResolve from '../index';
import { asMockFunction } from '@atlaskit/media-test-helpers';
import { JsonLd } from 'json-ld-types';
import { useSmartLinkContext } from '@atlaskit/link-provider';

describe('useResolve', () => {
  let url: string;
  let id: string;
  let mockContext: CardContext;

  const mockFetchData = (response: Promise<JsonLd.Response | undefined>) => {
    let deferrable: Promise<JsonLd.Response | undefined> =
      Promise.resolve(undefined);

    const fn = async () => {
      deferrable = Promise.resolve(response);
      return response;
    };

    (
      mockContext.connections.client.fetchData as jest.Mock
    ).mockImplementationOnce(fn);

    return {
      promise: deferrable,
      flush: () => new Promise((resolve) => process.nextTick(resolve)),
    };
  };
  const mockState = (state: CardState) => {
    (mockContext.store.getState as jest.Mock).mockImplementationOnce(() => ({
      [url]: state,
    }));
  };

  beforeEach(() => {
    mockContext = testMocks.mockGetContext();
    asMockFunction(useSmartLinkContext).mockImplementation(() => mockContext);
    url = 'https://some/url';
    id = 'my-id';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call fetch when there is no data in the store', async () => {
    mockFetchData(Promise.resolve(mocks.success));
    mockState({
      status: 'pending',
      details: undefined,
    });

    const resolve = useResolve();
    await resolve(url, false, false, id);

    expect(mockContext.store.dispatch).toHaveBeenCalledTimes(2);
    expect(mockContext.store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'resolved',
        url: 'https://some/url',
        payload: mocks.success,
      }),
    );
  });

  it('should call fetch when isReloading flag is true', async () => {
    mockFetchData(Promise.resolve(mocks.success));
    mockState({
      status: 'resolved',
      details: mocks.success,
    });

    const resolve = useResolve();
    await resolve(url, true, false, id);

    expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
      url,
      true,
    );
  });

  it('should call fetch when isMetadataRequest flag is true', async () => {
    mockFetchData(Promise.resolve(mocks.success));
    mockState({
      status: 'resolved',
      details: mocks.success,
    });

    const resolve = useResolve();
    await resolve(url, false, true, id);

    expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
      url,
      false,
    );
  });

  it('throws (allowing editor to handle) if resolving fails and there is no previous data', async () => {
    const mockError = new APIError('fatal', 'https://my.url', '0xBAADF00D');
    mockFetchData(Promise.reject(mockError));
    mockState({
      status: 'pending',
      details: undefined,
    });

    const resolve = useResolve();
    const promise = resolve(url, false, false, id);
    await expect(promise).rejects.toThrow(Error);
    await expect(promise).rejects.toHaveProperty('kind', 'fatal');

    expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
      url,
      false,
    );

    // Assert that we dispatch an action to update card state to fatally errored
    expect(mockContext.store.dispatch).toHaveBeenCalledTimes(1);
    expect(mockContext.store.dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'errored',
      url: 'https://some/url',
      error: new APIError('fatal', 'https://some/url', '0xBAADF00D'),
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
      details: undefined,
    });

    const resolve = useResolve();
    const promise = resolve(url, false, false, id);
    await expect(promise).resolves.toBeUndefined();

    expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
      url,
      false,
    );
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

  it('resolves to error data if no authFlow is available and authorisation is required (unauthorized)', async () => {
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
      details: undefined,
    });

    const resolve = useResolve();
    const promise = resolve(url, false, false, id);
    await expect(promise).resolves.toBeUndefined();

    expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
      url,
      false,
    );
    expect(mockContext.store.dispatch).toHaveBeenCalledWith({
      type: 'fallback',
      url: 'https://some/url',
      error: new APIError(
        'fallback',
        'https://some',
        'Provider.authFlow is not set to OAuth2.',
      ),
      payload: mocks.unauthorized,
    });
  });

  it('resolves to error data if no authFlow is available and authorisation is required (forbidden)', async () => {
    mockContext = {
      ...mockContext,
      config: {
        ...mockContext.config,
        authFlow: 'disabled',
      },
    };
    mockFetchData(Promise.resolve(mocks.forbidden));
    mockState({
      status: 'forbidden',
      details: undefined,
    });

    const resolve = useResolve();
    const promise = resolve(url, false, false, id);
    await expect(promise).resolves.toBeUndefined();

    expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
      url,
      false,
    );
    expect(mockContext.store.dispatch).toHaveBeenCalledWith({
      type: 'fallback',
      url: 'https://some/url',
      error: new APIError(
        'fallback',
        'https://some',
        'Provider.authFlow is not set to OAuth2.',
      ),
      payload: mocks.forbidden,
    });
  });

  it('resolves to error if data response is undefined', async () => {
    mockFetchData(Promise.resolve(undefined));
    mockState({
      status: 'pending',
      details: undefined,
    });

    const resolve = useResolve();
    const promise = resolve(url, false, false, id);

    expect(mockContext.connections.client.fetchData).toHaveBeenCalledWith(
      url,
      false,
    );
    await expect(promise).rejects.toBeInstanceOf(Error);
    await expect(promise).rejects.toHaveProperty('kind', 'fatal');

    expect(mockContext.store.dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'errored',
      url: 'https://some/url',
      error: new APIError(
        'fatal',
        'https://some/url',
        'Fatal error resolving URL',
      ),
    });
  });
});
