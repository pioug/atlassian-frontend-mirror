import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';

test.skip('media-filmstrip server side rendering', async (done) => {
  const examples = await getExamplesFor('media-filmstrip');
  for (const example of examples) {
    const Example = require(example.filePath).default;

    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  }
  done();
});
