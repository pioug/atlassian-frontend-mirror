import {
  PuppeteerPage,
  waitForNoTooltip,
} from '@atlaskit/visual-regression/helper';

import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
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

  it('shows suggestions in link picker when clearing the url in edit mode', async () => {
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
    await page.click('[aria-label="Clear link"]');
    await snapshot(page);
  });

  // FIXME: This test was automatically skipped due to failure on 02/09/2022: https://product-fabric.atlassian.net/browse/ED-15570
  it.skip('can exit edit link mode by pressing esc', async () => {
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
    await waitForNoTooltip(page);
    await snapshot(page);
  });

  it('renders properly when feature flag `viewChangingExperimentToolbarStyle` is set to `toolbarIcons`', async () => {
    await initFullPageEditorWithAdf(
      page,
      cardAppearanceAdf,
      undefined,
      {
        width: 950,
        height: 1020,
      },
      {
        featureFlags: {
          'view-changing-experiment-toolbar-style': 'toolbarIcons',
        },
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
    await page.waitForSelector(
      'div[aria-label="Floating Toolbar"] [data-testid="link-toolbar-edit-link-button"]',
    );
    await snapshot(page);
  });
});
