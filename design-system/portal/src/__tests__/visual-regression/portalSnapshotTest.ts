import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

const openDialogButtonSelector = '#openDialogBtn';
const portalSelector = '.atlaskit-portal';
const dialogSelector = '.atlaskit-portal section[role="dialog"]';
const lastDialogSelector = '.atlaskit-portal:nth-last-child(2)';
const openAnotherButtonSelector =
  '[data-testid="modal-dialog-content--action-1"]';
const showFlagButtonSelector = '#showFlagBtn';
const showOnboardingButtonSelector = '#showOnboardingBtn';
const toggleZIndexButtonSelector = '#toggleZIndexBtn';
const changeChildValueButtonSelector = '#changeChildValue';

describe('Snapshot Test', () => {
  it(`Portal stacking context should match prod`, async () => {
    const url = getExampleUrl(
      'design-system',
      'portal',
      'stacking-context',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(portalSelector);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
  it(`Changing z-index of portal should change stacking context`, async () => {
    const url = getExampleUrl(
      'design-system',
      'portal',
      'portal-re-render',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(portalSelector);
    await page.waitForSelector(toggleZIndexButtonSelector);
    const btn = await page.$(toggleZIndexButtonSelector);
    await btn?.click();
    await page.waitForSelector(portalSelector);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
  it(`Changing children of portal should not affect stacking context`, async () => {
    const url = getExampleUrl(
      'design-system',
      'portal',
      'portal-re-render',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(portalSelector);
    await page.waitForSelector(changeChildValueButtonSelector);
    const btn = await page.$(changeChildValueButtonSelector);
    await btn?.click();
    await page.waitForSelector(portalSelector);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  it.skip(`Portal should create portals with different stacking context for different layers`, async () => {
    const url = getExampleUrl(
      'design-system',
      'portal',
      'complex-layering',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.waitForSelector(openDialogButtonSelector);
    const openDialogButton = await page.$(openDialogButtonSelector);
    await openDialogButton?.click();
    const dialog = await page.waitForSelector(dialogSelector);
    const openAnotherButton = await dialog?.$(openAnotherButtonSelector);
    await openAnotherButton?.click();
    const lastDialog = await page.$(lastDialogSelector);
    const showFlagButton = await lastDialog?.$(showFlagButtonSelector);
    await showFlagButton?.click();

    const showOnboardingButton = await lastDialog?.$(
      showOnboardingButtonSelector,
    );
    await showOnboardingButton?.click();

    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
  });
});
