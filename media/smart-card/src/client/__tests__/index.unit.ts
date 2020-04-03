let mockRequest = jest.fn();
jest.mock('../api', () => ({
  request: (...args: any) => mockRequest(args[0], args[1], args[2]),
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
});
