import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, snapshot } from '../_utils';
import cardAppearanceAdf from './__fixtures__/card-appearance-adf.json';
import {
  waitForInlineCardSelection,
  waitForResolvedInlineCard,
} from '@atlaskit/media-integration-test-helpers';

describe('Card toolbar:', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  it('can exit edit link mode by pressing esc', async () => {
    await initFullPageEditorWithAdf(
      page,
      cardAppearanceAdf,
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
    // we first render a smart inline link
    await waitForResolvedInlineCard(page);
    await waitForInlineCardSelection(page);
    // enter edit mode
    await page.click(
      'div[aria-label="Floating Toolbar"] [data-testid="link-toolbar-edit-link-button"]',
    );
    await page.waitForSelector(
      '[aria-label="Card options"][data-editor-popup="true"]',
    );
    await snapshot(page);
    await page.keyboard.press('Escape');
    // Ensure we leave edit mode after pressing esc
    await page.waitForSelector(
      'div[aria-label="Floating Toolbar"] [data-testid="link-toolbar-edit-link-button"]',
    );
    await snapshot(page);
  });
});
