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
import {
  addLayout,
  selectBreakout,
  selectLayoutColumn,
  BreakoutType,
  allBreakoutTypes,
  LayoutType,
  removeLayout,
} from '../../__helpers/page-objects/_layouts';

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
  debugMode: boolean = false,
) => {
  if (debugMode) {
    // eslint-disable-next-line no-console
    console.log(
      `start: ${actualStartWidth}, finish: ${actualEndWidth} @ ${context}`,
    );
  } else {
    expect({
      context,
      startWidth: actualStartWidth,
      endWidth: actualEndWidth,
    }).toEqual({
      context,
      startWidth: expect.toBeAroundNumber(expectedStartWidth),
      endWidth: expect.toBeAroundNumber(expectedEndWidth),
    });
  }
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
      units: 'pixels',
      amount: -100,
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

    startWidth = 760; // Pay attention to it's being slightly bigger then 742 in normal layout 🤷🏻‍
    endWidth = 630;
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

    startWidth = 760; // Pay attention to it's being slightly bigger then 742 in normal layout 🤷🏻‍
    endWidth = 630;

    widths = await resizeMediaSingle(page, {
      units: 'pixels',
      amount: calcSizeDragDistance(startWidth, endWidth),
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
      units: 'pixels',
      amount: 500,
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

BrowserTestCase(
  'resize-mediaSingle.ts: Image is resized in the layout',
  { skip: [] },
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingExample(browserObject);
    // This 1500 is important for Safari to work for mysterious reasons. Yes, :magic:
    // But seriously, for some reason, I can't click second column after big image was deleted in a first column.
    await page.setWindowSize(1980, 1500);

    // There was a regressions when allowTables.advanced is false.
    await setupEditor(page);

    /**
     * Turn this to "true" to make it run without assertion but only console.loging the result.
     * This is useful if editor changes something, that affects all the concrete measurments and
     * this would allow you update them easier.
     */
    const debugMode = false;

    // LayoutType: [column1, column2, ...]; where column1 is {BreakoutType: {start, finish}}
    const expectedWidths: {
      [key in LayoutType]: {
        [key in BreakoutType]: { start: number; finish: number };
      }[];
    } = {
      twoColumns: Array(2)
        .fill(null)
        .map(() => ({
          fixed: {
            start: 362,
            finish: 298,
          },
          wide: {
            start: 488,
            finish: 403,
          },
          fullWidth: {
            start: 882,
            finish: 732,
          },
        })),
      threeColumns: Array(3)
        .fill(null)
        .map(() => ({
          fixed: {
            start: 230,
            finish: 188,
          },
          wide: {
            start: 314,
            finish: 258,
          },
          fullWidth: {
            start: 577,
            finish: 477,
          },
        })),
      rightSidebar: [
        // Left (bigger) column
        {
          fixed: {
            start: 491,
            finish: 406,
          },
          wide: {
            start: 659,
            finish: 546,
          },
          fullWidth: {
            start: 1185,
            finish: 984,
          },
        },
        // Right (smaller) column
        {
          fixed: {
            start: 233,
            finish: 191,
          },
          wide: {
            start: 316,
            finish: 260,
          },
          fullWidth: {
            start: 579,
            finish: 479,
          },
        },
      ],
      leftSidebar: [
        // Left (smaller) column
        {
          fixed: {
            start: 233,
            finish: 191,
          },
          wide: {
            start: 316,
            finish: 260,
          },
          fullWidth: {
            start: 579,
            finish: 479,
          },
        },
        // Right (bigger) column
        {
          fixed: {
            start: 491,
            finish: 406,
          },
          wide: {
            start: 659,
            finish: 546,
          },
          fullWidth: {
            start: 1185,
            finish: 984,
          },
        },
      ],
      threeColumnsWithSidebars: [
        {
          fixed: {
            start: 166,
            finish: 135,
          },
          wide: {
            start: 229,
            finish: 187,
          },
          fullWidth: {
            start: 426,
            finish: 352,
          },
        },
        {
          fixed: {
            start: 358,
            finish: 295,
          },
          wide: {
            start: 483,
            finish: 399,
          },
          fullWidth: {
            start: 878,
            finish: 728,
          },
        },
        {
          fixed: {
            start: 166,
            finish: 135,
          },
          wide: {
            start: 229,
            finish: 187,
          },
          fullWidth: {
            start: 426,
            finish: 352,
          },
        },
      ],
    };

    // Iterate over layout types (two columns, three columns etc)
    for (
      let layoutTypeIndex = 0;
      layoutTypeIndex < Object.keys(expectedWidths).length;
      layoutTypeIndex++
    ) {
      const layoutType = Object.keys(expectedWidths)[
        layoutTypeIndex
      ] as LayoutType;

      await addLayout(page, layoutType);

      // Iterate over all breakouts (fixed, wide, full-width)
      for (let i = 0; i < allBreakoutTypes.length; i++) {
        const breakoutType = allBreakoutTypes[i];

        // This will ensure that current layout is actually selected
        // and breakout button is visible
        await selectLayoutColumn(page, 0);

        await selectBreakout(page, breakoutType);

        const columns = expectedWidths[layoutType];
        // Iterate over each column of current layout with current breakout
        for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
          await selectLayoutColumn(page, columnIndex);

          await insertMedia(page);

          const widths = await resizeMediaSingle(page, {
            // In layout 100% image width equals to column width (different in tables)
            // This allows us not to specify delta value in px but rather in relative terms.
            // Next size is 83.3, so one side difference is (100-83.3)/2 = 8.35
            // but we want to undershoot a bit, so 0.075
            units: 'percent',
            amount: -0.075,
          });

          const errorMessageContext = `for ${layoutType} layout type with ${breakoutType} breakout in ${
            columnIndex + 1
          } column`;

          assertWidthBeforeAndAfter(
            {
              startWidth:
                expectedWidths[layoutType][columnIndex][breakoutType].start,
              endWidth:
                expectedWidths[layoutType][columnIndex][breakoutType].finish,
            },
            widths,
            errorMessageContext,
            debugMode,
          );

          await removeMedia(page);
        }
      }

      await removeLayout(page);
    }
  },
);
