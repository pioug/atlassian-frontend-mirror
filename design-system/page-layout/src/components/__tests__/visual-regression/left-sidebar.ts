import {
  getExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

declare var global: any;

describe.skip('<LeftSidebar />', () => {
  const controlSidebar = async (sidebarState: 'expand' | 'collapse') => {
    const resizeControl = "[data-testid='left-sidebar-resize-button']";
    const { page } = global;

    const isSidebarExpanded =
      (await page.$eval(resizeControl, (el: HTMLButtonElement) =>
        el.getAttribute('aria-expanded'),
      )) === 'true';

    if (
      (sidebarState === 'expand' && isSidebarExpanded) ||
      (sidebarState === 'collapse' && !isSidebarExpanded)
    ) {
      return;
    }

    await page.hover(resizeControl);
    await page.waitFor(300);
    await page.click(resizeControl);
    await page.waitFor(500);
  };

  const openExamplesAndWaitFor = async (
    example: string,
    selector: string,
    screenSize: { width: number; height: number } = {
      width: 1920,
      height: 800,
    },
  ) => {
    const url = getExampleUrl(
      'design-system',
      'page-layout',
      example,
      global.__BASEURL__,
    );

    const { page } = global;
    await page.goto(url);
    await global.page.evaluate(() => {
      localStorage.clear();
    });
    await page.setViewport(screenSize);
    await page.waitForSelector(selector);
  };

  it.skip('should match the snapshot when it is expanded and resize button is hovered', async () => {
    const { page } = global;
    const resizeControl = "[data-testid='left-sidebar-resize-button']";
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('resize-sidebar', content);
    await controlSidebar('expand');

    await page.hover(resizeControl);
    await page.waitFor(1000);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the snapshot when it is expanded and grab area is hovered', async () => {
    const { page } = global;
    const grabArea = "[data-testid='left-sidebar-grab-area']";
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('resize-sidebar', content);
    await controlSidebar('expand');

    await page.hover(grabArea);
    await page.waitFor(500);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the snapshot when it is expanded and left sidebar is hovered', async () => {
    const { page } = global;
    const leftSidebar = "[data-testid='left-sidebar']";
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('resize-sidebar', content);
    await controlSidebar('expand');

    await page.hover(leftSidebar);
    await page.waitFor(500);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the resize control inner shadow snapshot when drag on grab area begins', async () => {
    const { page } = global;
    const grabArea = "[data-testid='left-sidebar-grab-area']";
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('resize-sidebar', content);
    await controlSidebar('expand');

    const grabAreaElement = await page.$(grabArea);
    const { x, y } = await grabAreaElement.boundingBox();
    page.mouse.move(x + 2, y + 10);
    page.mouse.down();
    await page.waitFor(300);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the snapshot when it is collapsed', async () => {
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('resize-sidebar', content);
    await controlSidebar('collapse');

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the snapshot to show contents are hidden on collapse', async () => {
    const { page } = global;
    const scrollableContent =
      "[data-testid='left-sidebar'] [data-toggle-scrollable]";
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('resize-sidebar', content);
    await controlSidebar('expand');

    await page.click(scrollableContent);

    await controlSidebar('collapse');

    const screenshot = await takeElementScreenShot(global.page, content);
    expect(screenshot).toMatchProdImageSnapshot();
  });

  it.skip('should match the snapshot when it is collapsed and resize button is hovered', async () => {
    const { page } = global;
    const resizeControl = "[data-testid='left-sidebar-resize-button']";
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('resize-sidebar', content);
    await controlSidebar('collapse');

    await page.hover(resizeControl);
    await page.waitFor(1000);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the snapshot when it is collapsed and grab area is hovered', async () => {
    const { page } = global;
    const grabArea = "[data-testid='left-sidebar-grab-area']";
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('resize-sidebar', content);
    await controlSidebar('collapse');

    await page.hover(grabArea);
    await page.waitFor(500);

    const screenshotWithFlyout = await takeElementScreenShot(
      global.page,
      content,
    );
    expect(screenshotWithFlyout).toMatchProdImageSnapshot();
  });
});
