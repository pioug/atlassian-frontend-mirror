import React from 'react';
import ReactDOM from 'react-dom';
import waitForExpect from 'wait-for-expect';

import { getExamplesFor, mockConsole, ssr } from '@atlaskit/ssr';

const getConsoleMockCalls = mockConsole(console);

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

test('should ssr then hydrate media-picker correctly', async () => {
  const [example] = await getExamplesFor('media-picker');
  const Example = require(example.filePath).default;
  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  await waitForExpect(() => {
    ReactDOM.hydrate(<Example />, elem);
    const mockCalls = getConsoleMockCalls();
    expect(mockCalls.length).toBe(0);
  });
});
