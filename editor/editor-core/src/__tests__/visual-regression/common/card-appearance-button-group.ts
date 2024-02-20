// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { hyperlinkSelectors } from '@atlaskit/editor-test-helpers/page-objects/hyperlink';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  toolbarAppearanceSelectors,
  waitForCardToolbar,
} from '@atlaskit/editor-test-helpers/page-objects/smart-links';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  inlineCardSelector,
  waitForInlineCardSelection,
  waitForResolvedInlineCard,
} from '@atlaskit/media-integration-test-helpers';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  waitForElementCount,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';

import cardAppearanceAdf from './__fixtures__/card-appearance-adf.json';
import cardInsideTable from './__fixtures__/card-inside-table.adf.json';
import cardListAppearanceAdf from './__fixtures__/card-list-appearance.adf.json';
import cardListBlueLinkAppearanceAdf from './__fixtures__/card-list-blue-link-appearance.adf.json';
import cardInsideUnsupportedNodesAdf from './__fixtures__/card_inside_unsupported_nodes.adf.json';
import { contexts } from './__helpers__/card-utils';

// FIXME: Skipping theses tests as it has been failing on master on CI due to "Screenshot comparison failed" issue.
// Build URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2319963/steps/%7B31b3ca1c-6917-4861-88ed-d816d6fae22f%7D
describe('Cards with icons toolbar', () => {
  const initEditor = async (
    adf: any,
    viewport: { width: number; height: number } = {
      width: 950,
      height: 1020,
    },
  ) => {
    await initFullPageEditorWithAdf(
      page,
      adf,
      Device.LaptopHiDPI,
      viewport,
      {
        smartLinks: {
          resolveBeforeMacros: ['jira'],
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
      undefined,
      {
        tooltips: true,
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
    await page.mouse.move(0, 0);
    await snapshot(page);
  });

  it('can switch to URL appearance', async () => {
    await initEditor(cardAppearanceAdf);
    // we first render a smart inline link
    await waitForResolvedInlineCard(page);
    await waitForInlineCardSelection(page);
    // change the appearance to blue link
    await page.click(toolbarAppearanceSelectors.url);
    await page.waitForSelector('a[href="https://inlineCardTestUrl"]');
    // make sure we render a blue link
    await page.mouse.move(0, 0);
    await snapshot(page);
    await page.click('a[href="https://inlineCardTestUrl"]');
    await page.waitForSelector(hyperlinkSelectors.floatingToolbar);
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
      await page.hover(toolbarAppearanceSelectors.block);
      await waitForTooltip(page);
      await snapshot(page);
      // move mouse away and wait until tooltip disappear.;
      await page.mouse.move(0, 0);
      await page.waitForTimeout(500);
      await page.hover(toolbarAppearanceSelectors.embed);
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
    await page.waitForSelector(hyperlinkSelectors.floatingToolbar);
    await snapshot(page);
  });

  // TODO: Unskip tests https://product-fabric.atlassian.net/browse/ED-17208
  const skipContexts = [{ name: 'layout' }];

  const contextsFiltered = contexts.filter(
    ({ name }) => !skipContexts.some(({ name: skipName }) => skipName === name),
  );

  describe.each(contextsFiltered)('', ({ name, adf, appearances }) => {
    describe(`can switch appearance inside ${name} from inline to`, () => {
      const setup = async () => {
        await initEditor(adf, {
          width: 1440,
          height: 600,
        });
        await waitForResolvedInlineCard(page);
        await page.click(inlineCardSelector());
        await waitForCardToolbar(page);
      };

      // FIXME: Skipping theses tests as it has been failing on master on CI due to "Screenshot comparison failed" issue.
      // Build URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2319963/steps/%7B31b3ca1c-6917-4861-88ed-d816d6fae22f%7D
      if (appearances?.includes('card')) {
        it.skip('card', async () => {
          await setup();
          await page.click(toolbarAppearanceSelectors.block);
          await page.mouse.move(0, 0);
          await snapshot(page);
        });
      }

      if (appearances?.includes('embed')) {
        it('embed', async () => {
          await setup();
          await page.click(toolbarAppearanceSelectors.embed);
          await waitForElementCount(page, '[data-iframe-loaded="true"]', 1);
          await page.mouse.move(0, 0);
          await snapshot(page);
        });
      }

      it('url', async () => {
        await setup();
        await page.click(toolbarAppearanceSelectors.url);
        await page.mouse.move(0, 0);
        await snapshot(page);
      });
    });
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
