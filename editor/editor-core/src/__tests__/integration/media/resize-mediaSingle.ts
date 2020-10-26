import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { insertMedia, fullpage, removeMedia } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import {
  selectTable,
  navigateToTableCell,
  setTableLayout,
} from '../../__helpers/page-objects/_table';
import Page, { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import { withInRangeMatchers } from './_matchers';
import tableWithOneCellAdf from './_fixtures_/tableWithOneCellAdf.json';
import defaultTableAdf from './_fixtures_/defaultTableAdf.json';
import mediaSingleInsideListWithinLayoutAdf from './_fixtures_/media-single-inside-list-within-layout.adf.json';
import {
  resizeMediaSingle,
  ResizeMediaSingleResult,
} from '../../__helpers/page-objects/_media';

expect.extend(withInRangeMatchers);

interface SetupEditorOptions {
  advancedAllowTables: boolean;
  allowLayouts: boolean;
  initialAdf?: object;
}

const setupEditor = async (
  page: Page,
  { advancedAllowTables, allowLayouts, initialAdf }: SetupEditorOptions = {
    advancedAllowTables: true,
    allowLayouts: true,
  },
) => {
  await mountEditor(page, {
    appearance: fullpage.appearance,
    allowTables: {
      advanced: advancedAllowTables,
    },
    allowLayouts: allowLayouts && {
      UNSAFE_addSidebarLayouts: true,

      allowBreakout: true,
    },
    allowBreakout: allowLayouts || advancedAllowTables,
    defaultValue: initialAdf && JSON.stringify(initialAdf),
    media: {
      allowMediaSingle: true,
      allowResizing: true,
    },
  });
};

const assertWidthBeforeAndAfter = (
  {
    startWidth: expectedStartWidth,
    endWidth: expectedEndWidth,
  }: ResizeMediaSingleResult,
  {
    startWidth: actualStartWidth,
    endWidth: actualEndWidth,
  }: ResizeMediaSingleResult,
  context: string = '',
) => {
  expect({
    context,
    startWidth: actualStartWidth,
    endWidth: actualEndWidth,
  }).toEqual({
    context,
    startWidth: expect.toBeAroundNumber(expectedStartWidth, 2),
    endWidth: expect.toBeAroundNumber(expectedEndWidth, 2),
  });
};

const calcSizeDragDistance = (startWidth: number, endWidth: number) =>
  Math.floor(
    ((startWidth - endWidth) / 2) * // distance from start to end on one side
      0.6, // We want to drag more then 50% so it snap to the end width
  ) * -1; // Since we moving on right side if start width bigger then end, we want negative value

BrowserTestCase(
  'resize-mediaSingle.ts: Does not throw for allowTables.advanced: false',
  { skip: [] },
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingExample(browserObject);
    await page.setWindowSize(1980, 1200);

    await setupEditor(page, {
      advancedAllowTables: false,
      allowLayouts: false,
      initialAdf: tableWithOneCellAdf,
    });

    await selectTable(page);

    /**
     * First part of the test. Normal table layout.
     */
    await insertMedia(page);

    let startWidth = 742;
    let endWidth = 499;
    let widths = await resizeMediaSingle(page, {
      resizeBy: -100,
    });

    // if resizing is aborted or the logic to decide whether to resize
    // throws resizing won't happen, thus the dimensions stay the same
    assertWidthBeforeAndAfter(
      {
        startWidth,
        endWidth,
      },
      widths,
    );
  },
);

BrowserTestCase(
  'resize-mediaSingle.ts: Image is resized down in left column of 3x3 table with different layouts',
  { skip: [] },
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingExample(browserObject);
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
      resizeBy: calcSizeDragDistance(startWidth, endWidth),
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
      resizeBy: calcSizeDragDistance(startWidth, endWidth),
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
      resizeBy: calcSizeDragDistance(startWidth, endWidth),
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

BrowserTestCase(
  'resize-mediaSingle.ts: Image is resized in 1x1 table with different layouts',
  { skip: [] },
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingExample(browserObject);
    await page.setWindowSize(1980, 1200);

    // There was a regressions when allowTables.advanced is false.
    await setupEditor(page, {
      advancedAllowTables: true,
      allowLayouts: false,
      initialAdf: tableWithOneCellAdf,
    });

    await selectTable(page);

    /**
     * First part of the test. Normal table layout.
     */
    await insertMedia(page);

    let startWidth = 742;
    let endWidth = 630;
    let widths = await resizeMediaSingle(page, {
      resizeBy: calcSizeDragDistance(startWidth, endWidth),
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

    startWidth = 760; // Pay attention to it's being slightly bigger then 742 in normal layout 🤷🏻‍
    endWidth = 630;
    widths = await resizeMediaSingle(page, {
      resizeBy: calcSizeDragDistance(startWidth, endWidth),
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

    startWidth = 760; // Pay attention to it's being slightly bigger then 742 in normal layout 🤷🏻‍
    endWidth = 630;

    widths = await resizeMediaSingle(page, {
      resizeBy: calcSizeDragDistance(startWidth, endWidth),
    });

    assertWidthBeforeAndAfter(
      {
        startWidth: 760,
        endWidth: 630,
      },
      widths,
      'with full-width table layout',
    );
  },
);

BrowserTestCase(
  'resize-mediaSingle.ts: Image within List is resized to 100% inside column of a two-column layout [EDM-1318]',
  { skip: [] },
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingExample(browserObject);
    await page.setWindowSize(1980, 1200);

    await setupEditor(page, {
      advancedAllowTables: true,
      allowLayouts: true,
      initialAdf: mediaSingleInsideListWithinLayoutAdf,
    });

    let startWidth = 157;
    let endWidth = 338;
    let widths = await resizeMediaSingle(page, {
      resizeBy: 500,
    });

    assertWidthBeforeAndAfter(
      {
        startWidth,
        endWidth,
      },
      widths,
      'with two-column layout',
    );
  },
);
