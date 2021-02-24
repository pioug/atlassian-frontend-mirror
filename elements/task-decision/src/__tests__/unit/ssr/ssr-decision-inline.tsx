import { ssr_hydrate } from '@atlaskit/elements-test-helpers';

describe('SSR - Decision Inline ', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'error');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test('rendering and hydration are ok', async () => {
    await ssr_hydrate(__dirname, './samples/_decision-inline.tsx');
    // ignore warnings caused by emotion's server-side rendering approach
    // @ts-ignore
    // eslint-disable-next-line no-console
    const mockCalls = console.error.mock.calls.filter(
      ([f, s]: string[]) =>
        !(
          f ===
            'Warning: Did not expect server HTML to contain a <%s> in <%s>.' &&
          s === 'style'
        ),
    );
    expect(mockCalls).toHaveLength(0);
  });
});
