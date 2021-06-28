import { useLayoutEffect, useRef } from 'react';
import { createPromise } from '../cross-platform-promise';
import { isApple } from './is-apple';

export class FetchProxy {
  private urls: string[] = [];
  // Fetch requires to be binded to the window.
  private globalFetch = window.fetch.bind(window);

  add(url: string): void {
    this.urls.push(url);
  }

  remove(url: string): void {
    const index = this.urls.indexOf(url);
    if (index) {
      this.urls = this.urls.splice(index, 1);
    }
  }

  enable(): void {
    // We should only mock the fetch when we are in IOs, Android intercept the fetch by itself.
    if (!isApple()) {
      return;
    }

    window.fetch = (request, options) => {
      let url = typeof request === 'string' ? request : request.url;
      // Determine whether its a URL we want native to handle, otherwise continue as normal.
      const shouldMock = this.urls.some((u) => url.startsWith(u));
      if (!shouldMock) {
        return this.globalFetch(request, options);
      }

      return createPromise('nativeFetch', { url, options })
        .submit()
        .then(({ response, status, statusText }) =>
          Promise.resolve(new Response(response, { status, statusText })),
        );
    };
  }

  disable(): void {
    // We never mock when is Android, so we do nothing.
    if (!isApple()) {
      return;
    }
    window.fetch = this.globalFetch;
  }
}

export function useFetchProxy() {
  const fetchProxy = useRef(new FetchProxy());

  useLayoutEffect(() => {
    const currentFetchProxy = fetchProxy.current;
    currentFetchProxy.enable();
    return () => {
      currentFetchProxy.disable();
    };
  });
  return fetchProxy.current;
}
