import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { goToFullPage } from '@atlaskit/editor-test-helpers/testing-example-page';
import { MediaMockControlsBackdoor } from '@atlaskit/media-test-helpers';
import { MediaViewerPageObject } from '@atlaskit/media-integration-test-helpers';
type ClientType = Parameters<typeof goToFullPage>[0];

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag image, verify, wait, publish, check',
  {},
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

    await page.publish();

    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    const fileCardView = await page.$('[data-testid="media-file-card-view"]');
    await fileCardView.waitForClickable();
    await fileCardView.click();

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
