import React, { useEffect } from 'react';
import type { ReactTestRenderer } from 'react-test-renderer';
import { act, create } from 'react-test-renderer';
import { FetchProxy, fetchProxy } from '../../fetch-proxy';
import { isApple } from '../../is-apple';
jest.mock('../../is-apple');

const atlassianDomain = 'http://atlassian.com';
const trelloDomain = 'http://trello.com';

describe('FetchProxy', () => {
  let fetchSpy: jest.SpyInstance;
  let localFetchProxy: FetchProxy;

  beforeAll(() => {
    fetchProxy.disable();
  });

  beforeEach(() => {
    fetchSpy = jest
      .spyOn(window, 'fetch')
      .mockImplementation(() => Promise.resolve(new Response()));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    (isApple as jest.Mock).mockClear();
  });

  describe('setup', () => {
    let bindSpy: jest.SpyInstance;
    beforeEach(() => {
      bindSpy = jest.spyOn(window.fetch as Function, 'bind');
    });

    afterEach(() => {
      bindSpy.mockRestore();
    });

    it('should set global fetch context to window', function () {
      localFetchProxy = new FetchProxy();

      expect(bindSpy).toHaveBeenCalledWith(window);
    });
  });

  describe('url list', () => {
    it('adding urls with the same domain', function () {
      localFetchProxy.add(atlassianDomain);
      localFetchProxy.add(atlassianDomain + '/aaa');
      localFetchProxy.add(atlassianDomain + '/aaa' + '/bbb');

      expect(localFetchProxy.getUrlListLength()).toEqual(1);
    });

    it('remove urls with the same domain', function () {
      localFetchProxy.add(atlassianDomain);
      localFetchProxy.add(atlassianDomain + '/aaa');
      localFetchProxy.add(atlassianDomain + '/aaa' + '/bbb');

      localFetchProxy.remove(atlassianDomain);

      expect(localFetchProxy.getUrlListLength()).toEqual(0);
    });

    it('remove urls with different domains', function () {
      localFetchProxy.add(atlassianDomain);
      localFetchProxy.add(trelloDomain + '/aaa');
      localFetchProxy.add(atlassianDomain + '/aaa' + '/bbb');

      localFetchProxy.remove(trelloDomain + '/aaa');

      expect(localFetchProxy.getUrlListLength()).toEqual(1);
    });
  });

  describe('Apple', () => {
    beforeAll(() => {
      (isApple as jest.Mock).mockImplementation(() => true);
    });

    beforeEach(() => {
      localFetchProxy = new FetchProxy();
      localFetchProxy.enable();
    });

    afterEach(() => {
      localFetchProxy.disable();
    });

    it('should not intercept urls that are not registered', function () {
      window.fetch(atlassianDomain);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('should intercept urls that are registered', function () {
      localFetchProxy.add(atlassianDomain);
      window.fetch(atlassianDomain);

      expect(fetchSpy).not.toHaveBeenCalled();
      localFetchProxy.remove(atlassianDomain);
    });

    it('should intercept urls that the initial part is registered', function () {
      localFetchProxy.add(atlassianDomain);
      window.fetch(`${atlassianDomain}/some/path/inside/the/url`);

      expect(fetchSpy).not.toHaveBeenCalled();
      localFetchProxy.remove(atlassianDomain);
    });

    it('should not intercept the url after you remove the domain', function () {
      localFetchProxy.add(atlassianDomain);
      localFetchProxy.remove(atlassianDomain);
      window.fetch(`${atlassianDomain}/some/path/inside/the/url`);

      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  describe('Android', () => {
    beforeAll(() => {
      (isApple as jest.Mock).mockImplementation(() => false);
    });

    beforeEach(() => {
      localFetchProxy = new FetchProxy();
      localFetchProxy.enable();
    });

    afterEach(() => {
      localFetchProxy.disable();
    });

    it('should not intercept urls', function () {
      localFetchProxy.add(atlassianDomain);
      window.fetch(atlassianDomain);

      expect(fetchSpy).toHaveBeenCalled();
    });
  });
});

describe('use FetchProxy in component', () => {
  let fetchSpy: jest.SpyInstance;
  let renderResult: ReactTestRenderer;

  beforeAll(() => {
    fetchProxy.disable();
  });

  const TestComponent = (): JSX.Element | null => {
    useEffect(() => {
      const localFetchProxy = new FetchProxy();
      localFetchProxy.enable();
      localFetchProxy.add(atlassianDomain);

      return () => {
        localFetchProxy.disable();
      };
    }, []);

    return null;
  };

  beforeEach(() => {
    fetchSpy = jest
      .spyOn(window, 'fetch')
      .mockImplementation(() => Promise.resolve(new Response()));
    (isApple as jest.Mock).mockImplementation(() => true);

    act(() => {
      renderResult = create(<TestComponent />);
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    (isApple as jest.Mock).mockClear();

    act(() => {
      renderResult.unmount();
    });
  });

  it('should intercept url on atlassian domain', function () {
    window.fetch(`${atlassianDomain}/some/path/inside/the/url`);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should not intercept url on atlassian domain after unmounted', function () {
    act(() => {
      renderResult.unmount();
    });

    window.fetch(`${atlassianDomain}/some/path/inside/the/url`);

    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should not intercept url on trello domain', function () {
    window.fetch(`${trelloDomain}/some/path/inside/the/url`);

    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should not intercept url on trello domain after unmounted', function () {
    act(() => {
      renderResult.unmount();
    });

    window.fetch(`${trelloDomain}/some/path/inside/the/url`);

    expect(fetchSpy).toHaveBeenCalled();
  });
});
