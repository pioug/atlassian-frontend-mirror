// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { getBoundingClientRect } from '@atlaskit/editor-test-helpers/vr-utils/bounding-client-rect';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { layoutSelectors } from '@atlaskit/editor-test-helpers/page-objects/layouts';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { decisionSelectors } from '@atlaskit/editor-test-helpers/page-objects/decision';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import * as col1 from './__fixtures__/column1-adf.json';
import * as col2 from './__fixtures__/column2-adf.json';
import * as col3 from './__fixtures__/column3-adf.json';
import * as layoutWithAction from './__fixtures__/layout-with-action-adf.json';
import * as layoutWithDecision from './__fixtures__/layout-with-decision-adf.json';
import * as layoutWithDecisions from './__fixtures__/layout-with-decisions-adf.json';
import * as colLeftSidebar from './__fixtures__/columnLeftSidebar-adf.json';
import * as colRightSidebar from './__fixtures__/columnRightSidebar-adf.json';
import * as col3WithSidebars from './__fixtures__/column3WithSidebars-adf.json';

// Copied from 'packages/editor/editor-plugin-layout/src/toolbar.ts`
const layoutToolbarTitle = 'Layout floating controls';

describe('Layouts:', () => {
  let page: PuppeteerPage;

  const layouts = [
    ['1 column', col1],
    ['2 columns', col2],
    ['3 columns', col3],
    ['left sidebar', colLeftSidebar],
    ['right sidebar', colRightSidebar],
    ['3 columns with sidebars', col3WithSidebars],
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

  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await waitForFloatingControl(page, layoutToolbarTitle);
    await snapshot(page);

    // Click away to remove floating control so it gets reset between
    // viewport resizes.
    // This avoids test flakiness from misaligned toolbar anchorage.
    await page.mouse.click(0, 0);
    // As part if the page reset we need to ensure nothing is selected before the next test runs.
    await page.evaluate(() => document.getSelection()?.removeAllRanges());
  });

  describe.each(layouts)(`%s`, (_name, adf) => {
    it('should correctly render layout on laptop', async () => {
      await initEditor(adf, largeViewport);
      await page.waitForSelector(layoutSelectors.column);
      await page.click(layoutSelectors.column);
    });

    it('should stack layout on smaller screen', async () => {
      await initEditor(adf, smallViewport);
      await page.waitForSelector(layoutSelectors.column);
      await page.click(layoutSelectors.column);
    });
  });

  it('should actions placeholder not overflow the layout', async () => {
    await initEditor(layoutWithAction, largeViewport);
    await page.waitForSelector(layoutSelectors.column);
    await page.click(layoutSelectors.column);
  });

  it('should display as selected when clicked on', async () => {
    await initEditor(col2, largeViewport);
    const contentBoundingRect = await getBoundingClientRect(
      page,
      layoutSelectors.section,
    );
    // prosemirror-bump-fix
    // The posAtCoords after prosemirror-view@1.30.2 has a slight adjust
    // to figure out if the user is clicking at the node or on its side.
    // Hence, this small offset guarantees a click inside the node then the selection created will be a node one
    await page.mouse.click(
      contentBoundingRect.left + 1,
      contentBoundingRect.top + 1,
    );
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
