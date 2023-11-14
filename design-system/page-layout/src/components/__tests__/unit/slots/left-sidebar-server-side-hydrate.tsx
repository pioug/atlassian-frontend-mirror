import React from 'react';

import ReactDOM from 'react-dom';

import noop from '@atlaskit/ds-lib/noop';
import { getExamplesFor, ssr } from '@atlaskit/ssr';

jest.spyOn(global.console, 'error').mockImplementation(noop);

afterEach(() => {
  jest.resetAllMocks();
});

test('should ssr then hydrate page-layout correctly', async () => {
  const example = await getExamplesFor('page-layout');
  const Example = require(example[6].filePath).default;

  // @ts-ignore
  let localStorage = global.localStorage;
  // @ts-ignore
  delete global.localStorage;

  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example[6].filePath);

  // @ts-ignore
  global.localStorage = localStorage;

  ReactDOM.hydrate(<Example />, elem);

  // Ignore warnings caused by emotion's server-side rendering approach
  // Ignore `useLayoutEffect` errors (as they're intentional with `useMediaQuery`)
  // eslint-disable-next-line no-console
  const mockCalls = (console.error as jest.Mock).mock.calls;
  expect(mockCalls).toEqual([
    expect.arrayContaining([
      expect.stringMatching(
        /Warning.*useLayoutEffect does nothing on the server/,
      ),
    ]),
    expect.arrayContaining([
      expect.stringMatching(
        /Warning: Did not expect server HTML to contain a <%s> in <%s>/,
      ),
      'style',
    ]),
  ]);
});
