// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mountEditor } from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { fullpage } from '@atlaskit/editor-test-helpers/integration/helpers';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import type { ResizeMediaSingleResult } from '@atlaskit/editor-test-helpers/page-objects/media';
import {
  mediaFileIconSelector,
  mediaImageSelector,
  mediaClickableSelector,
} from '@atlaskit/editor-test-helpers/page-objects/media';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import type Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { withInRangeMatchers } from './_matchers';

expect.extend(withInRangeMatchers);

export async function waitForNumImages(page: Page, n: number) {
  const selector = `.ProseMirror ${mediaImageSelector}`;
  await page.waitForSelector(selector);
  expect(await page.count(selector)).toBe(n);
  return await page.$$(selector);
}

export async function waitForNumFileCards(page: Page, n: number) {
  const selector = `.ProseMirror ${mediaFileIconSelector}, .ProseMirror ${mediaImageSelector}`;
  await page.waitForSelector(selector);
  expect(await page.count(selector)).toBe(n);
  return await page.$$(`.ProseMirror ${mediaClickableSelector}`);
}

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
