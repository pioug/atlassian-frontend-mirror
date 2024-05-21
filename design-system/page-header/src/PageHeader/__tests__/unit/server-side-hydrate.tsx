import { act, waitFor } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';
import { cleanup, hydrateWithAct, ssr } from '@atlaskit/ssr/emotion';

test('should ssr then hydrate correctly', async () => {
  const examplePath = require.resolve('../../../../examples/01-default.tsx');
  const consoleMock = jest.spyOn(console, 'error').mockImplementation(noop);
  const elem = document.createElement('div');
  const { html, styles } = await ssr(examplePath);
  elem.innerHTML = html;
  await waitFor(
    async () => await hydrateWithAct(examplePath, elem, styles, true),
  );

  await act(async () => {
    // eslint-disable-next-line no-console
    const mockCalls = (console.error as jest.Mock).mock.calls;
    expect(mockCalls.length).toBe(0);

    cleanup();
    consoleMock.mockRestore();
  });
});
