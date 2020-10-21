import React, { useMemo } from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { FetchProxy, useFetchProxy } from '../../fetch-proxy';
import { isApple } from '../../is-apple';
jest.mock('../../is-apple');

const atlassianDomain = 'http://atlassian.com';
const trelloDomain = 'http://trello.com';

describe('FetchProxy', () => {
  let fetchProxy: FetchProxy;
  let fetchSpy: jest.SpyInstance;
  let consoleSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleSpy = jest
      .spyOn(window.console, 'debug')
      .mockImplementation(() => {});
    fetchSpy = jest
      .spyOn(window, 'fetch')
      .mockImplementation(() => Promise.resolve(new Response()));
  });
  afterEach(() => {
    fetchSpy.mockRestore();
    consoleSpy.mockRestore();
    (isApple as jest.Mock).mockClear();
    fetchProxy.disable();
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
      fetchProxy = new FetchProxy();

      expect(bindSpy).toHaveBeenCalledWith(window);
    });
  });

  describe('Apple', () => {
    beforeEach(() => {
      (isApple as jest.Mock).mockImplementation(() => true);

      fetchProxy = new FetchProxy();
      fetchProxy.enable();
    });

    it('should not intercept urls that are not registered', function () {
      window.fetch(atlassianDomain);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('should intercept urls that are registered', function () {
      fetchProxy.add(atlassianDomain);
      window.fetch(atlassianDomain);

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should intercept urls that the initial part is registered', function () {
      fetchProxy.add(atlassianDomain);
      window.fetch(`${atlassianDomain}/some/path/inside/the/url`);

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should not intercept the url after you remove the domain', function () {
      fetchProxy.add(atlassianDomain);
      fetchProxy.remove(atlassianDomain);
      window.fetch(`${atlassianDomain}/some/path/inside/the/url`);

      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Android', () => {
    beforeEach(() => {
      (isApple as jest.Mock).mockImplementation(() => false);

      fetchProxy = new FetchProxy();
      fetchProxy.enable();
    });

    it('should not intercept urls', function () {
      fetchProxy.add(atlassianDomain);
      window.fetch(atlassianDomain);

      expect(fetchSpy).toHaveBeenCalled();
    });
  });
});

function TestComponent() {
  let fetchProxy = useFetchProxy();

  useMemo(() => {
    fetchProxy.add(atlassianDomain);
  }, [fetchProxy]);

  return null;
}

describe('useFetchProxy', () => {
  let fetchSpy: jest.SpyInstance;
  let consoleSpy: jest.SpyInstance;
  let renderResult: ReactTestRenderer;

  beforeEach(() => {
    consoleSpy = jest
      .spyOn(window.console, 'debug')
      .mockImplementation(() => {});
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
    consoleSpy.mockRestore();
    (isApple as jest.Mock).mockClear();
    renderResult.unmount();
  });

  it('should intercept url on atlassian domain', function () {
    window.fetch(`${atlassianDomain}/some/path/inside/the/url`);

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should not intercept url on trello domain', function () {
    window.fetch(`${trelloDomain}/some/path/inside/the/url`);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should not intercept url on atlassian domain after unmounted', function () {
    act(() => {
      renderResult.unmount();
    });

    window.fetch(`${trelloDomain}/some/path/inside/the/url`);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
