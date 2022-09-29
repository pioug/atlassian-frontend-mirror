import { mountEditor } from '@atlaskit/editor-test-helpers/testing-example-page';
import { fullpage } from '@atlaskit/editor-test-helpers/integration/helpers';
import type { ResizeMediaSingleResult } from '@atlaskit/editor-test-helpers/page-objects/media';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { withInRangeMatchers } from './_matchers';

expect.extend(withInRangeMatchers);

export async function waitForNumImages(page: Page, n: number) {
  await page.waitUntil(async () => {
    const images = await page.$$('.ProseMirror [data-testid="media-image"]');
    return images.length >= n;
  }, 'waitForNumImages failed');

  return await page.$$('.ProseMirror [data-testid="media-image"]');
}

export async function waitForAtLeastNumFileCards(page: Page, n: number) {
  await page.waitUntil(async () => {
    const fileCards = await page.$$(
      '.ProseMirror [data-testid="media-file-card-view"][data-test-status="complete"]',
    );
    return fileCards.length >= n;
  }, 'waitForAtLeastNumFileCards failed');

  return await page.$$(
    '.ProseMirror [data-testid="media-file-card-view"][data-test-status="complete"]',
  );
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
