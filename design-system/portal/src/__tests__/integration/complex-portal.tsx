import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlPortal = getExampleUrl('design-system', 'portal', 'complex-layering');

const tooltipZIndex = 800;
const modalZIndex = 510;
const spotlightZIndex = 701;

const tooltipPortalSelector = `div.atlaskit-portal[style="z-index: ${tooltipZIndex};"]`;
const modalPortalSelector = `div.atlaskit-portal[style="z-index: ${modalZIndex};"]`;
const spotlightPortalSelector = `div.atlaskit-portal[style="z-index: ${spotlightZIndex};"]`;
const openDialogButtonSelector = 'span=Open Dialog';
const showOnboardingButtonSelector = 'span=Show onboarding';
const clickMeTooltipSelector = 'div[role="tooltip"]=Click me';
const parentModalDialogSelector = 'section[role="dialog"]';

BrowserTestCase(
  'When we hover over "Open Dialog" button then "Click Me" tooltip should be visible and a portal should be created',
  // skipping this test for safari as of now to unblock build. ToDo: Investigate cause of failure
  { skip: ['safari'] },
  async (client: any) => {
    const page = new Page(client);
    await page.goto(urlPortal);
    await page.waitForSelector(openDialogButtonSelector);
    await page.hover(openDialogButtonSelector);
    const tooltip = await (await page.$(tooltipPortalSelector)).$(
      clickMeTooltipSelector,
    );
    await tooltip.waitForDisplayed();
    const isTooltipExisting = await tooltip.isExisting();
    const tooltipText = await tooltip.getText();

    expect(isTooltipExisting).toBe(true);
    expect(tooltipText).toBe('Click me');

    await page.checkConsoleErrors();
  },
);

BrowserTestCase(
  'When we click on "Open Dialog" button then a parent modal dialog should be visible and a portal should be created',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(urlPortal);
    await page.waitForSelector(openDialogButtonSelector);
    await page.click(openDialogButtonSelector);
    const modal = await (await page.$(modalPortalSelector)).$(
      parentModalDialogSelector,
    );
    const modalHeader = await modal.$('[data-testid="modal--header"]');
    await modal.waitForDisplayed();
    const isModalExisting = await modal.isExisting();
    const modalHeaderText = await modalHeader.getText();

    expect(isModalExisting).toBe(true);
    expect(modalHeaderText).toBe('Modal dialog');

    await page.checkConsoleErrors();
  },
);

BrowserTestCase(
  'When we click on "Show onboarding" button then a spot light should be visible and a portal should be created',
  {},
  async (client: any) => {
    const page = new Page(client);
    await page.goto(urlPortal);
    await page.waitForSelector(openDialogButtonSelector);
    await page.click(openDialogButtonSelector);
    await page.waitForSelector(modalPortalSelector);
    const parentModal = await (await page.$(modalPortalSelector)).$(
      parentModalDialogSelector,
    );
    const showOnboardingButton = await parentModal.$(
      showOnboardingButtonSelector,
    );
    await showOnboardingButton.click();
    const spotlightPortal = await page.$(spotlightPortalSelector);
    const isSpotlightExisting = await spotlightPortal.isExisting();

    expect(isSpotlightExisting).toBe(true);

    await page.checkConsoleErrors();
  },
);
