import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page, { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import { goToEditorTestingWDExample } from '../../__helpers/testing-example-helpers';
import {
  addLayout,
  allBreakoutTypes,
  BreakoutType,
  LayoutType,
  removeLayout,
  selectBreakout,
  selectLayoutColumn,
} from '../../__helpers/page-objects/_layouts';
import { insertMedia, removeMedia } from '../_helpers';
import { resizeMediaSingle } from '../../__helpers/page-objects/_media';
import { assertWidthBeforeAndAfter, setupEditor } from './resize-mediaSingle-1';

BrowserTestCase(
  'resize-mediaSingle.ts: Image is resized in the layout',
  /**
   * FIXME: This test times out for all browsers. It needs to be split up.
   * @see https://product-fabric.atlassian.net/browse/EDM-1541
   * @see https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/6614/afp-2188-prevent-inaccurate-jest-results
   */
  { skip: ['chrome', 'firefox', 'edge', 'safari'] },
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingWDExample(browserObject);
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
