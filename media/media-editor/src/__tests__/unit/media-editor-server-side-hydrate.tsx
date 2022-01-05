import React from 'react';
import ReactDOM from 'react-dom';
import waitForExpect from 'wait-for-expect';

import { getExamplesFor, ssr, mockConsole } from '@atlaskit/ssr';

const getConsoleMockCalls = mockConsole(console);

afterEach(() => {
  jest.resetAllMocks();
});

test('should ssr then hydrate media-editor correctly', async () => {
  const [example] = await getExamplesFor('media-editor');
  const Example = require(example.filePath).default;
  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  await waitForExpect(() => {
    ReactDOM.hydrate(<Example />, elem);
    const mockCalls = getConsoleMockCalls();
    expect(mockCalls.length).toBe(0);
  });
});
