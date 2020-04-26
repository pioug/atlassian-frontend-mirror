import {
  disableAllTransitions,
  getExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

describe.skip('<ResizeControl />', () => {
  it('should match the resize control snapshot when left sidebar is collapsed', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'resize-sidebar',
      global.__BASEURL__,
    );
    const { page } = global;
    const resizeControl = "[data-testid='left-sidebar-resize-button']";
    const content = "[data-testid='content']";

    disableAllTransitions(page);
    await page.goto(url);
    await global.page.hover(resizeControl);
    await global.page.click(resizeControl);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the resize control snapshot when left sidebar is collapsed and resize button is hovered', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'resize-sidebar',
      global.__BASEURL__,
    );
    const { page } = global;
    const resizeControl = "[data-testid='left-sidebar-resize-button']";
    const content = "[data-testid='content']";

    await page.goto(url);
    await global.page.hover(resizeControl);
    await page.waitFor(1000);
    await global.page.click(resizeControl);
    await page.waitFor(1000);
    await global.page.hover(resizeControl);
    await page.waitFor(1000);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the resize control snapshot when left sidebar is expanded and grab area is hovered', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'resize-sidebar',
      global.__BASEURL__,
    );
    const { page } = global;
    const content = "[data-testid='content']";
    const grabArea = "[data-testid='left-sidebar-grab-area']";

    await page.goto(url);
    await global.page.hover(grabArea);
    await page.waitFor(1000);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the resize control snapshot when left sidebar is collapsed and flyout is shown by hovering the sidebar', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'resize-sidebar',
      global.__BASEURL__,
    );
    const { page } = global;
    const resizeControl = "[data-testid='left-sidebar-resize-button']";
    const content = "[data-testid='content']";
    const leftSidebar = "[data-testid='left-sidebar']";

    await page.goto(url);
    await global.page.hover(resizeControl);
    await page.waitFor(1000);
    await global.page.click(resizeControl);
    await page.waitFor(1000);
    await global.page.hover(leftSidebar);
    await page.waitFor(1000);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the resize control snapshot when left sidebar is collapsed and flyout is shown by hovering the grab area', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'resize-sidebar',
      global.__BASEURL__,
    );
    const { page } = global;
    const resizeControl = "[data-testid='left-sidebar-resize-button']";
    const content = "[data-testid='content']";
    const grabArea = "[data-testid='left-sidebar-grab-area']";

    await page.goto(url);
    await global.page.hover(resizeControl);
    await page.waitFor(1000);
    await global.page.click(resizeControl);
    await page.waitFor(1000);
    await global.page.hover(grabArea);
    await page.waitFor(1000);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the resize control snapshot when left sidebar is expanded and left sidebar is hovered', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'resize-sidebar',
      global.__BASEURL__,
    );
    const { page } = global;
    const content = "[data-testid='content']";
    const leftSidebar = "[data-testid='left-sidebar']";
    await page.goto(url);
    await global.page.hover(leftSidebar);
    await page.waitFor(1000);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the resize control inner shadow snapshot when drag on grab area begins', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'resize-sidebar',
      global.__BASEURL__,
    );
    const { page } = global;
    const content = "[data-testid='content']";
    const grabArea = "[data-testid='left-sidebar-grab-area']";

    await page.goto(url);
    await page.waitForSelector(grabArea);

    const grabAreaElement = await page.$(grabArea);

    const screenshotBefore = await takeElementScreenShot(global.page, content);
    expect(screenshotBefore).toMatchProdImageSnapshot();

    const { x, y } = await grabAreaElement.boundingBox();
    page.mouse.move(x + 2, y + 10);
    page.mouse.down();
    await page.waitFor(1000);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the resize control snapshot when left sidebar is expanded and resized', async () => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      'resize-sidebar',
      global.__BASEURL__,
    );
    const { page } = global;
    const content = "[data-testid='content']";
    const grabArea = "[data-testid='left-sidebar-grab-area']";

    await page.goto(url);
    await page.waitForSelector(grabArea);

    const screenshotBefore = await takeElementScreenShot(global.page, content);
    expect(screenshotBefore).toMatchProdImageSnapshot();

    const grabAreaElement = await page.$(grabArea);

    const { x, y } = await grabAreaElement.boundingBox();
    page.mouse.move(x + 2, y + 10);
    page.mouse.down();
    page.mouse.move(x + 200, y + 10);
    await page.waitFor(1000);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });
});
