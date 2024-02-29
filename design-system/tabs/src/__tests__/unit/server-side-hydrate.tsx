import noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrate, ssr } from '@atlaskit/ssr/emotion';
declare var global: any;

jest.spyOn(global.console, 'error').mockImplementation(noop);

afterEach(() => {
  jest.resetAllMocks();
});

test('should ssr then hydrate tabs correctly', async () => {
  const tabExamplePath = require.resolve(
    '../../../examples/00-default-tabs.tsx',
  );
  const consoleMock = jest.spyOn(console, 'error').mockImplementation(noop);
  const elem = document.createElement('div');
  const { html, styles } = await ssr(tabExamplePath);
  elem.innerHTML = html;
  hydrate(tabExamplePath, elem, styles);

  // eslint-disable-next-line no-console
  const mockCalls = (console.error as jest.Mock).mock.calls;
  expect(mockCalls.length).toBe(0);

  cleanup();
  consoleMock.mockRestore();
});
