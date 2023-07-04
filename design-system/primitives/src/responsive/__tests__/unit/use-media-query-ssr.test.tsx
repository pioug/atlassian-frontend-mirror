/** @jsx jsx */
import noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrate, ssr } from '@atlaskit/ssr/emotion';

const example = require.resolve('../../../../examples/50-use-media-query.tsx');

jest.spyOn(global.console, 'error').mockImplementation(noop);

afterEach(() => {
  // Check cleanup
  cleanup();
  // reset mocks
  jest.resetAllMocks();
});

test('should ssr without errors', async () => {
  const elem = document.createElement('div');
  const { html, styles } = await ssr(example);

  elem.innerHTML = html;
  hydrate(example, elem, styles);

  // Because this hook does not work in SSR, it returns `null`, which renders "unknown" in our example:
  expect(html).toEqual('<div>unknown</div>');

  // We only get `useLayoutEffect` errors (as intended)
  // eslint-disable-next-line no-console
  const mockCalls = (console.error as jest.Mock).mock.calls;
  expect(mockCalls).toEqual([
    expect.arrayContaining([
      expect.stringMatching(
        /Warning.*useLayoutEffect does nothing on the server/,
      ),
    ]),
  ]);
});
