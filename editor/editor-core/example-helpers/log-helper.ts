import fetchMock from 'fetch-mock/cjs/client';

export const suppressFetchMockWarnings = () => {
  // Suppress fetch-mock warnings in sandbox - we know it's a
  // test environment already
  fetchMock.config.warnOnFallback = false;
};
