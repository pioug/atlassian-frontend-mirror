import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const openModalBtn = "[type='button']";
const modalDialog = "[role='dialog']";
const modalFooter = `${modalDialog}>div>footer`;
const modalHeader = `${modalDialog}>div>header`;
const dialogBody = "[data-testid='dialog-body']";
const scrollBehaviorGroup = "[role='group']";
const modalBodyPara =
  "[data-testid='modal-dialog-content']>div>div>p:nth-child(6)";
const scrollToBottomBtn = "[data-testid='scrollDown']";
const largeModalBtn = "[data-testid='large']";
const booleanBtn = "[data-testid='booleanBtn']";
const autoFocusBtn = "[data-testid='autoFocusBtn']";
const warningModalBtn = "[data-testid='warning']";
const dangerModalBtn = "[data-testid='danger']";

describe('Snapshot Test', () => {
  it('Basic example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'defaultModal',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  //
  it('User can use appearance to override button sequence as a walk-around', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'appearance-override',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Basic example with primary button on right should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'defaultModal',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Scroll behaviour inside should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'scroll',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    await page.waitFor(1000);

    // When scroll is at the top only bottom overflow indicator shows.
    const scrollToTop = await takeElementScreenShot(page, 'body');
    expect(scrollToTop).toMatchProdImageSnapshot();

    // When scroll is in the middle both overflow indicator shows.
    await page.mainFrame().tap(modalBodyPara);
    await page.keyboard.press('ArrowDown');
    await page.waitFor(1000);
    const scrollToMiddle = await takeElementScreenShot(page, 'body');
    expect(scrollToMiddle).toMatchProdImageSnapshot();

    // When scroll is at the bottom only top overflow indicator shows.
    await page.click(scrollToBottomBtn);
    await page.waitFor(1000);
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
    await page.waitForSelector(openModalBtn);
    const radioSelector = scrollBehaviorGroup + ' input[value="outside"]';
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
    await page.waitForSelector(openModalBtn);
    const radioSelector = scrollBehaviorGroup + ' input[value="inside-wide"]';
    await page.waitForSelector(radioSelector);
    // Clicking the inside-wide radio button sets the body to 3000px
    // which causes a page reflow. Rather than using an arbitrary wait
    // time to let the content shifting settle, we resize the viewport
    // to the same size before clicking it to lessen the effect.
    await page.setViewport({ width: 3000, height: 600 });
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
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(dialogBody);

    await page.click(dialogBody);
    const dropdownMenu = '.css-26l3qy-menu.react-select__menu';
    // We need to wait for the animation to finish.
    await page.waitFor(1000);
    const image = await takeElementScreenShot(page, dropdownMenu);
    expect(image).toMatchProdImageSnapshot();
  });

  it('Example with focus on secondary button should match production', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'with-focus-on-secondary-button',
      global.__BASEURL__,
    );
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    await page.waitFor(1000);
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
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    // Focus should be on first text input of form when modal opens
    await page.waitFor(1000);
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
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(largeModalBtn);
    await page.click(largeModalBtn);
    await page.waitForSelector(modalDialog);
    await page.waitFor(1000);
    const image = await page.screenshot();
    expect(image).toMatchProdImageSnapshot();
    //open second stacked modal
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitFor(1000);
    const image2 = await page.screenshot();
    expect(image2).toMatchProdImageSnapshot();
    //open third stacked modal
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitFor(1000);
    const image3 = await page.screenshot();
    expect(image3).toMatchProdImageSnapshot();
  });

  it('Autofocus example should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'autofocus',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(booleanBtn);
    await page.click(booleanBtn);
    await page.waitForSelector(modalDialog);
    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
    await loadPage(page, url);
    await page.waitForSelector(autoFocusBtn);
    await page.click(autoFocusBtn);
    await page.waitForSelector(modalDialog);
    const image2 = await takeElementScreenShot(page, modalDialog);
    expect(image2).toMatchProdImageSnapshot();
  });

  it('Warning and Danger modal appearances should match production example', async () => {
    const url = getExampleUrl(
      'design-system',
      'modal-dialog',
      'appearance',
      global.__BASEURL__,
    );
    const { page } = global;

    await loadPage(page, url);
    await page.waitForSelector(warningModalBtn);
    await page.click(warningModalBtn);
    await page.waitForSelector(modalDialog);
    const image1 = await takeElementScreenShot(page, modalFooter);
    expect(image1).toMatchProdImageSnapshot();
    const image2 = await takeElementScreenShot(page, modalHeader);
    expect(image2).toMatchProdImageSnapshot();
    await loadPage(page, url);
    await page.waitForSelector(dangerModalBtn);
    await page.click(dangerModalBtn);
    await page.waitForSelector(modalDialog);
    const image3 = await takeElementScreenShot(page, modalFooter);
    expect(image3).toMatchProdImageSnapshot();
    const image4 = await takeElementScreenShot(page, modalHeader);
    expect(image4).toMatchProdImageSnapshot();
  });
});
