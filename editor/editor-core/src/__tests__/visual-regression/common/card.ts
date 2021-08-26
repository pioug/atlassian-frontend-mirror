import {
  evaluateTeardownMockDate,
  PuppeteerPage,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';
import { Device, initFullPageEditorWithAdf, snapshot } from '../_utils';
import cardAdf from './__fixtures__/card-adf.json';
import cardSelectionAdf from './__fixtures__/card-selection-adf.json';
import cardAdfRequestAccess from './__fixtures__/card-request-access.adf.json';
import cardAdfBlock from './__fixtures__/card-adf.block.json';
import cardAdfSupportedPlatforms from './__fixtures__/card-adf.supported-platforms.json';
import cardAdfBlockLongTitle from './__fixtures__/card-adf-long-title.block.json';
import {
  openPreviewState,
  waitForBlockCardSelection,
  waitForEmbedCardSelection,
  waitForInlineCardSelection,
  waitForPreviewState,
  waitForResolvedBlockCard,
  waitForResolvedEmbedCard,
  waitForResolvedInlineCard,
  waitForSuccessfullyResolvedEmbedCard,
} from '@atlaskit/media-integration-test-helpers';

const themes = ['light', 'dark'];

function getMode(theme: any) {
  return theme === 'light' ? 'light' : 'dark';
}

describe('Cards:', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  describe.each(themes)('Theme: %s', (theme) => {
    it('displays links with correct appearance', async () => {
      await initFullPageEditorWithAdf(
        page,
        cardAdf,
        Device.LaptopHiDPI,
        {
          width: 800,
          height: 4500,
        },
        {
          smartLinks: {
            resolveBeforeMacros: ['jira'],
            allowBlockCards: true,
            allowEmbeds: true,
          },
        },
        getMode(theme),
        undefined,
        true,
      );
      await evaluateTeardownMockDate(page);

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
      await waitForSuccessfullyResolvedEmbedCard(page);
      await waitForResolvedEmbedCard(page, 'resolving');
      await waitForResolvedEmbedCard(page, 'unauthorized');
      await waitForResolvedEmbedCard(page, 'forbidden');
      await waitForResolvedEmbedCard(page, 'not_found');
      await waitForResolvedEmbedCard(page, 'errored');

      // Ensure all images have finished loading on the page.
      await waitForLoadedImageElements(page, 3000);

      await snapshot(page);
    });
  });

  it('displays request access forbidden links with correct appearance', async () => {
    await initFullPageEditorWithAdf(
      page,
      cardAdfRequestAccess,
      Device.LaptopHiDPI,
      {
        width: 800,
        height: 5300,
      },
      {
        smartLinks: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
      undefined,
      undefined,
      true,
    );
    await evaluateTeardownMockDate(page);

    await waitForResolvedInlineCard(page, 'forbidden');
    await waitForResolvedBlockCard(page, 'forbidden');
    await waitForResolvedEmbedCard(page, 'forbidden');
    await waitForLoadedImageElements(page, 3000);

    await snapshot(page);
  });

  it('displays selection styles', async () => {
    await initFullPageEditorWithAdf(
      page,
      cardSelectionAdf,
      undefined,
      {
        width: 950,
        height: 1020,
      },
      {
        smartLinks: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
      undefined,
      undefined,
      true,
    );
    await evaluateTeardownMockDate(page);

    await waitForResolvedInlineCard(page);
    await waitForResolvedBlockCard(page);
    await waitForSuccessfullyResolvedEmbedCard(page);

    await waitForInlineCardSelection(page);
    await page.mouse.move(0, 0);
    await snapshot(page);

    await waitForBlockCardSelection(page, 'resolved');
    await page.mouse.move(0, 0);
    await snapshot(page);

    await waitForEmbedCardSelection(page, 'resolved');
    await page.mouse.move(0, 0);
    await snapshot(page);
  });

  it('displays hover styles', async () => {
    await initFullPageEditorWithAdf(
      page,
      cardSelectionAdf,
      undefined,
      {
        width: 950,
        height: 1020,
      },
      {
        smartLinks: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
      undefined,
      undefined,
      true,
    );
    await evaluateTeardownMockDate(page);

    await waitForResolvedInlineCard(page);
    await waitForResolvedBlockCard(page);
    await waitForSuccessfullyResolvedEmbedCard(page);

    await page.hover('[data-testid="inline-card-resolved-view"]');
    await snapshot(page);
  });

  [
    [cardAdfBlock, 'regular length title'],
    [cardAdfBlockLongTitle, 'long length title'],
  ].forEach((adf) =>
    it(`displays preview with correct appearance for ${adf[1]}`, async () => {
      await initFullPageEditorWithAdf(
        page,
        adf[0],
        Device.LaptopHiDPI,
        {
          width: 800,
          height: 1500,
        },
        {
          smartLinks: {
            resolveBeforeMacros: ['jira'],
            allowBlockCards: true,
            allowEmbeds: true,
          },
        },
        undefined,
        undefined,
        true,
      );
      await evaluateTeardownMockDate(page);

      await waitForResolvedBlockCard(page);
      await openPreviewState(page);
      await waitForPreviewState(page);
      await snapshot(page);
    }),
  );

  it('should show preview when supported platform matches', async () => {
    await initFullPageEditorWithAdf(
      page,
      cardAdfSupportedPlatforms,
      Device.LaptopHiDPI,
      {
        width: 800,
        height: 1500,
      },
      {
        smartLinks: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
      undefined,
      undefined,
      true,
    );
    await evaluateTeardownMockDate(page);

    await waitForResolvedBlockCard(page);
    await snapshot(page);
  });
});
