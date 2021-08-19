import { EditorCardProvider } from '..';
import { ORSProvidersResponse } from '../types';

const mockProvidersResponse: ORSProvidersResponse = {
  providers: [
    {
      key: 'google-object-provider',
      patterns: [
        {
          source:
            '^https:\\/\\/docs.google.com\\/(?:spreadsheets|document|presentation)\\/d\\/[^\\\\]+\\/|^https:\\/\\/drive.google.com\\/file\\/d\\/[^\\\\]+\\/|^https:\\/\\/drive.google.com\\/open\\?id=[^&]+|^https:\\/\\/drive.google.com\\/drive\\/u\\/\\d+\\/folders\\/[^&\\?]+|^https:\\/\\/drive.google.com\\/drive\\/folders\\/[^&\\?]+',
          flags: '',
        },
      ],
    },
    {
      key: 'jira-object-provider',
      patterns: [
        {
          source:
            '^https:\\/\\/.*?\\.jira-dev\\.com\\/browse\\/([a-zA-Z0-9]+-\\d+)#?.*?\\/?$',
          flags: '',
        },
        {
          source:
            '^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/software\\/(c\\/)?projects\\/([^\\/]+?)\\/boards\\/(\\d+)\\/roadmap\\/?',
          flags: '',
        },
      ],
    },
    {
      key: 'slack-object-provider',
      patterns: [
        {
          source:
            '^https:\\/\\/.+?\\.slack\\.com\\/archives\\/[CG][A-Z0-9][^/]+\\/?$|^https:\\/\\/app\\.slack\\.com\\/client\\/T[A-Z0-9]+\\/[CG][A-Z0-9][^/]+\\/?$|^https:\\/\\/.+?\\.slack\\.com\\/archives\\/[CG][A-Z0-9][^/]+\\/p[0-9]+(\\?.*)?$',
          flags: '',
        },
      ],
    },
    {
      key: 'polaris-object-provider',
      patterns: [
        {
          source:
            '^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/polaris\\/projects\\/[^\\/]+?\\/ideas\\/view\\/\\d+',
          flags: '',
        },
      ],
    },
  ],
};

describe('providers > editor', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    (global as any).fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete (global as any).fetch;
  });

  it('returns inlineCard when calling /providers endpoint', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => mockProvidersResponse,
      ok: true,
    }));
    const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
    const adf = await provider.resolve(url, 'inline');
    expect(adf).toEqual({
      type: 'inlineCard',
      attrs: {
        url,
      },
    });
  });

  it('returns blockCard when calling /providers endpoint', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => mockProvidersResponse,
      ok: true,
    }));
    const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
    const adf = await provider.resolve(url, 'block');
    expect(adf).toEqual({
      type: 'blockCard',
      attrs: {
        url,
      },
    });
  });

  it('returns embedCard when roadmap embed inserted, calling /providers endpoint', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => mockProvidersResponse,
      ok: true,
    }));
    const url =
      'https://jdog.jira-dev.com/jira/software/projects/DL39857/boards/3186/roadmap';
    const adf = await provider.resolve(url, 'inline');
    expect(adf).toEqual({
      type: 'embedCard',
      attrs: {
        url,
        layout: 'wide',
      },
    });
  });

  it('returns embedCard when roadmap embed with query parameter inserted, calling /providers endpoint', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => mockProvidersResponse,
      ok: true,
    }));
    const url =
      'https://jdog.jira-dev.com/jira/software/projects/DL39857/boards/3186/roadmap?shared=&atlOrigin=eyJpIjoiYmFlNzRlMzAyYjAyNDlkZTgxZDc5ZTIzYmNlZmI5MjAiLCJwIjoiaiJ9';
    const adf = await provider.resolve(url, 'inline');
    expect(adf).toEqual({
      type: 'embedCard',
      attrs: {
        url,
        layout: 'wide',
      },
    });
  });

  it('returns embedCard when classic roadmap embed inserted, calling /providers endpoint', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => mockProvidersResponse,
      ok: true,
    }));
    const url =
      'https://jdog.jira-dev.com/jira/software/c/projects/DL39857/boards/3186/roadmap';
    const adf = await provider.resolve(url, 'inline');
    expect(adf).toEqual({
      type: 'embedCard',
      attrs: {
        url,
        layout: 'wide',
      },
    });
  });

  it('returns blockCard when Slack message link inserted, calling /providers endpoint', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => mockProvidersResponse,
      ok: true,
    }));
    const url =
      'https://atlassian.slack.com/archives/C014W1DTRHS/p1614244582005100';
    const adf = await provider.resolve(url, 'inline');
    expect(adf).toEqual({
      type: 'blockCard',
      attrs: {
        url,
      },
    });
  });

  it('returns blockCard when Slack message in thread link inserted, calling /providers endpoint', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => mockProvidersResponse,
      ok: true,
    }));
    const url =
      'https://atlassian.slack.com/archives/C014W1DTRHS/p1614306173007200?thread_ts=1614244582.005100&cid=C014W1DTRHS';
    const adf = await provider.resolve(url, 'inline');
    expect(adf).toEqual({
      type: 'blockCard',
      attrs: {
        url,
      },
    });
  });

  it('returns embedCard when Polaris view link inserted, calling /providers endpoint', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => mockProvidersResponse,
      ok: true,
    }));
    const url =
      'https://polaris-v0.jira-dev.com/jira/polaris/projects/CS10/ideas/view/8981';
    const adf = await provider.resolve(url, 'inline');
    expect(adf).toEqual({
      type: 'embedCard',
      attrs: {
        url,
        layout: 'wide',
      },
    });
  });

  it('returns inlineCard when calling /providers endpoint, with fallback to /check', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => mockProvidersResponse,
      ok: true,
    }));
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => ({ isSupported: true }),
      ok: true,
    }));
    const url = 'https://drive.google.com/file/123';
    const adf = await provider.resolve(url, 'inline');
    expect(adf).toEqual({
      type: 'inlineCard',
      attrs: {
        url,
      },
    });
  });

  it('returns undefined when calling /providers endpoint, with fallback to /check, not supported', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => mockProvidersResponse,
    }));
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => ({ isSupported: false }),
    }));
    const url = 'https://drive.google.com/file/123';
    const promise = provider.resolve(url, 'inline');
    await expect(promise).rejects.toEqual(undefined);
  });

  it('returns undefined when calling /providers endpoint, with fallback to /check, both fail', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => {
        throw Error();
      },
    }));
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => {
        throw Error();
      },
    }));
    const url = 'https://drive.google.com/file/123';
    const promise = provider.resolve(url, 'inline');
    await expect(promise).rejects.toEqual(undefined);
  });

  it('calls /providers endpoint only once', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockImplementationOnce(async () => ({
      json: async () => mockProvidersResponse,
      ok: true,
    }));
    await Promise.all([
      provider.resolve('https://drive.google.com/file/d/123/view', 'inline'),
      provider.resolve('https://drive.google.com/file/d/456/view', 'inline'),
      provider.resolve('https://drive.google.com/file/d/789/view', 'inline'),
    ]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
