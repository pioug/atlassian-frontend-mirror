import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page, { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import { goToEditorTestingWDExample } from '@atlaskit/editor-test-helpers/testing-example-page';
import { testMediaSingle } from '@atlaskit/editor-test-helpers/media-mock';

import defaultTableAdfAndMedia from './_fixtures_/defaultTableAdfAndMedia';
import {
  navigateToTableCell,
  selectTable,
  setTableLayout,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import { resizeMediaSingle } from '@atlaskit/editor-test-helpers/page-objects/media';
import {
  assertWidthBeforeAndAfter,
  calcSizeDragDistance,
  setupEditor,
} from './_utils';

BrowserTestCase(
  'resize-mediaSingle.ts: Image is resized down in left column of 3x3 table with different layouts. 1/3',
  {},
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingWDExample(browserObject);
    await page.setWindowSize(1980, 1200);

    // There was a regressions when allowTables.advanced is false.
    await setupEditor(page, {
      advancedAllowTables: true,
      allowLayouts: false,
      initialAdf: defaultTableAdfAndMedia(testMediaSingle.id),
    });

    await selectTable(page);
    await navigateToTableCell(page, 2, 1);

    /**
     * First part of the test. Normal table layout.
     */
    let startWidth = 236;
    let endWidth = 107;
    let widths = await resizeMediaSingle(page, {
      units: 'pixels',
      amount: calcSizeDragDistance(startWidth, endWidth),
    });

    assertWidthBeforeAndAfter(
      {
        startWidth,
        endWidth,
      },
      widths,
      'with normal table layout',
    );
  },
);

BrowserTestCase(
  'resize-mediaSingle.ts: Image is resized down in left column of 3x3 table with different layouts. 2/3',
  {},
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingWDExample(browserObject);
    await page.setWindowSize(1980, 1200);

    // There was a regressions when allowTables.advanced is false.
    await setupEditor(page, {
      advancedAllowTables: true,
      allowLayouts: false,
      initialAdf: defaultTableAdfAndMedia(testMediaSingle.id),
    });

    await selectTable(page);
    await navigateToTableCell(page, 2, 1);

    /**
     * Second part of the test. Wide table layout.
     */
    await setTableLayout(page, 'wide');

    let startWidth = 302;
    let endWidth = 238;
    let widths = await resizeMediaSingle(page, {
      units: 'pixels',
      amount: calcSizeDragDistance(startWidth, endWidth),
    });

    assertWidthBeforeAndAfter(
      {
        startWidth,
        endWidth,
      },
      widths,
      'with wide table layout',
    );
  },
);

BrowserTestCase(
  'resize-mediaSingle.ts: Image is resized down in left column of 3x3 table with different layouts. 3/3',
  {},
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingWDExample(browserObject);
    await page.setWindowSize(1980, 1200);

    // There was a regressions when allowTables.advanced is false.
    await setupEditor(page, {
      advancedAllowTables: true,
      allowLayouts: false,
      initialAdf: defaultTableAdfAndMedia(testMediaSingle.id),
    });

    await selectTable(page);
    await navigateToTableCell(page, 2, 1);

    /**
     * Third part of the test. Full-width table layout.
     */
    await setTableLayout(page, 'fullWidth');

    let startWidth = 583;
    let endWidth = 499;
    let widths = await resizeMediaSingle(page, {
      units: 'pixels',
      amount: calcSizeDragDistance(startWidth, endWidth),
    });

    assertWidthBeforeAndAfter(
      {
        startWidth,
        endWidth,
      },
      widths,
      'with full-width table layout',
    );
  },
);
