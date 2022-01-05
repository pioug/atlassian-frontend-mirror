import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import waitForExpect from 'wait-for-expect';

import { getExamplesFor } from '@atlaskit/ssr';

test('media-card server side rendering', async () => {
  const examples = await getExamplesFor('media-card');
  for (const example of examples) {
    const Example = require(example.filePath).default;
    await waitForExpect(() => {
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    });
  }
});
