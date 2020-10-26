import {
  PuppeteerPage,
  waitForLoadedImageElements,
} from '@atlaskit/visual-regression/helper';
import { Device, initFullPageEditorWithAdf, snapshot } from '../_utils';
import cardAdf from './__fixtures__/card-adf.json';
import cardSelectionAdf from './__fixtures__/card-selection-adf.json';
import cardAdfBlock from './__fixtures__/card-adf.block.json';
import {
  openPreviewState,
  waitForBlockCardSelection,
  waitForEmbedCardSelection,
  waitForInlineCardSelection,
  waitForPreviewState,
  waitForResolvedBlockCard,
  waitForResolvedEmbedCard,
  waitForResolvedInlineCard,
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

  describe.each(themes)('Theme: %s', theme => {
    it('displays links with correct appearance', async () => {
      await initFullPageEditorWithAdf(
        page,
        cardAdf,
        Device.LaptopHiDPI,
        undefined,
        {
          UNSAFE_cards: {
            resolveBeforeMacros: ['jira'],
            allowBlockCards: true,
            allowEmbeds: true,
          },
        },
        getMode(theme),
      );

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

      await snapshot(page);
    });
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
        UNSAFE_cards: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    );

    await waitForResolvedInlineCard(page);
    await waitForResolvedBlockCard(page);
    await waitForResolvedEmbedCard(page);

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

  it('displays preview state with correct appearance', async () => {
    await initFullPageEditorWithAdf(
      page,
      cardAdfBlock,
      Device.LaptopHiDPI,
      undefined,
      {
        UNSAFE_cards: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    );

    await page.setViewport({
      width: 800,
      height: 1500,
    });

    await waitForResolvedBlockCard(page);
    await openPreviewState(page);
    await waitForPreviewState(page);
    await snapshot(page);
  });
});
