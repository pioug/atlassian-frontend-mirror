import { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';
import { TestPage, PuppeteerPage } from './_types';
import { selectors } from './_editor';
import messages from '../../../messages';
import { toolbarMessages } from '../../../plugins/layout/toolbar-messages';
import { layoutToolbarTitle } from '../../../plugins/layout/toolbar';
import { clickToolbarMenu, ToolbarMenuItem } from './_toolbar';

export const layoutSelectors = {
  section: '[data-layout-section]',
  column: '[data-layout-column]',
  active: '[data-layout-section].selected',
  content: '[data-layout-content="true"]',
  removeButton: 'button[aria-label="Remove"]',
};

export type BreakoutType = 'fixed' | 'wide' | 'fullWidth';

export const breakoutSelectors: { [key in BreakoutType]: string } = {
  fixed: `[data-testid="${messages.layoutFixedWidth.id}"]`,
  wide: `[data-testid="${messages.layoutWide.id}"]`,
  fullWidth: `[data-testid="${messages.layoutFullWidth.id}"]`,
};
export const allBreakoutTypes = Object.keys(
  breakoutSelectors,
) as BreakoutType[];

const anyBreakoutSelector = Object.values(breakoutSelectors).join();

export const layoutTestIds = {
  twoColumns: toolbarMessages.twoColumns.id,
  rightSidebar: toolbarMessages.rightSidebar.id,
  leftSidebar: toolbarMessages.leftSidebar.id,
  threeColumns: toolbarMessages.threeColumns.id,
  threeColumnsWithSidebars: toolbarMessages.threeColumnsWithSidebars.id,
};

export type LayoutType = keyof typeof layoutTestIds;

function getLayoutSelector(columnWidthPercentages = [50, 50]) {
  return columnWidthPercentages
    .map(
      (p, i) =>
        `div[data-layout-section="true"] > div:nth-child(${
          i + 1
        })[data-column-width="${p}"]`,
    )
    .join(', ');
}

const layoutElementSelectors = {
  [toolbarMessages.twoColumns.id]: {
    selector: getLayoutSelector([50, 50]),
    columns: 2,
  },
  [toolbarMessages.rightSidebar.id]: {
    selector: getLayoutSelector([66.66, 33.33]),
    columns: 2,
  },
  [toolbarMessages.leftSidebar.id]: {
    selector: getLayoutSelector([33.33, 66.66]),
    columns: 2,
  },
  [toolbarMessages.threeColumns.id]: {
    selector: getLayoutSelector([33.33, 33.33, 33.33]),
    columns: 3,
  },
  [toolbarMessages.threeColumnsWithSidebars.id]: {
    selector: getLayoutSelector([25, 50, 25]),
    columns: 3,
  },
};

export async function addLayout(page: WebDriverPage, layoutType: LayoutType) {
  await clickToolbarMenu(page, ToolbarMenuItem.layouts);
  await waitForLayoutToolbar(page);

  const layoutButtonTestid = layoutTestIds[layoutType];
  const layoutBtnSelector = `[data-testid="${layoutButtonTestid}"]`;
  await page.waitForSelector(layoutBtnSelector);
  await page.click(layoutBtnSelector);

  // Waiting for layout actually to change
  const { columns, selector } = layoutElementSelectors[layoutButtonTestid];
  await page.waitForElementCount(selector, columns);
}

export async function removeLayout(page: WebDriverPage) {
  await page.waitForSelector(layoutSelectors.removeButton);
  await page.click(layoutSelectors.removeButton);
}

export async function selectLayoutColumn(page: WebDriverPage, index: number) {
  const columns = await page.$$(layoutSelectors.column);
  if (columns.length >= index) {
    await columns[index].click();
  } else {
    throw new Error(`Selector \`${layoutSelectors.column}\` contains only ${columns.length} elements,
    but ${index}th was requested to be clicked`);
  }
}

/**
 * Detect which breakout is current one, iterate till desired one.
 * This will work on both tables and layouts. Assumption is breakout button is visible when
 * this function is called.
 */
export async function selectBreakout(
  page: WebDriverPage,
  desiredBreakoutType: BreakoutType,
) {
  // Detect current breakout first
  const isWideBreakout = !!(await page.count(breakoutSelectors.fullWidth)); // it is wide if button is for full width
  const isFullWidthBreakout = !!(await page.count(breakoutSelectors.fixed));

  let currentBreakoutIndex: number = isFullWidthBreakout
    ? 2
    : isWideBreakout
    ? 1
    : 0;

  while (allBreakoutTypes[currentBreakoutIndex] !== desiredBreakoutType) {
    const nextBreakoutIndex =
      (currentBreakoutIndex + 1) % allBreakoutTypes.length;
    const nextBreakoutSelector =
      breakoutSelectors[allBreakoutTypes[nextBreakoutIndex]];
    await page.waitForSelector(nextBreakoutSelector);
    await page.click(nextBreakoutSelector);
    currentBreakoutIndex = nextBreakoutIndex;
  }
}

// Wait for layout to adjust to newly chosen type
export async function waitForLayoutChange(
  page: PuppeteerPage,
  layoutButtonTestid: keyof typeof layoutElementSelectors,
) {
  await page.waitForFunction(
    (data: { selector: string; columns: number }) =>
      document.querySelectorAll(data.selector).length === data.columns,
    { timeout: 5000 },
    layoutElementSelectors[layoutButtonTestid],
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
  await page.waitForSelector(`[aria-label="${layoutToolbarTitle}"]`);
};

export const toggleBreakout = async (page: TestPage, times: number) => {
  const timesArray = Array.from({ length: times });

  for (let _iter of timesArray) {
    await page.waitForSelector(anyBreakoutSelector);
    await page.click(anyBreakoutSelector);
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
