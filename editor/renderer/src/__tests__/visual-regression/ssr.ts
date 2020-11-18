import { JSDOM } from 'jsdom';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import Loadable from 'react-loadable';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import cssResetStyles from '@atlaskit/css-reset';
import { defaultSchema } from '@atlaskit/adf-schema';
import { snapshot } from './_utils';
import doc from './__fixtures__/renderer-ssr.adf.json';
import resizedImagedoc from './__fixtures__/ssr-resized-image.adf.json';

const { window } = new JSDOM('', { url: 'http://localhost/' });
(global as any).window = window;
(global as any).performance = window.performance;
(global as any).navigator = window.navigator;
(global as any).document = window.document;

describe('ssr for renderer', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  it('should not throw when rendering any example on the server', async () => {
    const { ReactRenderer } = require('../../index');
    const element = React.createElement(
      'div',
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
    const htmlString = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Renderer SSR Example</title>
      <style>${cssResetStyles}</style>
      ${(global as any).document.querySelector('head').innerHTML}
    </head>
    <body>${html}</body>
    </html>`;

    await page.setViewport({ width: 1420, height: 2400 });
    await page.setContent(htmlString);

    await snapshot(page);
  });

  it('should render image right dimensions for a resized image on the server', async () => {
    const { ReactRenderer } = require('../../index');
    const element = React.createElement(
      'div',
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
    const htmlString = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Renderer SSR Example</title>
      <style>${cssResetStyles}</style>
      ${(global as any).document.querySelector('head').innerHTML}
    </head>
    <body>${html}</body>
    </html>`;

    await page.setViewport({ width: 500, height: 500 });
    await page.setContent(htmlString);
    await snapshot(page);
  });
});
