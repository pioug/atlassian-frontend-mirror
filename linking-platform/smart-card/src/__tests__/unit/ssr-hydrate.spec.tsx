import React from 'react';

import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import { getExamplesFor } from '@atlaskit/ssr';

// @ts-ignore
jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
  jest.resetAllMocks();
});

test('should ssr then hydrate example component correctly', async () => {
  const examples = await getExamplesFor('smart-card');

  const filepath = examples.find((example) =>
    example.filePath.endsWith('examples/14-ssr.tsx'),
  )!.filePath;

  const Example = require(filepath).default; // eslint-disable-line import/no-dynamic-require

  const elem = document.createElement('div');

  elem.innerHTML = ReactDOMServer.renderToString(React.createElement(Example));

  ReactDOM.hydrate(<Example />, elem);

  expect(elem.innerHTML).toContain('inline-card-resolved-view');
  expect(elem.innerHTML).toContain('smart-block-title-resolved-view');
});
