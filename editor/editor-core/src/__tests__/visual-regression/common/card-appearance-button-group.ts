import {
  PuppeteerPage,
  waitForElementCount,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import cardAppearanceAdf from './__fixtures__/card-appearance-adf.json';
import cardListAppearanceAdf from './__fixtures__/card-list-appearance.adf.json';
import cardInsideLayout from './__fixtures__/card-inside-layout-adf.json';
import cardListBlueLinkAppearanceAdf from './__fixtures__/card-list-blue-link-appearance.adf.json';
import cardInsideUnsupportedNodesAdf from './__fixtures__/card_inside_unsupported_nodes.adf.json';
import cardInsideTable from './__fixtures__/card-inside-table.adf.json';
import {
  waitForInlineCardSelection,
  waitForResolvedInlineCard,
  blockCardSelector,
} from '@atlaskit/media-integration-test-helpers';
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

/**
 * [EDM-2640]
 * These tests are intended to replace those in `card-appearance.ts`
 */
describe('Cards: w/ FF `viewChangingExperimentToolbarStyle` as `toolbarIcons`', () => {
  const initEditor = async (
    adf: any,
    viewport: { width: number; height: number } = {
      width: 950,
      height: 1020,
    },
  ) => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI, viewport, {
      smartLinks: {
        resolveBeforeMacros: ['jira'],
        allowBlockCards: true,
        allowEmbeds: true,
      },
      featureFlags: {
        'view-changing-experiment-toolbar-style': 'toolbarIcons',
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
    await page.mouse.move(0, 0);
    await snapshot(page);
  });

  it('can switch to URL appearance', async () => {
    await initEditor(cardAppearanceAdf);
    // we first render a smart inline link
    await waitForResolvedInlineCard(page);
    await waitForInlineCardSelection(page);
    // change the appearance to blue link
    await page.click('[data-testid="url-appearance"]');
    await page.waitForSelector('a[href="https://inlineCardTestUrl"]');
    // make sure we render a blue link
    await page.mouse.move(0, 0);
    await snapshot(page);
    await page.click('a[href="https://inlineCardTestUrl"]');
    await page.waitForSelector('div[aria-label="Floating Toolbar"]');
    // we can see the appearance switcher for the blue link
    await page.mouse.move(0, 0);
    await snapshot(page);
  });

  it('should show allowed options for smart link inside a list', async () => {
    await initEditor(cardListAppearanceAdf);
    await waitForResolvedInlineCard(page);
    await waitForInlineCardSelection(page);
    await page.mouse.move(0, 0);
    await snapshot(page);
  });

  it('should show a tooltip when hovering a disabled appearance', async () => {
    const takeSnapshot = async () => {
      await page.hover('[data-testid="block-appearance"]');
      await waitForTooltip(page);
      await snapshot(page);
      // move mouse away and wait until tooltip disappear.;
      await page.mouse.move(0, 0);
      await page.waitForTimeout(500);
      await page.hover('[data-testid="embed-appearance"]');
      await waitForTooltip(page);
      await snapshot(page);
    };
    // Init
    await initEditor(cardInsideUnsupportedNodesAdf);
    await waitForResolvedInlineCard(page);

    // List parent
    await waitForInlineCardSelection(page);
    await takeSnapshot();

    // Action parent
    await waitForInlineCardSelection(page, '[data-node-type="actionList"] ');
    await takeSnapshot();

    // Blockquote parent
    await waitForInlineCardSelection(page, 'blockquote ');
    await takeSnapshot();

    // Decision
    await waitForInlineCardSelection(page, '[data-node-type="decisionList"] ');
    await takeSnapshot();
  });

  it('should show allowed options for blue link inside a list', async () => {
    await initEditor(cardListBlueLinkAppearanceAdf);
    await page.waitForSelector('a[href="https://inlineCardTestUrl"]');
    await page.click('a[href="https://inlineCardTestUrl"]');
    await page.waitForSelector('div[aria-label="Floating Toolbar"]');
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
    await page.click('[data-testid="block-appearance"]');
    await page.mouse.move(0, 0);
    await snapshot(page);

    // change the appearance to embed
    await page.click(blockCardSelector());
    await page.waitForSelector('div[aria-label="Floating Toolbar"]');
    await page.click('[data-testid="embed-appearance"]');
    await page.mouse.move(0, 0);
    await waitForFloatingControl(page, 'Card options');
    await waitForElementCount(page, '[data-iframe-loaded="true"]', 1);
    await page.hover('.embed-header');
    await snapshot(page);
  });

  it('should wrap from the first line when its wider than its container', async () => {
    await initEditor(cardInsideTable, {
      width: 850,
      height: 280,
    });
    await waitForResolvedInlineCard(page);
    await snapshot(page, undefined, '.pm-table-wrapper');
  });
});
