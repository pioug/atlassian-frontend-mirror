import { waitForLoadedImageElements } from '@atlaskit/visual-regression/helper';
import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/card-adf.json';
import {
  waitForResolvedInlineCard,
  waitForResolvedBlockCard,
  waitForResolvedEmbedCard,
  waitForBlockCardSelection,
} from '../../__helpers/page-objects/_cards';

describe('Cards:', () => {
  it('displays links with correct appearance', async () => {
    const page = global.page;

    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI, undefined, {
      UNSAFE_cards: {
        resolveBeforeMacros: ['jira'],
        allowBlockCards: true,
        allowEmbeds: true,
      },
    });

    await page.setViewport({
      width: 1440,
      height: 4000,
    });

    // Render an assortment of inline cards.
    await waitForResolvedInlineCard(page);
    await waitForResolvedInlineCard(page, 'unauthorized');
    await waitForResolvedInlineCard(page, 'forbidden');

    // Render an assortment of block cards.
    await waitForResolvedBlockCard(page);
    await waitForResolvedBlockCard(page, 'resolving');
    await waitForResolvedBlockCard(page, 'unauthorized');
    await waitForResolvedBlockCard(page, 'forbidden');
    // Select one of the block cards to see the floating toolbar.
    await waitForBlockCardSelection(page, 'resolved');

    // Render an assortment of embed cards.
    await waitForResolvedEmbedCard(page);
    await waitForResolvedBlockCard(page, 'resolving');
    await waitForResolvedEmbedCard(page, 'unauthorized');
    await waitForResolvedEmbedCard(page, 'forbidden');

    // Ensure all images have finished loading on the page.
    await waitForLoadedImageElements(page, 3000);

    await snapshot(page);
  });
});
