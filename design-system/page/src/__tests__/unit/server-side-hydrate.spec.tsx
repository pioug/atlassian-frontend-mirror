import { act, waitFor } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

test('should ssr then hydrate page correctly', async () => {
  const pageExamplePath = require.resolve(
    '../../../examples/00-basic-usage.tsx',
  );
  const consoleMock = jest.spyOn(console, 'error').mockImplementation(__noop);

  const elem = document.createElement('div');
  const { html, styles } = await ssr(pageExamplePath);
  elem.innerHTML = html;
  await waitFor(
    async () => await hydrateWithAct(pageExamplePath, elem, styles, true),
  );

  await act(async () => {
    // eslint-disable-next-line no-console
    const mockCalls = (console.error as jest.Mock).mock.calls;
    expect(mockCalls.length).toBe(0);

    cleanup();
    consoleMock.mockRestore();
  });
});
