import {
  Device,
  snapshot,
  initFullPageEditorWithAdf,
  getContentBoundingRectTopLeftCoords,
} from '../_utils';
import {
  PuppeteerPage,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';
import {
  expandADF,
  tableMediaADF,
  nestedExpandOverflowInTable,
  wrappingMediaADF,
  mediaInExpandADF,
  mediaInNestedExpandADF,
} from './__fixtures__/expand-adf';
import * as simpleExpandAdf from './__fixtures__/simple-expand.adf.json';
import { selectors } from '../../__helpers/page-objects/_expand';
import { emojiSelectors } from '../../__helpers/page-objects/_emoji';
import {
  clickFirstCell,
  tableSelectors,
} from '../../__helpers/page-objects/_table';
import {
  resizeMediaInPositionWithSnapshot,
  waitForMediaToBeLoaded,
} from '../../__helpers/page-objects/_media';
import { getBoundingRect } from '../../__helpers/page-objects/_editor';
import expandAdf from './__fixtures__/expand-breakout.adf.json';
import { waitForFloatingControl } from '../../__helpers/page-objects/_toolbar';
import { toggleBreakout } from '../../__helpers/page-objects/_layouts';

const hideTooltip = async (page: PuppeteerPage) => {
  // Hide the tooltip
  const css = `
 .Tooltip {
   opacity: 0 !important;
 }
`;
  await page.addStyleTag({ content: css });
};

describe('Expand: full-page', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined, selectors.expand);
  });

  describe.each(['default', 'wide', 'full-width'])('Breakout: %s', mode => {
    it(`should render a ${mode} collapsed top level expand`, async () => {
      await initFullPageEditorWithAdf(page, expandADF(mode), Device.LaptopMDPI);
      await page.waitForSelector(selectors.expand);
      await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
    });
  });

  it('should collapse the top level expand on click', async () => {
    await initFullPageEditorWithAdf(page, expandADF(), Device.LaptopMDPI);
    await page.waitForSelector(selectors.expand);
    await hideTooltip(page);
    await page.click(selectors.expandToggle);
  });

  it('should render a border on hover of a collapsed top level expand', async () => {
    await initFullPageEditorWithAdf(page, expandADF(), Device.LaptopMDPI);
    await page.waitForSelector(selectors.expand);
    await hideTooltip(page);
    await page.click(selectors.expandToggle);
    await page.hover(selectors.expandTitleInput);
  });

  it('should collapse a nested expand on click', async () => {
    await initFullPageEditorWithAdf(page, expandADF(), Device.LaptopMDPI);
    await page.waitForSelector(selectors.expand);
    await page.click(selectors.nestedExpandToggle);
    await page.click(selectors.expandTitleInput);
  });

  it('table row controls should not be cut off', async () => {
    await initFullPageEditorWithAdf(page, tableMediaADF, Device.LaptopMDPI);
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
    );
    await page.waitForSelector(selectors.nestedExpand);
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
  });

  it('should display expand as selected when click on padding', async () => {
    await initFullPageEditorWithAdf(page, simpleExpandAdf, Device.LaptopMDPI);
    await page.waitForSelector(selectors.expand);

    const contentBoundingRect = await getContentBoundingRectTopLeftCoords(
      page,
      selectors.expand,
    );
    await page.mouse.click(
      contentBoundingRect.left + 5,
      contentBoundingRect.top + 5,
    );
  });

  it("doesn't select expand if click and drag before releasing mouse", async () => {
    await initFullPageEditorWithAdf(page, simpleExpandAdf, Device.LaptopMDPI);
    const contentBoundingRect = await getContentBoundingRectTopLeftCoords(
      page,
      selectors.expandContent,
    );

    // start in centre of expand, mousedown and then move to padding before releasing
    await page.mouse.move(
      contentBoundingRect.left + contentBoundingRect.width * 0.5,
      contentBoundingRect.top + contentBoundingRect.height * 0.5,
    );
    await page.mouse.down();
    await page.mouse.move(contentBoundingRect.left, contentBoundingRect.top);
    await page.mouse.up();
  });
});
describe('Expand: Selection', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, expandAdf, Device.LaptopHiDPI, {
      width: 1000,
      height: 400,
    });
    await page.waitForSelector(selectors.expand);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('shows the breakout button when selected', async () => {
    await page.waitForSelector(selectors.expand);

    const bounds = await getBoundingRect(page, selectors.expand);
    const middleTopX = bounds.left + bounds.width / 2;
    await page.mouse.click(middleTopX, bounds.top);
    await page.waitForSelector(selectors.removeButton);
  });
  it('keeps node selection when breakout changed', async () => {
    await page.waitForSelector(selectors.expand);

    const bounds = await getBoundingRect(page, selectors.expand);
    const middleTopX = bounds.left + bounds.width / 2;
    await page.mouse.click(middleTopX, bounds.top);
    await page.waitForSelector(selectors.removeButton);

    await waitForFloatingControl(page, 'Go wide', undefined, false);
    await toggleBreakout(page, 1);
    await page.waitForSelector('div[aria-label="Go full width"]');
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
    await page.click('[data-testid="media-file-card-view"] .img-wrapper');
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
    await page.click('[data-testid="media-file-card-view"] .img-wrapper');
    await resizeMediaInPositionWithSnapshot(page, 0, 50);
  });
});

describe('Expand: allowInteractiveExpand', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined, selectors.expand);
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
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
    });
  });
});
