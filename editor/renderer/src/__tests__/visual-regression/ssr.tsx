import { JSDOM } from 'jsdom';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import Loadable from 'react-loadable';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cssResetStyles from '@atlaskit/css-reset';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { SmartCardProvider, CardClient } from '@atlaskit/link-provider';
import { snapshot } from './_utils';
import ssrDoc from './__fixtures__/renderer-ssr.adf.json';
import resizedImagedoc from './__fixtures__/ssr-resized-image.adf.json';
import resizedMedia from './__fixtures__/ssr-resized-media.adf.json';
import smartCardAdf from './__fixtures__/ssr-smart-card.adf.json';
import { IntlProvider } from 'react-intl-next';
import { url, cardState } from '@atlaskit/media-test-helpers/smart-card-state';
import { ReactRenderer } from '../../index';

const { window } = new JSDOM('', { url: 'http://localhost/' });
(global as any).window = window;
(global as any).performance = window.performance;
(global as any).navigator = window.navigator;
(global as any).document = window.document;

// FIXME VR test failures due to timeout https://product-fabric.atlassian.net/jira/servicedesk/projects/DTR/queues/issue/DTR-515
// Test works consistenty locally but fails on CI
describe.skip('ssr for renderer', () => {
  interface CustomProvidersProps {
    children?: JSX.Element;
    [k: string]: any;
  }
  const storeOptions = {
    initialState: {
      [url]: cardState,
    },
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

  const setPage = () => (page = global.page);

  beforeAll(async () => {
    setPage();
    await page.setViewport({ width: 1420, height: 2400 });
  });
  beforeEach(setPage);

  // FIXME: Unskip via https://product-fabric.atlassian.net/browse/ED-15263
  it.skip('should not throw when rendering any example on the server', async () => {
    const RendererWrapper = () => (
      <IntlProvider locale="en">
        <ReactRenderer
          document={ssrDoc}
          schema={defaultSchema}
          appearance="full-page"
          enableSsrInlineScripts={true}
        />
      </IntlProvider>
    );
    const element = React.createElement<CustomProvidersProps>(RendererWrapper);

    await Loadable.preloadAll();

    const html = ReactDOMServer.renderToString(element);
    const htmlString = buildHtmlString(html);

    await page.setContent(htmlString, {
      waitUntil: 'networkidle0',
    });

    await snapshot(page);
  });

  // FIXME: Unskip via https://product-fabric.atlassian.net/browse/ED-15288
  it.skip('should render image right dimensions for a resized image on the server', async () => {
    const RendererWrapper = () => (
      <IntlProvider locale="en">
        <ReactRenderer
          document={resizedImagedoc}
          schema={defaultSchema}
          appearance="full-page"
          enableSsrInlineScripts={true}
        />
      </IntlProvider>
    );
    const element = React.createElement(RendererWrapper);

    await Loadable.preloadAll();

    const html = ReactDOMServer.renderToString(element);
    const htmlString = buildHtmlString(html);

    await page.setContent(htmlString, {
      waitUntil: 'networkidle0',
    });
    await snapshot(page);
  });

  it('should render correct media right dimensions for resized media on the server', async () => {
    const RendererWrapper = () => (
      <IntlProvider locale="en">
        <ReactRenderer
          document={resizedMedia}
          schema={defaultSchema}
          appearance="full-page"
          enableSsrInlineScripts={true}
        />
      </IntlProvider>
    );
    const element = React.createElement(RendererWrapper);

    await Loadable.preloadAll();

    const html = ReactDOMServer.renderToString(element);
    const htmlString = buildHtmlString(html);

    await page.setContent(htmlString, {
      waitUntil: 'networkidle0',
    });

    await snapshot(page);
  });

  it('should render resolved smart-card on the server', async () => {
    const SmartCardRendererWrapper = () => (
      <IntlProvider locale="en">
        <SmartCardProvider
          storeOptions={storeOptions}
          client={new CardClient('staging')}
        >
          <ReactRenderer
            document={smartCardAdf}
            schema={defaultSchema}
            appearance="full-page"
            enableSsrInlineScripts={true}
            smartLinks={{
              ssr: true,
            }}
          />
        </SmartCardProvider>
      </IntlProvider>
    );
    const element = React.createElement(SmartCardRendererWrapper);

    await Loadable.preloadAll();

    const html = ReactDOMServer.renderToString(element);
    const htmlString = buildHtmlString(html);

    await page.setContent(htmlString);
    await snapshot(page);
  });
});
