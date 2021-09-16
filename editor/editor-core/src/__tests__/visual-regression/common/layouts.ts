import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  getBoundingClientRect,
} from '../_utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { layoutSelectors } from '../../__helpers/page-objects/_layouts';
import { decisionSelectors } from '../../__helpers/page-objects/_decision';
import {
  waitForFloatingControl,
  retryUntilStablePosition,
} from '../../__helpers/page-objects/_toolbar';
import * as col1 from './__fixtures__/column1-adf.json';
import * as col2 from './__fixtures__/column2-adf.json';
import * as col3 from './__fixtures__/column3-adf.json';
import * as layoutWithAction from './__fixtures__/layout-with-action-adf.json';
import * as layoutWithDecision from './__fixtures__/layout-with-decision-adf.json';
import * as layoutWithDecisions from './__fixtures__/layout-with-decisions-adf.json';
import * as colLeftSidebar from './__fixtures__/columnLeftSidebar-adf.json';
import * as colRightSidebar from './__fixtures__/columnRightSidebar-adf.json';
import * as col3WithSidebars from './__fixtures__/column3WithSidebars-adf.json';
import { layoutToolbarTitle } from '../../../plugins/layout/toolbar';

describe('Layouts:', () => {
  let page: PuppeteerPage;

  const layouts = [
    { name: '1 column', adf: col1 },
    { name: '2 columns', adf: col2 },
    { name: '3 columns', adf: col3 },
    { name: 'left sidebar', adf: colLeftSidebar },
    { name: 'right sidebar', adf: colRightSidebar },
    { name: '3 columns with sidebars', adf: col3WithSidebars },
  ];

  const smallViewport = { width: 768, height: 400 };
  const largeViewport = { width: 1040, height: 400 };

  const initEditor = async (
    adf: Object,
    viewport: { width: number; height: number },
  ) =>
    initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport,
      editorProps: {
        allowLayouts: {
          allowBreakout: true,
          UNSAFE_addSidebarLayouts: true,
          UNSAFE_allowSingleColumnLayout: true,
        },
      },
    });

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await waitForFloatingControl(page, layoutToolbarTitle);
    await snapshot(page);
    // Click away to remove floating control so it gets reset between
    // viewport resizes.
    // This avoids test flakiness from misaligned toolbar anchorage.
    await page.mouse.move(0, 0);
  });

  layouts.forEach((layout) => {
    describe(layout.name, () => {
      it('should correctly render layout on laptop', async () => {
        await initEditor(layout.adf, largeViewport);
        await retryUntilStablePosition(
          page,
          () => page.click(layoutSelectors.column),
          `[aria-label*="${layoutToolbarTitle}"]`,
          1000,
          true,
        );
      });

      it('should stack layout on smaller screen', async () => {
        await initEditor(layout.adf, smallViewport);
        await page.click(layoutSelectors.column);
      });
    });
  });

  it('should actions placeholder not overflow the layout', async () => {
    await initEditor(layoutWithAction, largeViewport);
    await page.click(layoutSelectors.column);
  });

  it('should display as selected when clicked on', async () => {
    await initEditor(col2, largeViewport);
    const contentBoundingRect = await getBoundingClientRect(
      page,
      layoutSelectors.section,
    );
    await page.mouse.click(contentBoundingRect.left, contentBoundingRect.top);
  });

  describe('decisions', () => {
    it('should display single decision correctly inside layout', async () => {
      await initEditor(layoutWithDecision, largeViewport);
      await page.waitForSelector(decisionSelectors.decisionItem);
    });

    it('should display many decisions correctly inside layout', async () => {
      await initEditor(layoutWithDecisions, largeViewport);
      await page.waitForSelector(decisionSelectors.decisionItem);
    });
  });
});
