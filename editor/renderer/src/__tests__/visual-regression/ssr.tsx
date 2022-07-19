import { JSDOM } from 'jsdom';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import Loadable from 'react-loadable';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cssResetStyles from '@atlaskit/css-reset';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { Provider, Client } from '@atlaskit/smart-card';
import { snapshot } from './_utils';
import doc from './__fixtures__/renderer-ssr.adf.json';
import resizedImagedoc from './__fixtures__/ssr-resized-image.adf.json';
import resizedMedia from './__fixtures__/ssr-resized-media.adf.json';
import smartCardAdf from './__fixtures__/ssr-smart-card.adf.json';
import { IntlProvider } from 'react-intl-next';
import { url, cardState } from '@atlaskit/media-test-helpers/smart-card-state';

const { window } = new JSDOM('', { url: 'http://localhost/' });
(global as any).window = window;
(global as any).performance = window.performance;
(global as any).navigator = window.navigator;
(global as any).document = window.document;

describe('ssr for renderer', () => {
  interface CustomProvidersProps {
    children?: JSX.Element;
    [k: string]: any;
  }

  const CustomProviders = (props: {
    children?: JSX.Element;
    [k: string]: any;
  }) => {
    const { children, ...rest } = props;
    return (
      <div {...rest}>
        <IntlProvider locale="en">{children}</IntlProvider>
      </div>
    );
  };
  const buildHtmlString = (bodyHtml: string) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Renderer SSR Example</title>
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

  // FIXME: Unskip via https://product-fabric.atlassian.net/browse/ED-15263
  it.skip('should not throw when rendering any example on the server', async () => {
    const { ReactRenderer } = require('../../index');
    const element = React.createElement<CustomProvidersProps>(
      CustomProviders,
      { style: { margin: '0 auto' } },
      React.createElement(ReactRenderer, {
        document: doc,
        schema: defaultSchema,
        appearance: 'full-page',
        enableSsrInlineScripts: true,
      }),
    );

    await Loadable.preloadAll();

    const html = ReactDOMServer.renderToString(element);
    const htmlString = buildHtmlString(html);

    await page.setViewport({ width: 1420, height: 2400 });
    await page.setContent(htmlString);

    await snapshot(page);
  });

  // FIXME: Unskip via https://product-fabric.atlassian.net/browse/ED-15288
  it.skip('should render image right dimensions for a resized image on the server', async () => {
    const { ReactRenderer } = require('../../index');
    const element = React.createElement(
      CustomProviders,
      { style: { margin: '0 auto' } },
      React.createElement(ReactRenderer, {
        document: resizedImagedoc,
        schema: defaultSchema,
        appearance: 'full-page',
        enableSsrInlineScripts: true,
      }),
    );

    await Loadable.preloadAll();

    const html = ReactDOMServer.renderToString(element);
    const htmlString = buildHtmlString(html);

    await page.setViewport({ width: 500, height: 500 });
    await page.setContent(htmlString, {
      waitUntil: 'networkidle0',
    });
    await snapshot(page);
  });

  it('should render correct media right dimensions for resized media on the server', async () => {
    const { ReactRenderer } = require('../../index');
    const element = React.createElement(
      CustomProviders,
      { style: { margin: '0 auto' } },
      React.createElement(ReactRenderer, {
        document: resizedMedia,
        schema: defaultSchema,
        appearance: 'full-page',
        enableSsrInlineScripts: true,
      }),
    );

    await Loadable.preloadAll();

    const html = ReactDOMServer.renderToString(element);
    const htmlString = buildHtmlString(html);

    await page.setViewport({ width: 1420, height: 2400 });
    // expected 237 x 331
    await page.setContent(htmlString, {
      waitUntil: 'networkidle0',
    });
    await snapshot(page);
  });

  it('should render resolved smart-card on the server', async () => {
    const { ReactRenderer } = require('../../index');
    const storeOptions = {
      initialState: {
        [url]: cardState,
      },
    };
    const SmartCardRendererWrapper = () => {
      return (
        <IntlProvider locale="en">
          <Provider storeOptions={storeOptions} client={new Client('staging')}>
            <ReactRenderer
              document={smartCardAdf}
              schema={defaultSchema}
              appearance="full-page"
              enableSsrInlineScripts={true}
              smartLinks={{
                ssr: true,
              }}
            />
          </Provider>
        </IntlProvider>
      );
    };
    const element = React.createElement(
      CustomProviders,
      { style: { margin: '0 auto' } },
      React.createElement(SmartCardRendererWrapper, {
        document: resizedImagedoc,
        schema: defaultSchema,
        appearance: 'full-page',
        enableSsrInlineScripts: true,
      }),
    );

    await Loadable.preloadAll();

    const html = ReactDOMServer.renderToString(element);
    const htmlString = buildHtmlString(html);

    await page.setViewport({ width: 500, height: 500 });
    await page.setContent(htmlString);
    await snapshot(page);
  });
});
