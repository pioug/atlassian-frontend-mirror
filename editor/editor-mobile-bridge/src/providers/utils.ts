import { createPromise } from '../cross-platform-promise';

const globalFetch = window.fetch;
export const mockFetchFor = (urls: Array<string> = []) => {
  window.fetch = (request, options) => {
    let url = typeof request === 'string' ? request : request.url;

    // Determine whether its a URL we want native to handle, otherwise continue as normal.
    const shouldMock = urls.find(u => url.startsWith(u));
    if (!shouldMock) {
      return globalFetch(url, options);
    }

    return createPromise('nativeFetch', { url, options })
      .submit()
      .then(({ response, status, statusText }) =>
        Promise.resolve(new Response(response, { status, statusText })),
      );
  };
};
