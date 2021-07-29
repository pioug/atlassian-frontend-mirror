import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

import { openModal } from './_helper';

const openModalBtn = "[data-testid='modal-trigger']";
const modalDialog = "[data-testid='modal']";
const modalHeader = "[data-testid='modal-dialog-content--header']";
const modalFooter = "[data-testid='modal-dialog-content--footer']";
const modalBody = "[data-testid='modal-dialog-content--scrollable']";
const selectBtn = '.single-select';
const scrollToBottomBtn = "[data-testid='scrollDown']";
const largeModalBtn = "[data-testid='large']";
const booleanBtn = "[data-testid='boolean-trigger']";
const autoFocusBtn = "[data-testid='autofocus-trigger']";
const warningModalBtn = "[data-testid='warning']";
const dangerModalBtn = "[data-testid='danger']";
const visibilitySelector = '[data-testid="visibility--checkbox-label"]';
const multilineSelector = '[data-testid="multiline--checkbox-label"]';
const scrollOutsideSelector = '[data-testid="outside--radio-label"]';

const defaultOptions = {
  triggerSelector: openModalBtn,
  modalSelector: modalDialog,
  viewport: { width: 800, height: 600 },
};

describe('Snapshot test', () => {
  it('Basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'defaultModal',
      global.__BASEURL__,
    );

    const page = await openModal(url, defaultOptions);

    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  it('User can use appearance to override button sequence as a walk-around', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'appearance-override',
      global.__BASEURL__,
    );

    const page = await openModal(url, defaultOptions);

    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Scroll behaviour inside should match (with bottom keyline only)', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'scroll',
      global.__BASEURL__,
    );

    const page = await openModal(url, defaultOptions);

    // When scroll is at the top, only bottom keyline is displayed.
    const scrollToTop = await takeElementScreenShot(page, 'body');
    expect(scrollToTop).toMatchProdImageSnapshot();
  });

  it('Scroll behaviour inside should match (with both top and bottom keylines)', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'scroll',
      global.__BASEURL__,
    );

    const page = await openModal(url, defaultOptions);

    // When scroll is in the middle, both top and bottom keylines are displayed.
    await page.evaluate(
      (selector) => document.querySelector(selector).scrollTo(0, 200),
      modalBody,
    );

    const scrollToMiddle = await takeElementScreenShot(page, 'body');
    expect(scrollToMiddle).toMatchProdImageSnapshot();
  });

  it('Scroll behaviour inside should match (with top keyline only)', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'scroll',
      global.__BASEURL__,
    );

    const page = await openModal(url, defaultOptions);

    // When scroll is at the bottom, only top keyline is displayed.
    await page.click(scrollToBottomBtn);
    await page.waitForTimeout(1000);
    const scrollToBottom = await takeElementScreenShot(page, 'body');
    expect(scrollToBottom).toMatchProdImageSnapshot();
  });

  it('Scroll behaviour outside should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'scroll',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    const radioSelector = 'input[value="outside"]';
    await page.waitForSelector(radioSelector);
    await page.click(radioSelector);

    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('Scroll behaviour inside-wide should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'scroll',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);

    // Clicking the inside-wide radio button sets the body to 3000px
    // which causes a page reflow. Rather than using an arbitrary wait
    // time to let the content shifting settle, we resize the viewport
    // to the same size before clicking it to lessen the effect.
    await page.setViewport({ width: 3000, height: 600 });

    const radioSelector = 'input[value="inside-wide"]';
    await page.waitForSelector(radioSelector);
    await page.click(radioSelector);

    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('Footer should not come over select dropdown', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'with-footer-and-select-option',
      global.__BASEURL__,
    );

    const page = await openModal(url, defaultOptions);

    await page.waitForSelector(selectBtn);
    await page.click(selectBtn);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('Example with focus on secondary button should match production', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'with-focus-on-secondary-button',
      global.__BASEURL__,
    );

    const page = await openModal(url, defaultOptions);

    const image = await takeElementScreenShot(page, modalFooter);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Form example should match production', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'form',
      global.__BASEURL__,
    );

    const page = await openModal(url, defaultOptions);

    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Multiple stacked modal example should match production', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'multiple',
      global.__BASEURL__,
    );

    const page = await openModal(url, {
      ...defaultOptions,
      triggerSelector: largeModalBtn,
    });

    await page.waitForTimeout(1000);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();

    //open second stacked modal
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    const image2 = await page.screenshot();
    expect(image2).toMatchProdImageSnapshot();

    //open third stacked modal
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    const image3 = await page.screenshot();
    expect(image3).toMatchProdImageSnapshot();
  });

  it('Multiple stacked modal outside scroll example should match production', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'multiple',
      global.__BASEURL__,
    );

    const { page } = global;
    await loadPage(page, url);
    await page.setViewport(defaultOptions.viewport);

    await page.waitForSelector(scrollOutsideSelector);
    await page.click(scrollOutsideSelector);

    await page.click(largeModalBtn);
    await page.waitForSelector(modalDialog);

    await page.waitForTimeout(1000);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();

    //open second stacked modal
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    const image2 = await page.screenshot();
    expect(image2).toMatchProdImageSnapshot();

    //open third stacked modal
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    const image3 = await page.screenshot();
    expect(image3).toMatchProdImageSnapshot();
  });

  it('Autofocus on first button should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'autofocus',
      global.__BASEURL__,
    );

    const page = await openModal(url, {
      ...defaultOptions,
      triggerSelector: booleanBtn,
    });

    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Autofocus on first input should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'autofocus',
      global.__BASEURL__,
    );

    const page = await openModal(url, {
      ...defaultOptions,
      triggerSelector: autoFocusBtn,
    });

    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Warning modal appearance should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'appearance',
      global.__BASEURL__,
    );

    const page = await openModal(url, {
      ...defaultOptions,
      triggerSelector: warningModalBtn,
    });

    const header = await takeElementScreenShot(page, modalHeader);
    expect(header).toMatchProdImageSnapshot();

    const footer = await takeElementScreenShot(page, modalFooter);
    expect(footer).toMatchProdImageSnapshot();
  });

  it('Danger modal appearance should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'appearance',
      global.__BASEURL__,
    );

    const page = await openModal(url, {
      ...defaultOptions,
      triggerSelector: dangerModalBtn,
    });

    const header = await takeElementScreenShot(page, modalHeader);
    expect(header).toMatchProdImageSnapshot();

    const footer = await takeElementScreenShot(page, modalFooter);
    expect(footer).toMatchProdImageSnapshot();
  });

  it('Modal on mobile should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'scroll',
      global.__BASEURL__,
    );

    const page = await openModal(url, {
      ...defaultOptions,
      viewport: {
        width: 479,
        height: 800,
      },
    });

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('Scrollable modal without header/footer should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'scroll',
      global.__BASEURL__,
    );
    const { page } = global;
    await loadPage(page, url);
    await page.setViewport(defaultOptions.viewport);

    await page.waitForSelector(visibilitySelector);
    await page.click(visibilitySelector);

    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);

    // Traps the focus on the modal
    await page.keyboard.press('Tab');

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('Modal with truncated long heading should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'multi-line-headings',
      global.__BASEURL__,
    );

    const page = await openModal(url, defaultOptions);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });

  it('Modal with multi-line heading should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'multi-line-headings',
      global.__BASEURL__,
    );

    const page = await openModal(url, defaultOptions);
    await page.waitForSelector(multilineSelector);
    await page.click(multilineSelector);

    const image = await takeElementScreenShot(page, 'body');
    expect(image).toMatchProdImageSnapshot();
  });
});
