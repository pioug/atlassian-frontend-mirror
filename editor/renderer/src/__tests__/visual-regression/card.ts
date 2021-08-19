import {
  evaluateTeardownMockDate,
  PuppeteerPage,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';

import { snapshot, initRendererWithADF, ViewPortOptions } from './_utils';
import * as cardXSSADF from '../__fixtures__/card-xss.adf.json';
import * as cardAdf from '../__fixtures__/card.adf.json';
import * as cardAdfBlock from '../__fixtures__/card.adf.block.json';
import * as cardAdfRequestAccess from '../__fixtures__/card-request-access.adf.json';

import {
  waitForResolvedInlineCard,
  waitForResolvedBlockCard,
  waitForResolvedEmbedCard,
  openPreviewState,
  waitForPreviewState,
  waitForSuccessfullyResolvedEmbedCard,
  embedCombinationsWithTitle,
  generateEmbedCombinationAdf,
} from '@atlaskit/media-integration-test-helpers';

const initRenderer = async (
  page: PuppeteerPage,
  adf: any,
  viewport: ViewPortOptions,
) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport,
    adf,
  });
  await evaluateTeardownMockDate(page);
};

describe('Snapshot Test: Cards', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  afterEach(async () => {
    // FIXME These tests were flakey in the Puppeteer v10 Upgrade
    await snapshot(page, { tolerance: 0.05, useUnsafeThreshold: true });
  });

  it('should render unknown content for cards with invalid urls', async () => {
    await initRenderer(page, cardXSSADF, { width: 500, height: 200 });
    await waitForResolvedInlineCard(page);
  });

  // TODO: https://product-fabric.atlassian.net/browse/ED-13527
  it.skip('displays links with correct appearance', async () => {
    await initRenderer(page, cardAdf, {
      width: 800,
      height: 5000,
    });

    // Render an assortment of inline cards.
    await waitForResolvedInlineCard(page);
    await waitForResolvedInlineCard(page, 'resolving');
    await waitForResolvedInlineCard(page, 'unauthorized');
    await waitForResolvedInlineCard(page, 'forbidden');
    await waitForResolvedInlineCard(page, 'not_found');
    await waitForResolvedInlineCard(page, 'errored');

    // Render an assortment of block cards.
    await waitForResolvedBlockCard(page);
    await waitForResolvedBlockCard(page, 'resolving');
    await waitForResolvedBlockCard(page, 'unauthorized');
    await waitForResolvedBlockCard(page, 'forbidden');
    await waitForResolvedBlockCard(page, 'not_found');
    await waitForResolvedBlockCard(page, 'errored');

    // Render an assortment of embed cards.
    await waitForSuccessfullyResolvedEmbedCard(page, 2);
    await waitForResolvedEmbedCard(page, 'resolving');
    await waitForResolvedEmbedCard(page, 'unauthorized');
    await waitForResolvedEmbedCard(page, 'forbidden');
    await waitForResolvedEmbedCard(page, 'not_found');
    await waitForResolvedEmbedCard(page, 'errored');

    // Ensure all images have finished loading on the page.
    await waitForLoadedImageElements(page, 3000);
  });

  it('displays preview state with correct appearance', async () => {
    await initRenderer(page, cardAdfBlock, {
      width: 800,
      height: 1500,
    });

    await waitForResolvedBlockCard(page);
    await openPreviewState(page);
    await waitForPreviewState(page);
  });

  it('displays request access forbidden links with correct appearance', async () => {
    await initRenderer(page, cardAdfRequestAccess, {
      width: 800,
      height: 5500,
    });

    await waitForResolvedInlineCard(page, 'forbidden');
    await waitForResolvedBlockCard(page, 'forbidden');
    await waitForResolvedEmbedCard(page, 'forbidden');
    await waitForLoadedImageElements(page, 3000);
  });

  it.each(embedCombinationsWithTitle)(
    `should render embeds with and without dynamic height control with %s`,
    async (condition, attributes) => {
      await initRenderer(
        page,
        generateEmbedCombinationAdf([condition, attributes]),
        {
          width: 1440,
          height: 2000,
        },
      );

      await waitForSuccessfullyResolvedEmbedCard(page, 2);
      // Ensure all images have finished loading on the page.
      await waitForLoadedImageElements(page, 3000);
    },
  );
});
