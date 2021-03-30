import React from 'react';

import { wait } from '@testing-library/react';
import ReactDOM from 'react-dom';

import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr } from '@atlaskit/ssr';

const mockConsoleListener = jest.spyOn(global.console, 'error');

test('should ssr then hydrate portal correctly', async () => {
  const examples: Array<{ filePath: string }> = await getExamplesFor(
    '@atlaskit/portal',
  );

  const example:
    | { filePath: string }
    | undefined = examples.find(({ filePath }) =>
    filePath.endsWith('3-basic-portal.tsx'),
  );
  const Portal = require(example?.filePath ?? '').default;
  const elem = document.createElement('div');
  document.body.appendChild(elem);

  elem.innerHTML = await ssr(example?.filePath);

  expect(elem.innerHTML).toBe('');

  ReactDOM.hydrate(<Portal />, elem);

  await wait(() => {
    expect(
      document.body.querySelector('.atlaskit-portal-container'),
    ).toBeInTheDocument();

    expect(document.body.querySelector('.atlaskit-portal')?.innerHTML).toBe(
      '<h1>:wave:</h1>',
    );

    expect(mockConsoleListener.mock.calls.length).toBe(0);
  });
});
