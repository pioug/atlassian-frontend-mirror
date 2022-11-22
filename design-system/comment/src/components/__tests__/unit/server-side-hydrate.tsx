/** @jsx jsx */
import noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrate, ssr } from '@atlaskit/ssr/emotion';

const commentPath = require.resolve(
  '../../../../examples/01-example-comment.tsx',
);

jest.spyOn(global.console, 'error').mockImplementation(noop);

afterEach(() => {
  // Check cleanup
  cleanup();
  // reset mocks
  jest.resetAllMocks();
});

test('should ssr then hydrate nested styles correctly', async () => {
  const elem = document.createElement('div');
  const { html, styles } = await ssr(commentPath);

  elem.innerHTML = html;
  hydrate(commentPath, elem, styles);

  // No other errors from e.g. hydrate
  // eslint-disable-next-line no-console
  const mockCalls = (console.error as jest.Mock).mock.calls;
  expect(mockCalls.length).toBe(0);
});
