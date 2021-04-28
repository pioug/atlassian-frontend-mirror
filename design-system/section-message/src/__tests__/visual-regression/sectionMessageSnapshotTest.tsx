import React from 'react';

import ReactDOM from 'react-dom';

import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr } from '@atlaskit/ssr';
import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  jest.spyOn(global.console, 'error').mockImplementation(() => {});

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'section-message',
      'basic-example',

      global.__BASEURL__,
    );
    const { page } = global;
    const selector = '[data-testid="section-message"]';

    await loadPage(page, url);
    await page.waitForSelector(selector);

    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Appearance variations should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'section-message',
      'appearance-variations',

      global.__BASEURL__,
    );
    const { page } = global;
    const selector = '#appearance-example';

    await loadPage(page, url);
    await page.waitForSelector(selector);

    const image = await takeElementScreenShot(page, selector);
    expect(image).toMatchProdImageSnapshot();
  });

  it('should match color for light and dark themes example', async () => {
    const url = getExampleUrl(
      'design-system',
      'section-message',
      'theme',

      global.__BASEURL__,
    );
    const { page } = global;
    const selector = '[data-testid="section-message"]';

    await loadPage(page, url);
    await page.waitForSelector(selector);

    const imageDark = await takeElementScreenShot(page, selector);
    expect(imageDark).toMatchProdImageSnapshot();

    const toggleThemeBtn = await page.$("[data-testid='toggle-theme']");
    await toggleThemeBtn?.click();

    const imageLight = await takeElementScreenShot(page, selector);
    expect(imageLight).toMatchProdImageSnapshot();
  });

  it('SSR & Hydrated section-message output should be visually identical', async () => {
    const url = getExampleUrl(
      'design-system',
      'section-message',
      'ssr-testing',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);

    const [$ssrElement, $hydratedElement] = await Promise.all([
      await page.waitForSelector('#ssr'),
      await page.waitForSelector('#hydrated'),
    ]);

    const [example] = await getExamplesFor('section-message');
    const Example = require(example.filePath).default;

    const ssrElement = await ssr(example.filePath);

    const hydratedElement = document.createElement('div');
    hydratedElement.innerHTML = ssrElement;
    ReactDOM.hydrate(<Example />, hydratedElement);

    await page.evaluate(
      (ssrHTML, hydratedHTML) => {
        document.querySelector('#ssr')!.innerHTML = ssrHTML;
        document.querySelector('#hydrated')!.innerHTML = hydratedHTML;
      },
      ssrElement,
      hydratedElement.innerHTML,
    );

    await expect($ssrElement).toMatchVisually($hydratedElement);
  });
});
