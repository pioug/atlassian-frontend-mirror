import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { evaluateTeardownMockDate } from '@atlaskit/visual-regression/helper';
import {
  waitForResolvedInlineCard,
  waitForResolvedBlockCard,
  waitForSuccessfullyResolvedEmbedCard,
  waitForBlockCardSelection,
  waitForEmbedCardSelection,
  waitForInlineCardSelection,
} from '@atlaskit/media-integration-test-helpers';
import cardSelectionAdf from './__fixtures__/card-selection-adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

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
    await page.waitForSelector('.blockCardView-content-wrap.danger');
    await snapshot(page);

    // Embed appearance
    await waitForEmbedCardSelection(page);
    await waitForFloatingControl(page, 'Card options');
    await page.hover('button[aria-label="Remove"]');
    await page.waitForSelector('.embedCardView-content-wrap.danger');
    await snapshot(page);

    // Inline appearance
    await waitForInlineCardSelection(page);
    await waitForFloatingControl(page, 'Card options');
    await page.hover('button[aria-label="Remove"]');
    await page.waitForSelector('.inlineCardView-content-wrap.danger');
    await snapshot(page);
  });
});
