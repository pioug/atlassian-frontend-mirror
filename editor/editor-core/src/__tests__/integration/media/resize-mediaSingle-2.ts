import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page, { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import { goToEditorTestingWDExample } from '../../__helpers/testing-example-helpers';
import defaultTableAdf from './_fixtures_/defaultTableAdf.json';
import {
  navigateToTableCell,
  selectTable,
  setTableLayout,
} from '../../__helpers/page-objects/_table';
import { insertMedia, removeMedia } from '../_helpers';
import { resizeMediaSingle } from '../../__helpers/page-objects/_media';
import {
  assertWidthBeforeAndAfter,
  calcSizeDragDistance,
  setupEditor,
} from './resize-mediaSingle-1';

BrowserTestCase(
  'resize-mediaSingle.ts: Image is resized down in left column of 3x3 table with different layouts',
  { skip: [] },
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingWDExample(browserObject);
    await page.setWindowSize(1980, 1200);

    // There was a regressions when allowTables.advanced is false.
    await setupEditor(page, {
      advancedAllowTables: true,
      allowLayouts: false,
      initialAdf: defaultTableAdf,
    });

    await selectTable(page);
    await navigateToTableCell(page, 2, 1);

    /**
     * First part of the test. Normal table layout.
     */
    await insertMedia(page);

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
    await removeMedia(page);

    /**
     * Second part of the test. Wide table layout.
     */
    await setTableLayout(page, 'wide');
    await insertMedia(page);

    startWidth = 302;
    endWidth = 238;
    widths = await resizeMediaSingle(page, {
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

    await removeMedia(page);

    /**
     * Third part of the test. Full-width table layout.
     */
    await setTableLayout(page, 'fullWidth');
    await insertMedia(page);

    startWidth = 583;
    endWidth = 499;
    widths = await resizeMediaSingle(page, {
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
