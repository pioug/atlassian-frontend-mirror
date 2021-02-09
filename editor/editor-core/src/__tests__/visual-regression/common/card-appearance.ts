import {
  PuppeteerPage,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, snapshot, Device } from '../_utils';
import cardAppearanceAdf from './__fixtures__/card-appearance-adf.json';
import cardListAppearanceAdf from './__fixtures__/card-list-appearance.adf.json';
import cardInsideLayout from './__fixtures__/card-inside-layout-adf.json';
import cardListBlueLinkAppearanceAdf from './__fixtures__/card-list-blue-link-appearance.adf.json';
import {
  waitForInlineCardSelection,
  waitForResolvedInlineCard,
  blockCardSelector,
} from '@atlaskit/media-integration-test-helpers';
import { waitForFloatingControl } from '../../__helpers/page-objects/_toolbar';

describe('Cards:', () => {
  const initEditor = async (
    adf: any,
    viewport: { width: number; height: number } = {
      width: 950,
      height: 1020,
    },
  ) => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI, viewport, {
      UNSAFE_cards: {
        resolveBeforeMacros: ['jira'],
        allowBlockCards: true,
        allowEmbeds: true,
      },
    });
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

  // [EDM-1580]
  it('can switch appearance inside layouts', async () => {
    await initEditor(cardInsideLayout, {
      width: 1440,
      height: 1020,
    });
    await waitForResolvedInlineCard(page);
    await waitForInlineCardSelection(page);
    // change the appearance to block
    await page.click(
      'div[aria-label="Floating Toolbar"] [data-testid="link-toolbar-appearance-button"]',
    );
    await page.mouse.move(0, 0);
    await page.waitForSelector(
      '[aria-label="Popup"][data-editor-popup="true"]',
    );
    await page.click('[data-testid="block-appearance"]');
    await snapshot(page);
    // change the appearance to embed
    await page.click(blockCardSelector());
    await page.waitForSelector('div[aria-label="Floating Toolbar"]');
    await page.click(
      'div[aria-label="Floating Toolbar"] [data-testid="link-toolbar-appearance-button"]',
    );
    await page.mouse.move(0, 0);
    await page.waitForSelector(
      '[aria-label="Popup"][data-editor-popup="true"]',
    );
    await page.click('[data-testid="embed-appearance"]');
    await waitForFloatingControl(page, 'Card options');
    await waitForElementCount(page, '[data-iframe-loaded="true"]', 1);
    await page.hover('.embed-header');
    await snapshot(page);
  });
});
