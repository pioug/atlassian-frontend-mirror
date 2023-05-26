import React from 'react';

import { render } from '@testing-library/react';

import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import NavExampleForNoopTest from '../../../examples/10-authenticated-example';

describe('Feature flag - authenticated nav example', () => {
  ffTest(
    'platform.design-system-team.navigation-v2-no-jank_5yhbd',
    async () => {
      const url = getExampleUrl(
        'navigation',
        'atlassian-navigation',
        'authenticated-example',
        global.__BASEURL__,
      );

      await page.setViewport({
        height: 200,
        width: 1440,
      });
      await loadPage(global.page, url);

      const largeScreenImage = await page.screenshot();
      expect(largeScreenImage).toMatchProdImageSnapshot();

      await page.setViewport({
        height: 200,
        width: 800,
      });

      const mediumScreenImage = await page.screenshot();
      expect(mediumScreenImage).toMatchProdImageSnapshot();

      await page.setViewport({
        height: 200,
        width: 480,
      });

      const smallScreenImage = await page.screenshot();
      expect(smallScreenImage).toMatchProdImageSnapshot();
    },
    // The nav as it is currently is unfortunately flakey; tests had been skipped
    // before they were converted to Gemini. Here we are essentially no-oping
    // the 'false' case of the feature flag, as we are covering the 'false' case
    // in our Gemini tests already.
    //
    // The important part of this test is that we are testing the 'true' case of
    // the feature flag, which we are doing above. Ideally these ffTest blocks
    // will be short-lived as we roll out the flag and just use Gemini tests moving
    // forward.
    //
    // This is the minimal 'no-op' for ffTest, as the test throws if the flag
    // is not present somehow in the test, so we need to render the nav. RTL is
    // going to be faster than spinning up a puppeteer page, so I did that.
    async () => {
      render(<NavExampleForNoopTest />);
    },
  );
});

describe('Feature flag - server side rendering example', () => {
  ffTest(
    'platform.design-system-team.navigation-v2-no-jank_5yhbd',
    async () => {
      const url = getExampleUrl(
        'navigation',
        'atlassian-navigation',
        'server-side-rendering',
        global.__BASEURL__,
      );

      await page.setViewport({
        height: 400,
        width: 1440,
      });
      await loadPage(global.page, url);

      const largeScreenImage = await page.screenshot();
      expect(largeScreenImage).toMatchProdImageSnapshot();

      await page.setViewport({
        height: 400,
        width: 800,
      });

      const mediumScreenImage = await page.screenshot();
      expect(mediumScreenImage).toMatchProdImageSnapshot();

      await page.setViewport({
        height: 400,
        width: 480,
      });

      const smallScreenImage = await page.screenshot();
      expect(smallScreenImage).toMatchProdImageSnapshot();
    },
    // Essentially a no-op: see comment in first ffTest block
    async () => {
      render(<NavExampleForNoopTest />);
    },
  );
});

describe('Feature flag - different languages example', () => {
  ffTest(
    'platform.design-system-team.navigation-v2-no-jank_5yhbd',
    async () => {
      const url = getExampleUrl(
        'navigation',
        'atlassian-navigation',
        'different-languages',
        global.__BASEURL__,
      );

      await page.setViewport({
        height: 400,
        width: 1440,
      });
      await loadPage(global.page, url);

      const largeScreenImage = await page.screenshot();
      expect(largeScreenImage).toMatchProdImageSnapshot();

      await page.setViewport({
        height: 400,
        width: 800,
      });

      const mediumScreenImage = await page.screenshot();
      expect(mediumScreenImage).toMatchProdImageSnapshot();

      await page.setViewport({
        height: 400,
        width: 480,
      });

      const smallScreenImage = await page.screenshot();
      expect(smallScreenImage).toMatchProdImageSnapshot();
    },
    // Essentially a no-op: see comment in first ffTest block
    async () => {
      render(<NavExampleForNoopTest />);
    },
  );
});

describe('Feature flag - falsy nav items example', () => {
  ffTest(
    'platform.design-system-team.navigation-v2-no-jank_5yhbd',
    async () => {
      const url = getExampleUrl(
        'navigation',
        'atlassian-navigation',
        'falsy-items',
        global.__BASEURL__,
      );

      await page.setViewport({
        height: 400,
        width: 1440,
      });
      await loadPage(global.page, url);

      const image = await page.screenshot();
      expect(image).toMatchProdImageSnapshot();
    },
    // Essentially a no-op: see comment in first ffTest block
    async () => {
      render(<NavExampleForNoopTest />);
    },
  );
});
