import __noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrate, ssr } from '@atlaskit/ssr/emotion';

jest.spyOn(global.console, 'error').mockImplementation(__noop);

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

it('should ssr then hydrate basic example correctly', async () => {
  const examplePath = require.resolve('../../examples/basic.tsx');

  const elem = document.createElement('div');
  const { html, styles } = await ssr(examplePath);

  elem.innerHTML = html;
  hydrate(examplePath, elem, styles);

  // No other errors from e.g. hydrate
  // eslint-disable-next-line no-console
  const mockCalls = (console.error as jest.Mock).mock.calls;
  expect(mockCalls.length).toBe(0);
});

it('should ssr then hydrate themed example correctly', async () => {
  const examplePath = require.resolve('../../examples/themed.tsx');

  const elem = document.createElement('div');
  const { html, styles } = await ssr(examplePath);

  elem.innerHTML = html;
  hydrate(examplePath, elem, styles);

  // eslint-disable-next-line no-console
  const mockCalls = (console.error as jest.Mock).mock.calls;
  expect(mockCalls.length).toBe(0);
});
