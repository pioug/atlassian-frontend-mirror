import {
  PuppeteerPage,
  evaluateTeardownMockDate,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import {
  waitForResolvedInlineCard,
  waitForResolvedBlockCard,
  waitForSuccessfullyResolvedEmbedCard,
  waitForBlockCardSelection,
  waitForEmbedCardSelection,
  waitForInlineCardSelection,
} from '@atlaskit/media-integration-test-helpers';
import cardSelectionAdf from './__fixtures__/card-selection-adf.json';
import { initFullPageEditorWithAdf, snapshot } from '../_utils';
import { waitForFloatingControl } from '../../__helpers/page-objects/_toolbar';

describe('Card danger states', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  it('should display danger state for different cards', async () => {
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
    );

    await evaluateTeardownMockDate(page);
    await waitForResolvedInlineCard(page);
    await waitForResolvedBlockCard(page);
    await waitForSuccessfullyResolvedEmbedCard(page);

    // Block appearance
    await waitForBlockCardSelection(page);
    await waitForFloatingControl(page, 'Card options');
    await page.hover('button[aria-label="Remove"]');
    await waitForTooltip(page);
    await page.waitForSelector('.blockCardView-content-wrap.danger');
    await snapshot(page);

    // Embed appearance
    await waitForEmbedCardSelection(page);
    await waitForFloatingControl(page, 'Card options');
    await page.hover('button[aria-label="Remove"]');
    await waitForTooltip(page);
    await page.waitForSelector('.embedCardView-content-wrap.danger');
    await snapshot(page);

    // Inline appearance
    await waitForInlineCardSelection(page);
    await waitForFloatingControl(page, 'Card options');
    await page.hover('button[aria-label="Remove"]');
    await waitForTooltip(page);
    await page.waitForSelector('.inlineCardView-content-wrap.danger');
    await snapshot(page);
  });
});
