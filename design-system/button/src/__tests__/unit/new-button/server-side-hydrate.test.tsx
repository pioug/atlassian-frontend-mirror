import noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrate, ssr } from '@atlaskit/ssr/emotion';

jest.spyOn(global.console, 'error').mockImplementation(noop);

const buttonPath = require.resolve('../../../../examples/05-button.tsx');
const iconButtonPath = require.resolve(
  '../../../../examples/07-icon-button.tsx',
);

afterEach(() => {
  // Check cleanup
  cleanup();
  // reset mocks
  jest.resetAllMocks();
});

test('should SSR then hydrate button correctly', async () => {
  const elem = document.createElement('div');
  const { html, styles } = await ssr(buttonPath);

  elem.innerHTML = html;
  hydrate(buttonPath, elem, styles);

  // No other errors from e.g. hydrate
  // eslint-disable-next-line no-console
  const mockCalls = (console.error as jest.Mock).mock.calls;
  expect(mockCalls.length).toBe(0);
});

test('should SSR then hydrate icon button correctly', async () => {
  const elem = document.createElement('div');
  const { html, styles } = await ssr(iconButtonPath);

  elem.innerHTML = html;
  hydrate(iconButtonPath, elem, styles);

  // No other errors from e.g. hydrate
  // eslint-disable-next-line no-console
  const mockCalls = (console.error as jest.Mock).mock.calls;
  expect(mockCalls.length).toBe(0);
});
