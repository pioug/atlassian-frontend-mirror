import {
  getExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

import { openModal, waitForTooltip } from './_helper';

const container = "div[data-testid='container']";
const openModalButton = "button[data-testid='open-modal']";
const modalDialog = "[role='dialog']";

const scrollToMiddle = "button[data-testid='scroll-to-middle']";
const scrollToBottom = "button[data-testid='scroll-to-bottom']";

const url = getExampleUrl(
  'design-system',
  'modal-dialog',
  'with-layered-components',
  global.__BASEURL__,
);

const options = {
  triggerSelector: openModalButton,
  modalSelector: modalDialog,
  scrollSelector: container,
  scrollTo: { x: 425, y: 0 },
  viewport: { width: 1200, height: 675 },
};

describe('<Modal />', () => {
  it('with Popup', async () => {
    const page = await openModal(url, options);

    await page.click(scrollToMiddle);
    await page.click("[data-testid='popup-trigger']");

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('with Tooltip', async () => {
    const page = await openModal(url, options);

    await page.click(scrollToMiddle);
    await page.hover("[data-testid='tooltip-trigger']");
    await waitForTooltip(page);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('with PopupSelect', async () => {
    const page = await openModal(url, options);

    await page.click(scrollToMiddle);
    await page.click("[data-testid='popup-select-trigger']");

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('with Select (z-index: 9999, menuPortalTarget: document.body, menuPosition: fixed)', async () => {
    const page = await openModal(url, options);

    await page.click(scrollToMiddle);
    await page.click('.select-zindex-fixed');

    // Wait for the animation to finish
    await page.waitForTimeout(1000);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('with Select (menuPosition: fixed)', async () => {
    const page = await openModal(url, options);

    await page.click(scrollToMiddle);
    await page.click('.select-fixed');

    // Wait for the animation to finish
    await page.waitForTimeout(1000);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('with Select (menuPosition: absolute)', async () => {
    const page = await openModal(url, options);

    await page.click(scrollToMiddle);
    await page.click('.select-absolute');

    // Wait for the animation to finish
    await page.waitForTimeout(1000);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('with FlagGroup', async () => {
    const page = await openModal(url, options);

    await page.click(scrollToMiddle);
    await page.click("[data-testid='flag-trigger']");
    await page.waitForSelector("[data-testid='flag-1']");

    await page.click("[data-testid='flag-trigger']");
    await page.waitForSelector("[data-testid='flag-2']");

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  // TODO: DSP-1663 fix flakey VR
  it.skip('with DropdownMenu', async () => {
    const page = await openModal(url, options);

    await page.click(scrollToBottom);
    await page.click("[data-testid='dropdown-menu--trigger']");
    await page.waitForSelector("[data-testid='dropdown-menu--content']");

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('with AvatarGroup', async () => {
    const page = await openModal(url, options);

    await page.click(scrollToBottom);
    await page.click("[data-testid='avatar-group--overflow-menu--trigger']");
    await page.waitForSelector("[data-testid='avatar-group--overflow-menu']");

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });
  // TODO: DSP-1663 fix flakey VR
  it.skip('with DatePicker', async () => {
    const page = await openModal(url, options);

    await page.click(scrollToBottom);
    await page.click("[data-testid='date-picker--container']");
    await page.waitForSelector(
      "[data-testid='date-picker--calendar--container']",
    );

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });
});
