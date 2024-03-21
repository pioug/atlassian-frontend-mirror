import noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrate, ssr } from '@atlaskit/ssr/emotion';

test('should ssr then hydrate correctly', async () => {
  const examplePath = require.resolve(
    '../../../../examples/50-use-media-query.tsx',
  );
  const consoleMock = jest.spyOn(console, 'error').mockImplementation(noop);
  const elem = document.createElement('div');
  const { html, styles } = await ssr(examplePath);
  elem.innerHTML = html;
  hydrate(examplePath, elem, styles);

  // eslint-disable-next-line no-console
  const mockCalls = (console.error as jest.Mock).mock.calls;
  expect(mockCalls).toEqual([
    expect.arrayContaining([
      expect.stringMatching(
        /Warning.*useLayoutEffect does nothing on the server/,
      ),
    ]),
  ]);

  cleanup();
  consoleMock.mockRestore();
});
