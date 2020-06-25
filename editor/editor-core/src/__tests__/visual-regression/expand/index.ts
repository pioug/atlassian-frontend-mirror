import {
  Device,
  snapshot,
  initFullPageEditorWithAdf,
  getContentBoundingRectTopLeftCoords,
} from '../_utils';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';
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
import { Page } from '../../__helpers/page-objects/_types';
import { emojiSelectors } from '../../__helpers/page-objects/_emoji';
import {
  clickFirstCell,
  tableSelectors,
} from '../../__helpers/page-objects/_table';
import {
  resizeMediaInPositionWithSnapshot,
  waitForMediaToBeLoaded,
} from '../../__helpers/page-objects/_media';

const hideTooltip = async (page: Page) => {
  // Hide the tooltip
  const css = `
 .Tooltip {
   opacity: 0 !important;
 }
`;
  await page.addStyleTag({ content: css });
};

describe('Expand: full-page', () => {
  let page: Page;

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
});

// This block is seperate as Puppeteer has some
// issues screenshotting the expand with wrapped media.
describe('Expand: Media', () => {
  let page: Page;

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

describe.skip('Expand: allowInteractiveExpand', () => {
  let page: Page;

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined, selectors.expand);
  });

  describe('when the flag is false', () => {
    it('should disable the expand button', async () => {
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
