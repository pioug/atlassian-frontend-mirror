import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import { TRANSITION_DURATION } from '../../../common/constants';

/* Url to test the example */
const exampleUrl = getExampleUrl(
  'design-system',
  'page-layout',
  'locked-sidebar',
);

/* Css selectors used for the test */
const leftSidebar = "[data-testid='left-sidebar']";
const rightSidebar = "[data-testid='right-sidebar']";
const resizeControl = "[data-testid='left-sidebar-resize-button']";
const mainContent = "[data-ds--page-layout--slot='main']";
const popupTrigger = "[data-testid='popup-trigger']";
const sideNavigation = `${leftSidebar} > div > div:not([data-resize-control])`;

/* Helper functions */
const wait = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay);
  });

const collapseSidebarIfOpen = async (page: Page) => {
  if ((await page.getAttribute(resizeControl, 'aria-expanded')) === 'true') {
    await page.click(resizeControl);
    await wait(TRANSITION_DURATION);
  }
};

const expectSidebarCollapsed = async (page: Page) => {
  // Not expanded
  expect((await page.getAttribute(resizeControl, 'aria-expanded')) === 'false');
  // Not visible
  expect(
    await page.getCSSProperty(sideNavigation, 'visibility'),
  ).toHaveProperty('value', 'hidden');
};

const expectSidebarFlyout = async (page: Page) => {
  // Not expanded
  expect((await page.getAttribute(resizeControl, 'aria-expanded')) === 'false');
  // Visible
  expect(
    await page.getCSSProperty(sideNavigation, 'visibility'),
  ).toHaveProperty('value', 'visible');
};

// FIXME: https://product-fabric.atlassian.net/browse/DSP-1284 in Safari.
BrowserTestCase(
  'Hovering the sidebar opens the flyout',
  { skip: ['safari'] },
  async (client: any) => {
    const page = new Page(client);
    await page.goto(exampleUrl);
    await page.waitForSelector(leftSidebar);

    await collapseSidebarIfOpen(page);
    await expectSidebarCollapsed(page);

    await page.hover(leftSidebar);
    await wait(TRANSITION_DURATION);
    await expectSidebarFlyout(page);
  },
);

BrowserTestCase(
  'The flyout is not locked by default',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(exampleUrl);
    await page.waitForSelector(leftSidebar);

    await collapseSidebarIfOpen(page);

    await page.hover(leftSidebar);
    await wait(TRANSITION_DURATION);

    const { width } = await page.getBoundingRect(sideNavigation);
    await page.moveTo(mainContent, width + 100, 0);
    await wait(TRANSITION_DURATION);
    await expectSidebarCollapsed(page);
  },
);
// FIXME: https://product-fabric.atlassian.net/browse/DSP-1284 in Safari.
BrowserTestCase(
  'The lock prevents the flyout state from automatically collapsing',
  { skip: ['safari'] },
  async (client: any) => {
    const page = new Page(client);
    await page.goto(exampleUrl);
    await page.waitForSelector(leftSidebar);

    await collapseSidebarIfOpen(page);

    await page.hover(leftSidebar);
    await wait(TRANSITION_DURATION);

    await page.click(popupTrigger);

    const { width } = await page.getBoundingRect(sideNavigation);
    await page.moveTo(mainContent, width + 100, 0);
    await wait(TRANSITION_DURATION);
    await expectSidebarFlyout(page);
  },
);
// FIXME: https://product-fabric.atlassian.net/browse/DSP-1284 in Safari.
BrowserTestCase(
  'Releasing the lock while the cursor is outside of the sidebar will make the flyout collapse',
  { skip: ['safari'] },
  async (client: WebdriverIO.BrowserObject) => {
    const page = new Page(client);
    await page.goto(exampleUrl);
    await page.waitForSelector(leftSidebar);

    await collapseSidebarIfOpen(page);

    await page.hover(leftSidebar);
    await wait(TRANSITION_DURATION);

    await page.click(popupTrigger);
    await page.click(rightSidebar);
    await wait(TRANSITION_DURATION);
    await expectSidebarCollapsed(page);
  },
);

BrowserTestCase(
  'Releasing the lock while the cursor is inside of the sidebar will make the flyout stay open',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(exampleUrl);
    await page.waitForSelector(leftSidebar);

    await collapseSidebarIfOpen(page);

    await page.hover(leftSidebar);
    await wait(TRANSITION_DURATION);

    await page.click(popupTrigger);

    await page.click(leftSidebar);
    await wait(TRANSITION_DURATION);
    await expectSidebarFlyout(page);
  },
);
