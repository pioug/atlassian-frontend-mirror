let mockRequest = jest.fn();
jest.mock('../api', () => ({
  request: (...args: any) => mockRequest(...args),
}));

import { mocks } from '../../utils/mocks';
import SmartCardClient from '..';

describe('Smart Card: Client', () => {
  beforeEach(() => {
    mockRequest = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('successfully sets up client with passed environment', async () => {
    mockRequest.mockImplementationOnce(async () => [
      { status: 200, body: mocks.success },
    ]);
    const client = new SmartCardClient('stg');
    const resourceUrl = 'https://i.love.cheese';
    const response = await client.fetchData('https://i.love.cheese');
    expect(mockRequest).toBeCalled();
    expect(mockRequest).toBeCalledWith(
      'post',
      expect.stringMatching(/.*?stg.*?\/resolve\/batch/),
      [
        {
          resourceUrl,
        },
      ],
    );
    expect(response).toBe(mocks.success);
  });

  it('successfully deduplicates requests made in batches in same execution frame', async () => {
    const hostname = 'https://www.google.com';

    // Map the URLs sent by DataLoader to their respective responses.
    async function mockRequestFn(_method: string, _url: string, data?: any) {
      return data.map(({ resourceUrl }: any) => {
        const key: keyof typeof mocks = resourceUrl.split(`${hostname}/`)[1];
        return { status: 200, body: mocks[key] };
      });
    }

    mockRequest.mockImplementationOnce(mockRequestFn);
    const client = new SmartCardClient('stg');
    const [responseFirst, responseSecond, responseThird] = await Promise.all([
      // NOTE: send in _two_ of the same URL
      client.fetchData(`${hostname}/success`),
      client.fetchData(`${hostname}/success`),
      client.fetchData(`${hostname}/notFound`),
    ]);
    expect(mockRequest).toBeCalled();
    expect(mockRequest).toBeCalledWith(
      'post',
      expect.stringMatching(/.*?stg.*?\/resolve\/batch/),
      [
        // NOTE: we only expect _one_ of the duplicated URLs to actually be sent to the backend
        {
          resourceUrl: `${hostname}/success`,
        },
        {
          resourceUrl: `${hostname}/notFound`,
        },
      ],
    );

    // NOTE: we still expect all three responses to be the same
    expect(responseFirst).toBe(mocks.success);
    expect(responseSecond).toBe(mocks.success);
    expect(responseThird).toBe(mocks.notFound);
  });

  it('successfully batches requests in same execution frame', async () => {
    mockRequest.mockImplementationOnce(async () => [
      { status: 200, body: mocks.success },
      { status: 200, body: mocks.unauthorized },
      { status: 200, body: mocks.notFound },
    ]);
    const client = new SmartCardClient('stg');
    const hostname = 'https://www.google.com';
    const [responseFirst, responseSecond, responseThird] = await Promise.all([
      client.fetchData(`${hostname}/1`),
      client.fetchData(`${hostname}/2`),
      client.fetchData(`${hostname}/3`),
    ]);
    expect(mockRequest).toBeCalled();
    expect(mockRequest).toBeCalledWith(
      'post',
      expect.stringMatching(/.*?stg.*?\/resolve\/batch/),
      [
        {
          resourceUrl: `${hostname}/1`,
        },
        {
          resourceUrl: `${hostname}/2`,
        },
        {
          resourceUrl: `${hostname}/3`,
        },
      ],
    );
    expect(responseFirst).toBe(mocks.success);
    expect(responseSecond).toBe(mocks.unauthorized);
    expect(responseThird).toBe(mocks.notFound);
  });

  it('postData()', async () => {
    const client = new SmartCardClient('stg');

    client.postData({
      action: {
        type: '',
        payload: {
          id: '',
        },
      },
      key: '',
      context: '',
    });
    expect(mockRequest).toBeCalled();
    expect(mockRequest).toBeCalledWith(
      'post',
      expect.stringMatching(/.*?stg.*?\/invoke/),
      {
        action: {
          type: '',
          payload: {
            id: '',
          },
        },
        key: '',
        context: '',
      },
    );
  });
});
