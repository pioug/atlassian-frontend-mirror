import {
  getExampleUrl,
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('<LeftSidebar />', () => {
  const controlSidebar = async (sidebarState: 'expand' | 'collapse') => {
    const resizeControl = "[data-resize-button='true']";
    const { page } = global;

    const isSidebarExpanded =
      (await page.$eval<string | null>(resizeControl, (el) =>
        el.getAttribute('aria-expanded'),
      )) === 'true';

    if (
      (sidebarState === 'expand' && isSidebarExpanded) ||
      (sidebarState === 'collapse' && !isSidebarExpanded)
    ) {
      return;
    }

    await page.hover(resizeControl);
    await page.waitForTimeout(300);
    await page.click(resizeControl);
    await page.waitForTimeout(500);
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
    await loadPage(page, url);
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.setViewport(screenSize);
    await page.waitForSelector(selector);
  };

  it('should match the snapshot when it is expanded and resize button is hovered', async () => {
    const { page } = global;
    const resizeControl = "[data-testid='left-sidebar-resize-button']";
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('resize-sidebar', content);
    await controlSidebar('expand');

    await page.hover(resizeControl);
    await page.waitForTimeout(1000);

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
    await page.waitForTimeout(500);

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
    await page.waitForTimeout(500);

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
    if (grabAreaElement) {
      const box = await grabAreaElement.boundingBox();
      if (box) {
        const { x, y } = box;
        await page.mouse.move(x + 2, y + 10);
        await page.mouse.down();
      }
    }

    await page.waitForTimeout(300);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should clip off the left-sidebar content on resizing towards left', async () => {
    const { page } = global;
    const grabArea = "[data-testid='left-sidebar-grab-area']";
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('resize-sidebar', content);

    const grabAreaElement = await page.$(grabArea);
    if (grabAreaElement) {
      const box = await grabAreaElement.boundingBox();
      if (box) {
        const { x, y } = box;
        page.mouse.move(x, y);
        page.mouse.down();
        page.mouse.move(x - 325, y);
      }
    }

    await page.waitForTimeout(300);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the snapshot when it is collapsed', async () => {
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('controlled-left-sidebar', content);
    await controlSidebar('collapse');

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the snapshot to show contents are hidden on collapse', async () => {
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('controlled-left-sidebar', content);

    const screenshot = await takeElementScreenShot(global.page, content);
    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the snapshot to show scroll content of left sidebar', async () => {
    const { page } = global;
    const scrollableContent =
      "[data-testid='left-sidebar'] [data-toggle-scrollable]";
    const content = "[data-testid='content']";
    const leftSidbar = "[data-testid='left-sidebar']>div>div";
    await openExamplesAndWaitFor('resize-sidebar', content);
    await controlSidebar('expand');

    await page.click(scrollableContent);

    await page.evaluate((selector: any) => {
      return document.querySelector(selector).scrollBy(0, 100);
    }, leftSidbar);

    const screenshot = await takeElementScreenShot(global.page, content);
    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the snapshot before and after closing flyout by moving mouse out of the left-sidebar', async () => {
    const { page } = global;
    const content = "[data-testid='content']";
    const grabArea = "[data-testid='leftSidebar-grab-area']";
    await openExamplesAndWaitFor('controlled-left-sidebar', content);

    // open flyout
    const grabAreaElement = await page.$(grabArea);
    const boundingBox = await grabAreaElement!.boundingBox();
    if (!boundingBox) {
      throw new Error('Could not find bounding box');
    }
    const { x, y } = boundingBox;
    await page.mouse.move(x + 1, y + 200);
    await page.waitForTimeout(500);

    const screenshot1 = await takeElementScreenShot(global.page, content);
    expect(screenshot1).toMatchProdImageSnapshot();

    // close flyout by moving the mouse outside the left-sidbar
    page.mouse.move(400, 200);
    await page.waitForTimeout(300);

    const screenshot2 = await takeElementScreenShot(global.page, content);
    expect(screenshot2).toMatchProdImageSnapshot();
  });

  it('should match the snapshot of left sidebar content height 100%', async () => {
    const { page } = global;
    const content = "[data-testid='content']";
    const leftSidebar = "[data-testid='side-navigation']";
    await openExamplesAndWaitFor('integration-example', content);
    await controlSidebar('expand');
    await page.hover(leftSidebar);
    const screenshot = await takeElementScreenShot(global.page, content);
    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the snapshot when it is collapsed and resize button is hovered', async () => {
    const { page } = global;
    const resizeControl = "[data-testid='leftSidebar-resize-button']";
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('controlled-left-sidebar', content);

    await page.hover(resizeControl);
    await page.waitForTimeout(1000);

    const screenshot = await takeElementScreenShot(global.page, content);

    expect(screenshot).toMatchProdImageSnapshot();
  });

  it('should match the snapshot when it is collapsed and grab area is hovered', async () => {
    const { page } = global;
    const grabArea = "[data-testid='leftSidebar-grab-area']";
    const content = "[data-testid='content']";

    await openExamplesAndWaitFor('controlled-left-sidebar', content);

    await page.hover(grabArea);
    await page.waitForTimeout(500);

    const screenshotWithFlyout = await takeElementScreenShot(
      global.page,
      content,
    );
    expect(screenshotWithFlyout).toMatchProdImageSnapshot();
  });
});
