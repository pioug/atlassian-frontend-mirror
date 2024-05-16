import { act, waitFor } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

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
  await waitFor(
    async () => await hydrateWithAct(examplePath, elem, styles, true),
  );

  await act(async () => {
    // No other errors from e.g. hydrate
    // eslint-disable-next-line no-console
    const mockCalls = (console.error as jest.Mock).mock.calls;
    expect(mockCalls.length).toBe(0);
  });
});
