import { waitForResolvedInlineCard } from '@atlaskit/media-integration-test-helpers';
import { getURL, setup, takeSnapshot } from '../__utils__/vr-helpers';
import { ffTest } from '@atlassian/feature-flags-test-utils';

const inlineCardTests = [
  'vr-inline-card-default-icon',
  'vr-inline-card-lozenge',
  'vr-inline-card-text-wrap',
];

inlineCardTests.forEach((testName: string) => {
  ffTest(
    'platform.linking-platform.smart-card.show-inline-card-refreshed-design',
    async () => {
      const url = getURL(testName);
      const page = await setup(url);

      await waitForResolvedInlineCard(page);
      if (testName === 'vr-inline-card-loading-icon') {
        await page.waitForSelector(
          '[data-testid="inline-card-icon-and-title-loading"]',
        );
      }

      const image = await takeSnapshot(page, 320, 0);
      expect(image).toMatchProdImageSnapshot();
    },
  );
});

ffTest(
  'platform.linking-platform.smart-card.show-inline-card-refreshed-design',
  async () => {
    const url = getURL('vr-inline-card-unresolved-views');

    const page = await setup(url);
    await page.waitForSelector('[data-testid="inline-card-errored-view"]');

    const image = await takeSnapshot(page, 350);
    expect(image).toMatchProdImageSnapshot();
  },
);

const unresolvedViews = ['errored', 'forbidden', 'not-found', 'unauthorized'];

unresolvedViews.forEach((status: string) => {
  ffTest(
    'platform.linking-platform.smart-card.show-inline-card-refreshed-design',
    async () => {
      const url = getURL('vr-inline-card-unresolved-views');
      const page = await setup(url);

      const selector = `[data-testid="inline-card-${status}-view"]`;
      await page.waitForSelector(selector);
      await page.hover(selector);

      const image = await takeSnapshot(page, 350);
      expect(image).toMatchProdImageSnapshot();
    },
  );
});

ffTest(
  'platform.linking-platform.smart-card.show-inline-card-refreshed-design',
  async () => {
    const url = getURL('vr-inline-card-unresolved-views');
    const page = await setup(url);
    const selector = `[data-testid="button-connect-other-account"]`;
    await page.waitForSelector(selector);
    await page.hover(selector);

    const image = await takeSnapshot(page, 350);
    expect(image).toMatchProdImageSnapshot();
  },
);

ffTest(
  'platform.linking-platform.smart-card.show-inline-card-refreshed-design',
  async () => {
    const url = getURL('vr-inline-card-unresolved-views');

    const page = await setup(url);
    const selector = `[data-testid="button-connect-account"]`;
    await page.waitForSelector(selector);
    await page.hover(selector);

    const image = await takeSnapshot(page, 350);
    expect(image).toMatchProdImageSnapshot();
  },
);
