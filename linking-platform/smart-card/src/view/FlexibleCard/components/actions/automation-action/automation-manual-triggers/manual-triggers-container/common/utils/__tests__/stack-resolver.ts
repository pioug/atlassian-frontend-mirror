import { getAutomationStack } from '../stack-resolver';

const mockDevStack = {
  name: 'devpkang',
};

const mockPreProdStack = {
  prod: {
    otherStacks: [
      {
        stack: 'pre-prod',
        failedStack: false,
        releasedSuccessfully: false,
        rolledBackStack: false,
      },
    ],
  },
};

const mockDevStackFetchSuccess = () => {
  return jest.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () => mockDevStack,
    } as Response),
  );
};

const mockDevStackFetchFailure = () => {
  return jest.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.reject({
      ok: false,
      status: 404,
    } as Response),
  );
};

const mockPreProdStackFetch = () => {
  return jest.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () => mockPreProdStack,
    } as Response),
  );
};

describe('stack resolver', () => {
  let fetchMock: jest.SpyInstance;

  afterEach(() => {
    jest.restoreAllMocks();
    fetchMock.mockRestore();
    window.localStorage.clear();
  });

  it('should return pro stack if it is prod environment', async () => {
    fetchMock = mockPreProdStackFetch();

    const stack = await getAutomationStack('prod', 'cloudId');

    expect(stack).toEqual('pro');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should return pre-prod stack if it is pre-prod environment', async () => {
    fetchMock = mockPreProdStackFetch();

    const stack = await getAutomationStack('pre-prod', 'cloudId');

    expect(stack).toEqual('pre-prod');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should return dev stack if it is in dev environment', async () => {
    fetchMock = mockDevStackFetchSuccess();

    const stack = await getAutomationStack('dev', 'cloudId');

    expect(stack).toEqual('devpkang');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should fall back to local storage for dev stack if remote call fails', async () => {
    fetchMock = mockDevStackFetchFailure();
    localStorage.setItem('automationPlatform:automationStack', 'devpkang');

    const stack = await getAutomationStack('dev', 'cloudId');

    expect(stack).toEqual('devpkang');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should return staging if both remote call and local storage fails', async () => {
    fetchMock = mockDevStackFetchFailure();

    const stack = await getAutomationStack('dev', 'cloudId');

    expect(stack).toEqual('staging');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
