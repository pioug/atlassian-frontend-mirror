import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { goToFullPage } from '@atlaskit/editor-test-helpers/testing-example-page';
import { MediaMockControlsBackdoor } from '@atlaskit/media-test-helpers';
import { MediaViewerPageObject } from '@atlaskit/media-integration-test-helpers';
type ClientType = Parameters<typeof goToFullPage>[0];

// FIXME: This test was automatically skipped due to failure on 25/01/2023: https://product-fabric.atlassian.net/browse/ED-16654
BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag image, verify, wait, publish, check',
  {
    skip: ['*'],
  },
  async (client: ClientType) => {
    const page = await goToFullPage(client);

    await page.clearEditor();

    await page.execute(() => {
      (
        (window as any).mediaMockControlsBackdoor as MediaMockControlsBackdoor
      ).uploadImageFromDrag();
    });

    expect(
      await page.isVisible(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      ),
    ).toBe(true);

    // For some reason, clicking publish button right away sometimes does nothing.
    // TODO There is a chance it's related to the fact Editor is not releasing
    // it because it thinks things still are uploading.
    // https://product-fabric.atlassian.net/browse/ED-10756
    await page.pause(300);

    await page.publish();

    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    await page.pause(300); // When running against chromedriver directly it may fail without this pause because event handlers haven't been assigned yet
    await page.click('[data-testid="media-file-card-view"]');

    const mediaViewer = new MediaViewerPageObject(client);
    await mediaViewer.init();

    expect(await mediaViewer.getCurrentMediaDetails()).toEqual({
      icon: 'image',
      name: 'image.png',
      size: '158 B',
      type: 'image',
    });

    await mediaViewer.closeMediaViewer(true);
  },
);
