import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

describe('SSR - Task Inline', () => {
  const examplePath = require.resolve('./samples/_task-inline.tsx');

  beforeEach(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean-up SSR Emotion styles
    cleanup();
    // Reset mock data
    jest.clearAllMocks();
  });

  test('rendering and hydration are ok', async () => {
    const elem = document.createElement('div');
    const { html, styles } = await ssr(examplePath);

    elem.innerHTML = html;
    await hydrateWithAct(examplePath, elem, styles);

    // No other errors from e.g. hydrate
    // eslint-disable-next-line no-console
    const mockCalls = (console.error as jest.Mock).mock.calls;
    expect(mockCalls).toHaveLength(0);
  });
});
