import { JSDOM } from 'jsdom';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { token } from '@atlaskit/tokens';
import Loadable from 'react-loadable';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cssResetStyles from '@atlaskit/css-reset';
import { url, cardState } from '@atlaskit/media-test-helpers/smart-card-state';

const { window } = new JSDOM('', { url: 'http://localhost/' });
(global as any).window = window;
(global as any).performance = window.performance;
(global as any).navigator = window.navigator;
(global as any).document = window.document;

describe('SSR support', () => {
  const CarWrapper = () => {
    const { CardSSR } = require('../../ssr');
    const { Provider, Client } = require('../../index');
    const client = new Client('stg');
    const storeOptions = {
      initialState: {
        [url]: cardState,
      },
    };

    return (
      <Provider storeOptions={storeOptions} client={client}>
        <div
          data-testid="card-wrapper"
          style={{
            width: '680px',
            padding: token('space.250', '20px'),
          }}
        >
          <CardSSR appearance="inline" url={url} />
        </div>
      </Provider>
    );
  };
  const buildHtmlString = (bodyHtml: string) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SmartCard SSR Example</title>
          <style>${cssResetStyles}</style>
          ${(global as any).document.querySelector('head').innerHTML}
        </head>
        <body>${bodyHtml}</body>
      </html>
    `;
  };
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  it('should renderer loaded card when data is provided', async () => {
    const element = React.createElement(CarWrapper);

    await Loadable.preloadAll();

    const html = ReactDOMServer.renderToString(element);
    const htmlString = buildHtmlString(html);

    await page.setContent(htmlString);
    await page.waitForSelector('[data-testid="inline-card-resolved-view"]');
    const cardWrapper = await page.$('[data-testid="card-wrapper"]');
    const image = await cardWrapper?.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
});
