import React from 'react';

import ReactDOM from 'react-dom';

import __noop from '@atlaskit/ds-lib/noop';
import { getExamplesFor, ssr } from '@atlaskit/ssr';
import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  jest.spyOn(global.console, 'error').mockImplementation(__noop);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each(['light', 'dark', 'none'] as const)(
    'section-message with tokens (%s) should match production example',
    async (theme) => {
      const url = getExampleUrl(
        'design-system',
        'section-message',
        'appearance-variations',
        global.__BASEURL__,
        theme,
      );
      const { page } = global;
      const selector = '[data-testid="appearance-example"]';

      await loadPage(page, url);
      await page.waitForSelector(selector);

      const image = await takeElementScreenShot(page, selector);
      expect(image).toMatchProdImageSnapshot();
    },
  );

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
    const selector = '[data-testid="appearance-example"]';

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

  it('should match word wrapping behavior in examples', async () => {
    const url = getExampleUrl(
      'design-system',
      'section-message',
      'testing',
      global.__BASEURL__,
    );
    const { page } = global;
    const contentSelector = '[data-testid="overflow-section-message"]';
    const actionsSelector = '[data-testid="overflow-actions-section-message"]';

    await loadPage(page, url);
    await page.waitForSelector(contentSelector);
    await page.waitForSelector(actionsSelector);

    const content = await takeElementScreenShot(page, contentSelector);
    expect(content).toMatchProdImageSnapshot();

    const actions = await takeElementScreenShot(page, actionsSelector);
    expect(actions).toMatchProdImageSnapshot();
  });
});
