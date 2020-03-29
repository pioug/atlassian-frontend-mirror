import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import exenv from 'exenv';

import SectionMessage from '../..';

jest.mock('exenv', () => ({
  get canUseDOM() {
    return false;
  },
}));

// @ts-ignore - global usage
jest.spyOn(global.console, 'error');

afterEach(() => {
  jest.resetAllMocks();
});

const App = () => (
  <SectionMessage
    title="Lorem Ipsum"
    actions={[
      {
        href: 'https://en.wikipedia.org/wiki/Mary_Shelley',
        key: 'mary',
        text: 'Mary',
      },
    ]}
  >
    <p>Lorem Ipsum...</p>
  </SectionMessage>
);

test('should ssr then hydrate tag correctly', () => {
  const canUseDom = jest.spyOn(exenv, 'canUseDOM', 'get');

  // server-side
  canUseDom.mockReturnValue(false);
  const serverHTML = ReactDOMServer.renderToString(<App />);

  // client-side
  canUseDom.mockReturnValue(true);
  const elem = document.createElement('div');
  elem.innerHTML = serverHTML;

  ReactDOM.hydrate(<App />, elem);

  // eslint-disable-next-line no-console
  expect(console.error).not.toBeCalled();
});
