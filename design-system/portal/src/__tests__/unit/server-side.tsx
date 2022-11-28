import React from 'react';

import { waitFor } from '@testing-library/react';
import ReactDOM from 'react-dom';

import { getExamplesFor, ssr } from '@atlaskit/ssr';

const mockConsoleListener = jest.spyOn(global.console, 'error');

describe('server-side', () => {
  // this is just a little hack to silence a warning that we'll get until we
  // upgrade to 16.9. See also: https://github.com/facebook/react/pull/14853
  // eslint-disable-next-line no-console
  const originalError = console.error;
  beforeAll(() => {
    // eslint-disable-next-line no-console
    console.error = (...args) => {
      if (
        /^It looks like you're using a version of react-dom that supports the "act" function/.test(
          args[0],
        )
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterAll(() => {
    // eslint-disable-next-line no-console
    console.error = originalError;
  });

  test('should ssr then hydrate portal correctly', async () => {
    const examples: Array<{ filePath: string }> = await getExamplesFor(
      '@atlaskit/portal',
    );

    const example: { filePath: string } | undefined = examples.find(
      ({ filePath }) => filePath.endsWith('3-basic-portal.tsx'),
    );
    const Portal = require(example?.filePath ?? '').default;
    const elem = document.createElement('div');
    document.body.appendChild(elem);

    elem.innerHTML = await ssr(example?.filePath);

    expect(elem.innerHTML).toBe('');

    ReactDOM.hydrate(<Portal />, elem);

    await waitFor(() => {
      expect(
        document.body.querySelector('.atlaskit-portal-container'),
      ).toBeInTheDocument();

      expect(document.body.querySelector('.atlaskit-portal')?.innerHTML).toBe(
        '<h1>:wave:</h1>',
      );

      expect(mockConsoleListener.mock.calls.length).toBe(0);
    });
  });
});
