import { TestPage, PuppeteerPage } from './_types';
import { selectors } from './_editor';
import messages from '../../../messages';
import { toolbarMessages } from '../../../plugins/layout/toolbar-messages';

export const layoutSelectors = {
  section: '[data-layout-section]',
  column: '[data-layout-column]',
  active: '[data-layout-section].selected',
  content: '[data-layout-content="true"]',
  removeButton: 'button[aria-label="Remove"]',
};

function getLayoutSelector(columWidthPercentages = [50, 50]) {
  return columWidthPercentages
    .map(
      (p, i) =>
        `div[data-layout-section="true"] > div:nth-child(${
          i + 1
        })[data-column-width="${p}"]`,
    )
    .join(', ');
}

const layoutElementSelectors = {
  [toolbarMessages.twoColumns.defaultMessage]: {
    selector: getLayoutSelector([50, 50]),
    columns: 2,
  },
  [toolbarMessages.rightSidebar.defaultMessage]: {
    selector: getLayoutSelector([66.66, 33.33]),
    columns: 2,
  },
  [toolbarMessages.leftSidebar.defaultMessage]: {
    selector: getLayoutSelector([33.33, 66.66]),
    columns: 2,
  },
  [toolbarMessages.threeColumns.defaultMessage]: {
    selector: getLayoutSelector([33.33, 33.33, 33.33]),
    columns: 3,
  },
  [toolbarMessages.threeColumnsWithSidebars.defaultMessage]: {
    selector: getLayoutSelector([25, 50, 25]),
    columns: 3,
  },
};

// Wait for layout to adjust to newly chosen type
export async function waitForLayoutChange(
  page: PuppeteerPage,
  layoutButtonLabel: keyof typeof layoutElementSelectors,
) {
  await page.waitForFunction(
    (data: { selector: string; columns: number }) =>
      document.querySelectorAll(data.selector).length === data.columns,
    { timeout: 5000 },
    layoutElementSelectors[layoutButtonLabel],
  );
}

function getColumnElementXPath(column: number, paragraph: number) {
  return `(//div[@data-layout-column])[${column}]//p[${paragraph}]`;
}

export const clickOnLayoutColumn = async (
  page: PuppeteerPage,
  column: number = 1,
  paragraph: number = 1,
) => {
  const elementPath = getColumnElementXPath(column, paragraph);
  await page.waitForXPath(elementPath, { timeout: 5000 });
  const target = await page.$x(elementPath);
  expect(target.length).toBeGreaterThan(0);
  await target[0].click();
  await page.waitForSelector(layoutSelectors.active);
};

export const scrollToLayoutColumn = async (
  page: PuppeteerPage,
  column: number = 0,
  offset: number = 0,
) => {
  await page.evaluate(
    (
      columnsSelector: string,
      column: number,
      scrollContainerSelector: string,
      offset: number,
    ) => {
      const $scrollContainerSelector: HTMLDivElement = document.querySelector(
        scrollContainerSelector,
      )! as HTMLDivElement;

      const $column: HTMLDivElement = document.querySelectorAll(
        columnsSelector,
      )[column]! as HTMLDivElement;
      const $section: HTMLDivElement = $column.offsetParent as HTMLDivElement;

      const { offsetTop } = $section;

      const top = offsetTop + offset;

      $scrollContainerSelector.scrollTo({
        top,
        left: 0,
        behavior: 'auto',
      });
    },
    layoutSelectors.column,
    column,
    selectors.scrollContainer,
    offset,
  );

  await page.waitForFunction(
    (
      columnsSelector: string,
      column: number,
      scrollContainerSelector: string,
      offset: number,
    ) => {
      const $scrollContainerSelector: HTMLDivElement = document.querySelector(
        scrollContainerSelector,
      )! as HTMLDivElement;

      const $column: HTMLDivElement = document.querySelectorAll(
        columnsSelector,
      )[column]! as HTMLDivElement;
      const $section: HTMLDivElement = $column.offsetParent as HTMLDivElement;

      const { offsetTop } = $section;

      const top = offsetTop + offset;

      return $scrollContainerSelector.scrollTop === top;
    },
    undefined,
    layoutSelectors.column,
    column,
    selectors.scrollContainer,
    offset,
  );
};

export const waitForLayoutToolbar = async (page: TestPage) => {
  await page.waitForSelector('[aria-label="Layout floating controls"]');
};

export const toggleBreakout = async (page: TestPage, times: number) => {
  const timesArray = Array.from({ length: times });

  const breakoutSelector = [
    messages.layoutFixedWidth.defaultMessage,
    messages.layoutWide.defaultMessage,
    messages.layoutFullWidth.defaultMessage,
  ]
    .map(label => `[aria-label="${label}"]`)
    .join();

  for (let _iter of timesArray) {
    await page.waitForSelector(breakoutSelector);
    await page.click(breakoutSelector);
  }
};

// Wait for a layout to be nested within a particular breakout container
export async function waitForBreakoutNestedLayout(
  page: TestPage,
  breakoutType: 'wide' | 'full-width',
) {
  const layoutSelector = 'div[data-layout-section="true"]';
  const breakoutSelector = `.fabric-editor-breakout-mark[data-layout="${breakoutType}"]`;
  await page.waitForSelector(`${breakoutSelector} ${layoutSelector}`, {
    timeout: 5000,
  });
}
