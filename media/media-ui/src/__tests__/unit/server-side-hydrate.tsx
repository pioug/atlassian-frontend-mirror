import React from 'react';
import ReactDOM from 'react-dom';
import waitForExpect from 'wait-for-expect';

import { getExamplesFor, mockConsole, ssr } from '@atlaskit/ssr';

const getConsoleMockCalls = mockConsole(console);

afterEach(() => {
  jest.resetAllMocks();
});

test('should ssr then hydrate media-ui correctly', async () => {
  const [example] = await getExamplesFor('media-ui');
  const Example = require(example.filePath).default;
  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);
  ReactDOM.hydrate(<Example />, elem);
  await waitForExpect(() => {
    const mockCalls = getConsoleMockCalls();
    expect(mockCalls.length).toBe(0);
  });
});
