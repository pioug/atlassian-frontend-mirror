import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { insertMedia, fullpage } from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { selectTable } from '../../__helpers/page-objects/_table';
import Page, { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import { withInRangeMatchers } from './_matchers';
import tableWithOneCellAdf from './_fixtures_/tableWithOneCellAdf.json';
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

export const setupEditor = async (
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

export const assertWidthBeforeAndAfter = (
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

export const calcSizeDragDistance = (startWidth: number, endWidth: number) =>
  Math.floor(
    ((startWidth - endWidth) / 2) * // distance from start to end on one side
      0.6, // We want to drag more then 50% so it snap to the end width
  ) * -1; // Since we moving on right side if start width bigger then end, we want negative value

BrowserTestCase(
  'resize-mediaSingle.ts: Does not throw for allowTables.advanced: false',
  { skip: [] },
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingWDExample(browserObject);
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
