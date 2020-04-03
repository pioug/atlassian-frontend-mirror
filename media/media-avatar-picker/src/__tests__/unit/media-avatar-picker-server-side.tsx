import React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Example from '../../../examples/4-avatar-picker-with-predefined-avatar';

test.skip('media-avatar-picker server side rendering', async () => {
  expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
});
