import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  waitForInlineCardSelection,
  waitForResolvedInlineCard,
} from '@atlaskit/media-integration-test-helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { typeInEditor } from '@atlaskit/editor-test-helpers/page-objects/editor';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';

import cardAppearanceAdf from './__fixtures__/card-appearance-adf.json';
import blankAdf from './__fixtures__/blank-adf.json';

const typeParagraphs = async (page: PuppeteerPage, lines = 6) => {
  for (let i = 0; i < 6; i++) {
    await typeInEditor(page, 'Test one, two, three\r\n');
  }
};

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

  it('renders properly with icons toolbar', async () => {
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
    await page.waitForSelector(
      'div[aria-label="Floating Toolbar"] [data-testid="link-toolbar-edit-link-button"]',
    );
    await snapshot(page);
  });

  it('repositions the popup to bottom when feature flag `preventPopupOverflow` is enabled', async () => {
    await initFullPageEditorWithAdf(
      page,
      blankAdf,
      undefined,
      {
        width: 950,
        height: 500,
      },
      {
        featureFlags: {
          'prevent-popup-overflow': true,
        },
      },
    );

    await typeParagraphs(page);
    await clickToolbarMenu(page, ToolbarMenuItem.link);
    await snapshot(page);
  });
});
