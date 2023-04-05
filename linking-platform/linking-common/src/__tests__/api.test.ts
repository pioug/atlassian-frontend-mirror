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

  describe('successful response', () => {
    it('returns successful response', async () => {
      const expectedResponse = { foo: 'bar' };
      mockFetch.mockResolvedValueOnce({
        json: async () => expectedResponse,
        ok: true,
      });

      const response = await request('get', 'some-url');

      expect(response).toBe(expectedResponse);
    });

    it('parses body to json on successful response', async () => {
      const mockJson = jest.fn();
      mockFetch.mockResolvedValueOnce({
        json: mockJson,
        ok: true,
      });

      await request('get', 'some-url');

      expect(mockJson).toHaveBeenCalledTimes(1);
    });

    it('returns unsuccessful response', async () => {
      const expectedResponse = {
        ok: false,
        status: 500,
      };
      mockFetch.mockResolvedValueOnce(expectedResponse);

      await expect(request('get', 'some-url')).rejects.toBe(expectedResponse);
    });

    it.each([[200], [401], [404]])(
      'returns %s as successful response by default',
      async (status: number) => {
        const expectedResponse = {
          json: async () => expectedResponse,
          ok: false,
          status,
        };
        mockFetch.mockResolvedValueOnce(expectedResponse);

        const response = await request('get', 'some-url');

        expect(response).toBe(expectedResponse);
      },
    );

    it('returns a provided status as successful response', async () => {
      const status = 409;
      const expectedResponse = {
        json: async () => expectedResponse,
        ok: false,
        status,
      };
      mockFetch.mockResolvedValueOnce(expectedResponse);

      const response = await request('get', 'some-url', undefined, undefined, [
        status,
      ]);

      await expect(response).toBe(expectedResponse);
    });

    it('return an empty successful response on with no content if 204 is allowed', async () => {
      const mockJson = jest.fn();
      mockFetch.mockResolvedValueOnce({
        json: mockJson,
        ok: true,
        status: 204,
      });

      const response = await request('get', 'some-url', undefined, undefined, [
        204,
      ]);

      expect(response).not.toBeDefined();
      expect(mockJson).not.toHaveBeenCalled();
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
      expect((error as Error).message).toEqual('some-error');
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
      expect((error as Error).message).toEqual('TypeError: some-type-error');
    }
  });
});
