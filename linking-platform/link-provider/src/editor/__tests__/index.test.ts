import { EditorCardProvider } from '..';
import { ORSProvidersResponse } from '../types';

const getMockProvidersResponse = (
  overridePolarisDefaultView: boolean = false,
): ORSProvidersResponse => ({
  providers: [
    {
      key: 'google-object-provider',
      patterns: [
        {
          source:
            '^https:\\/\\/docs.google.com\\/(?:spreadsheets|document|presentation)\\/d\\/[^\\\\]+\\/|^https:\\/\\/drive.google.com\\/file\\/d\\/[^\\\\]+\\/|^https:\\/\\/drive.google.com\\/open\\?id=[^&]+|^https:\\/\\/drive.google.com\\/drive\\/u\\/\\d+\\/folders\\/[^&\\?]+|^https:\\/\\/drive.google.com\\/drive\\/folders\\/[^&\\?]+',
        },
      ],
    },
    {
      key: 'provider-with-default-view',
      patterns: [
        {
          source: '^https:\\/\\/site-with-default-view.com\\/.*?/?$',
          defaultView: 'embed',
        },
      ],
    },
    {
      key: 'jira-object-provider',
      patterns: [
        {
          source:
            '^https:\\/\\/.*?\\.jira-dev\\.com\\/browse\\/([a-zA-Z0-9]+-\\d+)#?.*?\\/?$',
        },
        {
          source:
            '^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/software\\/(c\\/)?projects\\/([^\\/]+?)\\/boards\\/(\\d+)\\/roadmap\\/?',
        },
        {
          source:
            '^https:\\/\\/.*?\\.jira-dev\\.com\\/jira\\/core\\/projects\\/(?<resourceId>\\w+)\\/(timeline|calendar|list|board)\\/?',
        },
      ],
    },
    {
      key: 'slack-object-provider',
      patterns: [
        {
          source:
            '^https:\\/\\/.+?\\.slack\\.com\\/archives\\/[CG][A-Z0-9][^/]+\\/?$|^https:\\/\\/app\\.slack\\.com\\/client\\/T[A-Z0-9]+\\/[CG][A-Z0-9][^/]+\\/?$|^https:\\/\\/.+?\\.slack\\.com\\/archives\\/[CG][A-Z0-9][^/]+\\/p[0-9]+(\\?.*)?$',
        },
      ],
    },
    {
      key: 'polaris-object-provider',
      patterns: [
        {
          source:
            '^https:\\/\\/.*?\\/jira\\/polaris\\/projects\\/[^\\/]+?\\/ideas\\/view\\/\\d+$|^https:\\/\\/.*?\\/secure\\/JiraProductDiscoveryAnonymous\\.jspa\\?hash=\\w+|^https:\\/\\/.*?\\/jira\\/polaris\\/share\\/\\w+',
          ...(overridePolarisDefaultView ? { defaultView: 'block' } : {}),
        },
      ],
    },
  ],
});

const expectedInlineAdf = (url: string) => ({
  type: 'inlineCard',
  attrs: {
    url,
  },
});

const expectedEmbedAdf = (url: string) => ({
  type: 'embedCard',
  attrs: {
    url,
    layout: 'wide',
  },
});

const expectedBlockAdf = (url: string) => ({
  type: 'blockCard',
  attrs: {
    url,
  },
});

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
    mockFetch.mockResolvedValueOnce({
      json: async () => getMockProvidersResponse(),
      ok: true,
    });
    const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
    const adf = await provider.resolve(url, 'inline');
    expect(adf).toEqual(expectedInlineAdf(url));
  });

  it('returns blockCard when calling /providers endpoint', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockResolvedValueOnce({
      json: async () => getMockProvidersResponse(),
      ok: true,
    });
    const url = 'https://drive.google.com/file/d/123/view?usp=sharing';
    const adf = await provider.resolve(url, 'block');
    expect(adf).toEqual(expectedBlockAdf(url));
  });

  it.each<[string, string]>([
    [
      'Slack message',
      'https://atlassian.slack.com/archives/C014W1DTRHS/p1614244582005100',
    ],
    [
      'Slack message in thread',
      'https://atlassian.slack.com/archives/C014W1DTRHS/p1614306173007200?thread_ts=1614244582.005100&cid=C014W1DTRHS',
    ],
  ])(
    'returns inline when %s link inserted, calling /providers endpoint',
    async (_, url) => {
      const provider = new EditorCardProvider();
      mockFetch.mockResolvedValueOnce({
        json: async () => getMockProvidersResponse(),
        ok: true,
      });
      const adf = await provider.resolve(url, 'inline');
      expect(adf).toEqual(expectedInlineAdf(url));
    },
  );

  it.each<[string, string]>([
    [
      'roadmap embed',
      'https://jdog.jira-dev.com/jira/software/projects/DL39857/boards/3186/roadmap',
    ],
    [
      'roadmap embed with query parameter',
      'https://jdog.jira-dev.com/jira/software/projects/DL39857/boards/3186/roadmap?shared=&atlOrigin=eyJpIjoiYmFlNzRlMzAyYjAyNDlkZTgxZDc5ZTIzYmNlZmI5MjAiLCJwIjoiaiJ9',
    ],
    [
      'classic roadmap embed',
      'https://jdog.jira-dev.com/jira/software/c/projects/DL39857/boards/3186/roadmap',
    ],
    [
      'Polaris view link',
      'https://polaris-v0.jira-dev.com/jira/polaris/projects/CS10/ideas/view/8981',
    ],
    [
      'Polaris anonymous share view',
      'https://polaris-v0.jira-dev.com/jira/polaris/share/b2029c50914309acb37699615b1137da5',
    ],
    [
      'Polaris anonymous share view fullscreen',
      'https://polaris-v0.jira-dev.com/jira/polaris/share/89cb70599021ac29e227fc49c56782969?fullscreen=true',
    ],
    [
      'Polaris anonymous resolved view',
      'https://polaris-v0.jira-dev.com/secure/JiraProductDiscoveryAnonymous.jspa?hash=b2029c50914309acb37699615b1137da5',
    ],
    [
      'Jira work management (JWM) timeline view',
      'https://jdog.jira-dev.com/jira/core/projects/NPM5/timeline',
    ],
    [
      'Jira work management (JWM) calendar view',
      'https://jdog.jira-dev.com/jira/core/projects/NPM5/calendar',
    ],
    [
      'Jira work management (JWM) list view',
      'https://jdog.jira-dev.com/jira/core/projects/NPM5/list',
    ],
    [
      'Jira work management (JWM) board view',
      'https://jdog.jira-dev.com/jira/core/projects/NPM5/board',
    ],
  ])(
    'returns embedCard when  %s link inserted, calling /providers endpoint',
    async (_, url) => {
      const provider = new EditorCardProvider();
      mockFetch.mockResolvedValueOnce({
        json: async () => getMockProvidersResponse(),
        ok: true,
      });
      const adf = await provider.resolve(url, 'inline');
      expect(adf).toEqual(expectedEmbedAdf(url));
    },
  );

  it('returns inlineCard when calling /providers endpoint, with fallback to /check', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockResolvedValueOnce({
      json: async () => getMockProvidersResponse(),
      ok: true,
    });
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ isSupported: true }),
      ok: true,
    });
    const url = 'https://drive.google.com/file/123';
    const adf = await provider.resolve(url, 'inline');
    expect(adf).toEqual(expectedInlineAdf(url));
  });

  it('returns undefined when calling /providers endpoint, with fallback to /check, not supported', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockResolvedValueOnce({
      json: async () => getMockProvidersResponse(),
    });
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ isSupported: false }),
    });
    const url = 'https://drive.google.com/file/123';
    const promise = provider.resolve(url, 'inline');
    await expect(promise).rejects.toEqual(undefined);
  });

  it('returns undefined when calling /providers endpoint, with fallback to /check, both fail', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockResolvedValueOnce({
      json: async () => {
        throw Error();
      },
    });
    mockFetch.mockResolvedValueOnce({
      json: async () => {
        throw Error();
      },
    });
    const url = 'https://drive.google.com/file/123';
    const promise = provider.resolve(url, 'inline');
    await expect(promise).rejects.toEqual(undefined);
  });

  it('calls /providers endpoint only once', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockResolvedValueOnce({
      json: async () => getMockProvidersResponse(),
      ok: true,
    });
    await Promise.all([
      provider.resolve('https://drive.google.com/file/d/123/view', 'inline'),
      provider.resolve('https://drive.google.com/file/d/456/view', 'inline'),
      provider.resolve('https://drive.google.com/file/d/789/view', 'inline'),
    ]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should return EmbedCard when defaultView specifies it', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockResolvedValueOnce({
      json: async () => getMockProvidersResponse(),
      ok: true,
    });
    const url = 'https://site-with-default-view.com/testing';
    const adf = await provider.resolve(url, 'inline');
    expect(adf).toEqual(expectedEmbedAdf(url));
  });

  it('should find pattern for a link', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockResolvedValueOnce({
      json: async () => getMockProvidersResponse(),
      ok: true,
    });
    const url = 'https://site-with-default-view.com/testing';
    expect(await provider.findPattern(url)).toBe(true);
  });

  it('should not find pattern for a link', async () => {
    const provider = new EditorCardProvider();
    mockFetch.mockResolvedValueOnce({
      json: async () => getMockProvidersResponse(),
      ok: true,
    });
    const url = 'https://site-without-pattern.com';
    expect(await provider.findPattern(url)).toBe(false);
  });
});
