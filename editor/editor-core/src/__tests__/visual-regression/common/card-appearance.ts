import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, snapshot } from '../_utils';
import cardAppearanceAdf from './__fixtures__/card-appearance-adf.json';
import cardListAppearanceAdf from './__fixtures__/card-list-appearance.adf.json';
import cardListBlueLinkAppearanceAdf from './__fixtures__/card-list-blue-link-appearance.adf.json';
import {
  waitForInlineCardSelection,
  waitForResolvedInlineCard,
} from '@atlaskit/media-integration-test-helpers';

describe('Cards:', () => {
  const initEditor = async (adf: any) => {
    await initFullPageEditorWithAdf(
      page,
      adf,
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
  };

  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
  });

  it('displays all appearance options', async () => {
    await initEditor(cardAppearanceAdf);
    await waitForResolvedInlineCard(page);
    await waitForInlineCardSelection(page);
    await page.click(
      'div[aria-label="Floating Toolbar"] [data-testid="link-toolbar-appearance-button"]',
    );
    await page.waitForSelector(
      '[aria-label="Popup"][data-editor-popup="true"]',
    );
    await page.mouse.move(0, 0);
    await snapshot(page);
  });

  it('can switch to URL appearance', async () => {
    await initEditor(cardAppearanceAdf);
    // we first render a smart inline link
    await waitForResolvedInlineCard(page);
    await waitForInlineCardSelection(page);
    // change the appearance to blue link
    await page.click(
      'div[aria-label="Floating Toolbar"] [data-testid="link-toolbar-appearance-button"]',
    );
    await page.waitForSelector(
      '[aria-label="Popup"][data-editor-popup="true"]',
    );
    await page.click('[data-testid="url-appearance"]');
    await page.waitForSelector('a[href="https://inlineCardTestUrl"]');
    // make sure we render a blue link
    await page.mouse.move(0, 0);
    await snapshot(page);
    await page.click('a[href="https://inlineCardTestUrl"]');
    await page.waitForSelector('div[aria-label="Floating Toolbar"]');
    await page.click(
      'div[aria-label="Floating Toolbar"] [data-testid="link-toolbar-appearance-button"]',
    );
    // we can see the appearance switcher for the blue link
    await page.mouse.move(0, 0);
    await snapshot(page);
  });

  it('should show allowed options for smart link inside a list', async () => {
    await initEditor(cardListAppearanceAdf);
    await waitForResolvedInlineCard(page);
    await waitForInlineCardSelection(page);
    await page.click(
      'div[aria-label="Floating Toolbar"] [data-testid="link-toolbar-appearance-button"]',
    );
    await page.waitForSelector(
      '[aria-label="Popup"][data-editor-popup="true"]',
    );
    await snapshot(page);
  });

  it('should show allowed options for blue link inside a list', async () => {
    await initEditor(cardListBlueLinkAppearanceAdf);
    await page.waitForSelector('a[href="https://inlineCardTestUrl"]');
    await page.click('a[href="https://inlineCardTestUrl"]');
    await page.waitForSelector('div[aria-label="Floating Toolbar"]');
    await page.click(
      'div[aria-label="Floating Toolbar"] [data-testid="link-toolbar-appearance-button"]',
    );
    await page.waitForSelector(
      '[aria-label="Popup"][data-editor-popup="true"]',
    );
    await snapshot(page);
  });
});
