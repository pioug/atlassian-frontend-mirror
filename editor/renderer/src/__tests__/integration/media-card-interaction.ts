import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { mountRenderer } from '../__helpers/testing-example-helpers';
import mediaCardInteractionAdf from './__fixtures__/media-card-interaction.adf.json';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/visual-regression/helper';

import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const allLinks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * In HOT-98682 Media Card’s Viewport Anchor rendered over the top of other components this was due to a style being applied from Media Single.
 * This regression test has been added to cover the case.
 */

const UNICODE_CHARACTERS = {
  Control: '\uE009',
  Meta: '\uE03D',
};
// FIXME: This test was automatically skipped due to failure on 30/01/2023: https://product-fabric.atlassian.net/browse/ED-16685
BrowserTestCase(
  `The link should be clickable inside renderer with media card`,
  {
    skip: ['*'],
  },
  async (client: BrowserObject) => {
    const page = new Page(client);
    const baseUrl = getExampleUrl(
      'editor',
      'renderer',
      'testing',
      // @ts-ignore
      global.__BASEURL__,
    );
    await page.setWindowSize(600, 950);
    await client.navigateTo(baseUrl);
    await mountRenderer(page, {}, mediaCardInteractionAdf);
    const rendererWindowHandler = (await page.getWindowHandles())[0];

    for (const link of allLinks) {
      const currentLinkUrl = `https://link${link}/`;
      const elementSelector = `a[title="${currentLinkUrl}"]`;
      const elem = await client.$(elementSelector);

      const modChar = page.isWindowsPlatform() ? 'Control' : 'Meta';
      const modUnicode = UNICODE_CHARACTERS[modChar];

      if (page.isBrowser('chrome')) {
        await elem.moveTo({ xOffset: 2, yOffset: 2 });
        // Press Control key
        await client.keys(modChar);
        await client.positionClick();
        // Release Control key
        await client.keys(modChar);
      } else {
        await elem.scrollIntoView();
        const { top, left, height, width } = await page.getBoundingRect(
          `a[title="${currentLinkUrl}"]`,
        );

        await client.performActions([
          {
            type: 'key',
            id: 'keyboard',

            actions: [{ type: 'keyDown', value: modUnicode }],
          },
          {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'mouse' },
            actions: [
              {
                type: 'pointerMove',
                duration: 0,
                origin: 'viewport',
                x: Math.floor(left + width / 2),
                y: Math.floor(top + height / 2),
              },
              { type: 'pointerDown', button: 0 },
              { type: 'pointerUp', button: 0 },
            ],
          },
        ]);

        await client.releaseActions();
      }

      let allHandles = await page.getWindowHandles();

      expect(allHandles).toHaveLength(2);

      const newWindowOpened = allHandles.find(
        (handle) => handle !== rendererWindowHandler,
      );
      await client.switchToWindow(newWindowOpened!);

      if (page.isBrowser('firefox')) {
        // yeah, Firefox is weird. It sets the url to "about:blank"
        // so, we need to check using this weird (and slow) approach
        expect(
          await client.waitUntil(
            async () => (await client.getUrl()) === currentLinkUrl,
          ),
        ).toBe(true);
      } else {
        const newPageUrl = await client.getUrl();
        expect(newPageUrl).toEqual(currentLinkUrl);
      }

      await client.closeWindow();
      allHandles = await page.getWindowHandles();
      expect(allHandles).toHaveLength(1);
      await client.switchToWindow(rendererWindowHandler);
    }
  },
);
