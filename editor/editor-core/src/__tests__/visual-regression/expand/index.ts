/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import { getBoundingClientRect } from '@atlaskit/editor-test-helpers/vr-utils/bounding-client-rect';
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';
import {
  expandADF,
  mediaInExpandADF,
  mediaInNestedExpandADF,
  nestedExpandOverflowInTable,
  tableMediaADF,
  wrappingMediaADF,
} from './__fixtures__/expand-adf';
import * as simpleExpandAdf from './__fixtures__/simple-expand.adf.json';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/expand';
import {
  emojiSelectors,
  waitForEmojisToLoad,
} from '@atlaskit/editor-test-helpers/page-objects/emoji';
import {
  clickFirstCell,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import {
  resizeMediaInPositionWithSnapshot,
  waitForMediaToBeLoaded,
} from '@atlaskit/editor-test-helpers/page-objects/media';
import {
  getBoundingRect,
  animationFrame,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
import expandBreakoutAdf from './__fixtures__/expand-breakout.adf.json';
import nestedExpandAdf from './__fixtures__/nested-expand.adf.json';
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import { toggleBreakout } from '@atlaskit/editor-test-helpers/page-objects/layouts';
import { selectionSelectors } from '@atlaskit/editor-test-helpers/page-objects/selection';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */

const themes = ['light', 'dark'];

function getTheme(theme: any) {
  return theme === 'dark' ? 'dark' : 'light';
}

describe('Expand: full-page', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined, selectors.expand, {
      captureBeyondViewport: false,
    });
  });

  /**
   * All tests in the `describe.each(themes)` block below are executed twice for both light and dark themes.
   */
  describe.each(themes)('Theme: %s', (theme) => {
    describe.each(['default', 'wide', 'full-width'])('Breakout: %s', (mode) => {
      it(`should render a ${mode} collapsed top level expand`, async () => {
        await initFullPageEditorWithAdf(
          page,
          expandADF(mode),
          Device.LaptopMDPI,
          undefined,
          undefined,
          getTheme(theme),
        );
        await page.waitForSelector(selectors.expand);
        await waitForEmojisToLoad(page);
      });
    });

    it('should render a border on hover of a collapsed top level expand', async () => {
      await initFullPageEditorWithAdf(
        page,
        expandADF(),
        Device.LaptopMDPI,
        undefined,
        undefined,
        getTheme(theme),
      );
      await page.waitForSelector(selectors.expand);
      await page.click(selectors.expandToggle);
      await page.hover(selectors.expandTitleInput);
      await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
    });

    it('table row controls should not be cut off', async () => {
      await initFullPageEditorWithAdf(
        page,
        tableMediaADF,
        Device.LaptopMDPI,
        undefined,
        undefined,
        getTheme(theme),
      );
      await page.waitForSelector(selectors.expand);
      await clickFirstCell(page);
      await page.waitForSelector(tableSelectors.firstRowControl);
      await page.click(tableSelectors.firstRowControl);
    });

    it('expands should hide their overflow content', async () => {
      await initFullPageEditorWithAdf(
        page,
        nestedExpandOverflowInTable,
        Device.LaptopMDPI,
        undefined,
        undefined,
        getTheme(theme),
      );
      await page.waitForSelector(selectors.nestedExpand);
      await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
    });

    // TODO: Unskip flaky tests (ED-15254)
    it.skip('should display expand as selected when click on padding', async () => {
      await initFullPageEditorWithAdf(
        page,
        simpleExpandAdf,
        Device.LaptopMDPI,
        undefined,
        undefined,
        getTheme(theme),
      );
      await page.waitForSelector(selectors.expand);

      const contentBoundingRect = await getBoundingClientRect(
        page,
        selectors.expand,
      );
      await page.mouse.click(
        contentBoundingRect.left + 5,
        contentBoundingRect.top + 5,
      );
    });
  });

  it('should collapse the top level expand on click', async () => {
    await initFullPageEditorWithAdf(page, expandADF(), Device.LaptopMDPI);
    await page.waitForSelector(selectors.expand);
    await page.click(selectors.expandToggle);
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
  });

  it('should collapse a nested expand on click', async () => {
    await initFullPageEditorWithAdf(page, expandADF(), Device.LaptopMDPI);
    await page.waitForSelector(selectors.expand);
    await page.click(selectors.nestedExpandToggle);
    await page.click(selectors.expandTitleInput);
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
  });
});

describe('Expand: Selection', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  /**
   * All tests in the `describe.each(themes)` block below are executed twice for both light and dark themes.
   */
  describe.each(themes)('Theme: %s', (theme) => {
    beforeEach(async () => {
      await initFullPageEditorWithAdf(
        page,
        expandBreakoutAdf,
        Device.LaptopHiDPI,
        {
          width: 1000,
          height: 400,
        },
        undefined,
        getTheme(theme),
      );
      await page.waitForSelector(selectors.expand);
    });

    afterEach(async () => {
      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
    });

    it('shows the breakout button when selected', async () => {
      await page.waitForSelector(selectors.expand);

      const bounds = await getBoundingRect(page, selectors.expand);
      const middleTopX = bounds.left + bounds.width / 2;
      await page.mouse.click(middleTopX, bounds.top);
      await page.waitForSelector(selectors.removeButton);
    });

    it('shows danger state when hovering over the remove button', async () => {
      await page.waitForSelector(selectors.expand);

      const bounds = await getBoundingRect(page, selectors.expand);
      const middleTopX = bounds.left + bounds.width / 2;
      await page.mouse.click(middleTopX, bounds.top);
      await page.waitForSelector(selectors.removeButton);

      await page.hover(selectors.removeButton);
    });

    it('keeps node selection when breakout changed', async () => {
      await page.waitForSelector(selectors.expand);

      const bounds = await getBoundingRect(page, selectors.expand);
      const middleTopX = bounds.left + bounds.width / 2;
      await page.mouse.click(middleTopX, bounds.top);
      await animationFrame(page);
      await page.waitForSelector(selectors.removeButton);

      await waitForFloatingControl(page, 'Go wide', undefined, false);
      await toggleBreakout(page, 1);
      await animationFrame(page);
      await page.waitForSelector('div[aria-label="Go full width"]');
    });

    // FIXME: This test was automatically skipped due to failure on 02/10/2023: https://product-fabric.atlassian.net/browse/ED-20262
    it.skip('displays nested expand as selected when clicked', async () => {
      await initFullPageEditorWithAdf(page, nestedExpandAdf, Device.LaptopMDPI);
      await page.waitForSelector(selectors.nestedExpand);
      const contentBoundingRect = await getBoundingClientRect(
        page,
        selectors.nestedExpand,
      );
      await page.mouse.click(
        contentBoundingRect.left + 5,
        contentBoundingRect.top + 5,
      );
      await page.waitForSelector(selectionSelectors.selectedNode);
      await waitForFloatingControl(page, 'Expand toolbar');
    });
  });
});

// This block is seperate as Puppeteer has some
// issues screenshotting the expand with wrapped media.
describe('Expand: Media', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  it('should allow wrapped media to flow correctly', async () => {
    await initFullPageEditorWithAdf(page, wrappingMediaADF, Device.LaptopMDPI);
    await page.waitForSelector(selectors.expand);
    await waitForMediaToBeLoaded(page);
    await page.click(`${selectors.expand} p`);
    await snapshot(page);
  });

  it('should not show grid lines when re-sizing inside an expand', async () => {
    await initFullPageEditorWithAdf(page, mediaInExpandADF, Device.LaptopMDPI);
    await page.waitForSelector(selectors.expand);
    await waitForMediaToBeLoaded(page);
    await page.click('[data-testid="media-file-card-view"]');
    await resizeMediaInPositionWithSnapshot(page, 0, 50);
  });

  it('should not show grid lines when re-sizing inside a nested expand', async () => {
    await initFullPageEditorWithAdf(
      page,
      mediaInNestedExpandADF,
      Device.LaptopMDPI,
    );
    await page.waitForSelector(selectors.nestedExpand);
    await waitForMediaToBeLoaded(page);
    await page.click('[data-testid="media-file-card-view"]');
    await resizeMediaInPositionWithSnapshot(page, 0, 50);
  });
});

describe('Expand: allowInteractiveExpand', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
    await snapshot(page, undefined, selectors.expand);
  });

  describe('when the flag is true', () => {
    it('should collapse the expand when clicked', async () => {
      await initFullPageEditorWithAdf(
        page,
        expandADF('default'),
        Device.LaptopMDPI,
        undefined,
        {
          allowExpand: {
            allowInteractiveExpand: true,
          },
        },
      );
      await page.waitForSelector(selectors.expand);
      await page.click(selectors.expandToggle);
      await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
    });
  });

  describe('when the flag is false', () => {
    it('should not collapse the expand when clicked', async () => {
      await initFullPageEditorWithAdf(
        page,
        expandADF('default'),
        Device.LaptopMDPI,
        undefined,
        {
          allowExpand: {
            allowInteractiveExpand: false,
          },
        },
      );
      await page.waitForSelector(selectors.expand);
      await page.click(selectors.expandToggle);
      await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
    });
  });
});
