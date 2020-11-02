import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { Provider as CollabProvider } from '@atlaskit/collab-provider';

import * as collabProvider from '@atlaskit/collab-provider';
import * as crossPlatformPromise from '../../../cross-platform-promise';
import {
  createCollabProviderFactory,
  StorageImpl,
  useCollabProvider,
} from '../../collab-provider';
import WebBridgeImpl from '../../../editor/native-to-web';
import { FetchProxy } from '../../../utils/fetch-proxy';

jest.mock('../../../cross-platform-promise');
jest.mock('@atlaskit/collab-provider');

const atlassianDomain = 'http://atlassian.com';

function mockCreatePromiseResolveValue(resolve: any) {
  const { createPromise } = require('../../../cross-platform-promise');

  createPromise.mockImplementationOnce(
    () =>
      ({
        submit: () => Promise.resolve(resolve),
      } as any),
  );
}

describe('createCollabProvider', () => {
  let createPromise: jest.MockedFunction<typeof crossPlatformPromise.createPromise>;
  let Provider: jest.MockedClass<typeof collabProvider.Provider>;
  const originalWebkit = window.webkit;

  beforeEach(() => {
    ({ createPromise } = require('../../../cross-platform-promise'));
    ({ Provider } = require('@atlaskit/collab-provider'));

    mockCreatePromiseResolveValue({
      documentAri: 'my:doc',
      baseUrl: atlassianDomain,
      userId: 'john-doe',
    });
  });

  afterEach(() => {
    Provider.mockClear();
    createPromise.mockClear();
    window.webkit = originalWebkit;
  });

  it('should get collab config', async function () {
    await createCollabProviderFactory(new FetchProxy())(new WebBridgeImpl());

    expect(Provider).toHaveBeenCalledWith(
      expect.objectContaining({
        documentAri: 'my:doc',
        url: atlassianDomain,
      }),
    );
  });

  it('should add base url to the fetch proxy when ios', async () => {
    const fetchProxy = new FetchProxy();
    const addSpy = jest.spyOn(fetchProxy, 'add');
    window.webkit = {
      messageHandlers: {},
    };

    await createCollabProviderFactory(fetchProxy)(new WebBridgeImpl());

    expect(addSpy).toHaveBeenCalledWith(atlassianDomain);
  });

  it('should create a socket using the bridge', async () => {
    const bridge = new WebBridgeImpl();
    const createSocketSpy = jest.spyOn(bridge, 'createCollabSocket');
    await createCollabProviderFactory(new FetchProxy())(bridge);

    // Manually call create socket (Provider is mocked it will not call it)
    Provider.mock.calls[0][0].createSocket!(atlassianDomain);

    expect(createSocketSpy).toHaveBeenCalledWith(atlassianDomain);
  });

  describe('Native Storage', () => {
    let storage: StorageImpl;
    beforeEach(async () => {
      const bridge = new WebBridgeImpl();
      await createCollabProviderFactory(new FetchProxy())(bridge);

      storage = Provider.mock.calls[0][0].storage as StorageImpl;
    });
    it('should create an storage', async () => {
      expect(storage).toEqual(expect.any(StorageImpl));
    });

    it('should call `setStorageValue` promise when setting a value', async () => {
      mockCreatePromiseResolveValue(undefined);
      storage.set('foo', 'bar');

      expect(createPromise).toHaveBeenLastCalledWith('setStorageValue', {
        key: 'foo',
        value: 'bar',
      });
    });
    it('should call `deleteStorageValue` promise when deleting a value', async () => {
      mockCreatePromiseResolveValue(undefined);
      storage.delete('foo');

      expect(createPromise).toHaveBeenLastCalledWith('deleteStorageValue', {
        key: 'foo',
      });
    });
    it('should call `getStorageValue` promise when getting a value', async () => {
      mockCreatePromiseResolveValue('baz');
      const value = await storage.get('foo');

      expect(createPromise).toHaveBeenLastCalledWith('getStorageValue', {
        key: 'foo',
      });
      expect(value).toEqual('baz');
    });
  });
});

function setupFactory() {
  let renderResult: ReactTestRenderer;

  interface Props {
    bridge: WebBridgeImpl;
    createCollabProvider: (bridge: WebBridgeImpl) => Promise<CollabProvider>;
  }
  const TestComponent: React.FC<Props> = props => {
    const collabProvider = useCollabProvider(
      props.bridge,
      props.createCollabProvider,
    );

    if (collabProvider) {
      return <div data-test-id="has-collab" />;
    }

    return <div data-test-id="no-collab" />;
  };

  beforeEach(() => {});

  afterEach(() => {
    renderResult.unmount();
  });

  return () => {
    const createCollabProvider = createCollabProviderFactory(new FetchProxy());

    act(() => {
      renderResult = create(
        <TestComponent
          bridge={new WebBridgeImpl()}
          createCollabProvider={createCollabProvider}
        />,
      );
    });

    return renderResult;
  };
}

describe('useCollabProvider', () => {
  const setup = setupFactory();

  it('should create the collab provider', function () {
    jest
      .spyOn(window, 'location', 'get')
      .mockImplementation(
        () =>
          new URL('https://www.atlassian.com?allowCollabProvider=true') as any,
      );

    const renderResult = setup();

    expect(
      renderResult.root.findAll(
        node => node.props['data-test-id'] === 'has-collab',
      ).length,
    ).toEqual(1);
  });

  it('should create the collab provider', function () {
    jest
      .spyOn(window, 'location', 'get')
      .mockImplementation(
        () =>
          new URL('https://www.atlassian.com?allowCollabProvider=false') as any,
      );

    const renderResult = setup();

    expect(
      renderResult.root.findAll(
        node => node.props['data-test-id'] === 'no-collab',
      ).length,
    ).toEqual(1);
  });
});
