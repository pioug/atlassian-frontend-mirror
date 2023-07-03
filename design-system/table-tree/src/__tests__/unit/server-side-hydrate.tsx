import __noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrate, ssr } from '@atlaskit/ssr/emotion';

jest.spyOn(global.console, 'error').mockImplementation(__noop);

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

const examplePath = require.resolve(
  '../../../examples/controlled-expanded-state.tsx',
);

test('should ssr then hydrate table-tree correctly', async () => {
  const elem = document.createElement('div');

  const { html, styles } = await ssr(examplePath);
  elem.innerHTML = html;
  hydrate(examplePath, elem, styles);

  // No other errors from e.g. hydrate
  // eslint-disable-next-line no-console
  const mockCalls = (console.error as jest.Mock).mock.calls;
  expect(mockCalls.length).toBe(0);
});
