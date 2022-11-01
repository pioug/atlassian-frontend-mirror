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

// FIXME: This test was automatically skipped due to failure on 31/10/2022: https://product-fabric.atlassian.net/browse/ED-16005
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

    for (const link of allLinks) {
      const currentPage = `https://link${link}/`;
      const elem = await client.$(`a[title="${currentPage}"]`);

      if (page.isBrowser('chrome')) {
        await elem.moveTo({ xOffset: 2, yOffset: 2 });
        await client.positionClick();
      } else {
        await elem.scrollIntoView();
        const { top, left, height, width } = await page.getBoundingRect(
          `a[title="${currentPage}"]`,
        );
        await client.performActions([
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

      expect(
        await client.waitUntil(
          async () => (await client.getUrl()) === currentPage,
        ),
      ).toBe(true);

      if (page.isBrowser('Safari')) {
        // Back and Forward navigation is not supported so we need to remount the page every time.
        // https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/3771
        await client.navigateTo(baseUrl);
        await mountRenderer(page, {}, mediaCardInteractionAdf);
      } else {
        await client.back();
      }
    }
    expect.assertions(allLinks.length);
  },
);
