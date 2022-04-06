import { request, NetworkError } from '../api';

describe('Smart Card: request()', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn().mockImplementation(() => {
      return {
        ok: true,
        json: jest.fn(),
      };
    });
    (global as any).fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete (global as any).fetch;
  });

  it('should pass headers to fetch options', async () => {
    await request('post', 'some-url', undefined, {
      Origin: 'some-origin',
    });

    expect(mockFetch).toBeCalledWith('some-url', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        Origin: 'some-origin',
      },
    });
  });

  it('should stringify data', async () => {
    await request('get', 'some-url', {
      foo: 'bar',
    });

    expect(mockFetch).toBeCalledWith('some-url', {
      method: 'get',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: '{"foo":"bar"}',
    });
  });

  it('should return NetworkError when fetch rejects', async () => {
    expect.assertions(2);
    mockFetch.mockImplementationOnce(() => {
      return Promise.reject('some-error');
    });

    try {
      await request('get', 'some-url', {
        foo: 'bar',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toEqual('some-error');
    }
  });

  it('should return NetworkError when fetch with TypeError', async () => {
    expect.assertions(2);
    mockFetch.mockImplementationOnce(() => {
      return new TypeError('some-type-error');
    });

    try {
      await request('get', 'some-url', {
        foo: 'bar',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toEqual('TypeError: some-type-error');
    }
  });
});
