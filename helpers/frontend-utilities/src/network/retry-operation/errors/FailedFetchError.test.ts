import FailedFetchError from './FailedFetchError';

describe('FailedFetchError', () => {
  it('should be created and map to original error', () => {
    const failedFetchError = new FailedFetchError({
      error: new Error('mock error'),
      method: 'GET',
      path: '/api/1/somewhere',
    });
    expect(failedFetchError.name).toEqual('FailedFetchError');
    expect(failedFetchError.originalName).toEqual('Error');
    expect(failedFetchError.message).toEqual('mock error');
    expect(failedFetchError.path).toEqual('/api/1/somewhere');
    expect(failedFetchError.method).toEqual('GET');
  });
});
