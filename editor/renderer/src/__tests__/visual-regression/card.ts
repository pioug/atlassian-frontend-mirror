import {
  PuppeteerPage,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';

import { snapshot, initRendererWithADF } from './_utils';
import * as cardXSSADF from '../__fixtures__/card-xss.adf.json';
import * as cardAdf from '../__fixtures__/card.adf.json';
import * as cardAdfBlock from '../__fixtures__/card.adf.block.json';

import {
  waitForResolvedInlineCard,
  waitForResolvedBlockCard,
  waitForResolvedEmbedCard,
  openPreviewState,
  waitForPreviewState,
} from '@atlaskit/media-integration-test-helpers';

const initRenderer = async (page: PuppeteerPage, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    viewport: { width: 500, height: 200 },
    adf,
  });
};

describe('Snapshot Test: Cards', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should render unknown content for cards with invalid urls', async () => {
    await initRenderer(page, cardXSSADF);
    await waitForResolvedInlineCard(page);
  });

  it('displays links with correct appearance', async () => {
    await initRenderer(page, cardAdf);

    await page.setViewport({
      width: 800,
      height: 4200,
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
    await waitForResolvedEmbedCard(page);
    await waitForResolvedBlockCard(page, 'resolving');
    await waitForResolvedEmbedCard(page, 'unauthorized');
    await waitForResolvedEmbedCard(page, 'forbidden');
    await waitForResolvedEmbedCard(page, 'not_found');
    await waitForResolvedEmbedCard(page, 'errored');

    // Ensure all images have finished loading on the page.
    await waitForLoadedImageElements(page, 3000);
  });

  it('displays preview state with correct appearance', async () => {
    await initRenderer(page, cardAdfBlock);
    await page.setViewport({
      width: 800,
      height: 1500,
    });

    await waitForResolvedBlockCard(page);
    await openPreviewState(page);
    await waitForPreviewState(page);
  });
});
