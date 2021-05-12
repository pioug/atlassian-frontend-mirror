import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToFullPage,
  goToFullPageClickToEdit,
} from '../../__helpers/testing-example-helpers';
import { MediaMockControlsBackdoor } from '@atlaskit/media-test-helpers';
import { sleep } from '@atlaskit/editor-test-helpers/sleep';
import { MediaViewerPageObject } from '@atlaskit/media-integration-test-helpers';
import { selectors } from '../../__helpers/page-objects/_editor';
type ClientType = Parameters<typeof goToFullPage>[0];

// Skipping safari because of ongoing issue (comms via email with support with Browserstack atm)
// Skipping IE because editor doesn't load properly and media button is not activated on time.
// Skipping Edge because sometimes it fails due to "The uploadFile command is not available in msedge". (comms via email with support with Browserstack atm)

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag folder that contains a folder (which has multiple images), verify, wait',
  {
    skip: ['safari', 'edge'],
  },
  async (client: ClientType) => {
    const page = await goToFullPage(client);

    await page.execute(() => {
      localStorage['folderUploads'] = true;
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).uploadFolderContainingFolderFromDrag();
    });

    expect(
      await page.isVisible(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      ),
    ).toBe(true);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag folder (contains an image), verify, wait',
  {
    skip: ['safari', 'edge'],
  },
  async (client: ClientType) => {
    const page = await goToFullPage(client);

    await page.execute(() => {
      localStorage['folderUploads'] = true;
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).uploadFolderFromDrag();
    });

    expect(
      await page.isVisible(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      ),
    ).toBe(true);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag image, verify, wait',
  {
    skip: ['safari', 'edge'],
  },
  async (client: ClientType) => {
    const page = await goToFullPage(client);

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).uploadImageFromDrag();
    });

    expect(
      await page.isVisible(
        '[data-testid="media-file-card-view"][data-test-status="complete"]',
      ),
    ).toBe(true);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag image, verify, wait, publish, check',
  {
    skip: ['safari', 'edge'],
  },
  async (client: ClientType) => {
    const page = await goToFullPage(client);

    await page.clearEditor();

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).uploadImageFromDrag();
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

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Click paragraph, ensure editor loads',
  {
    skip: ['safari', 'edge'],
  },
  async (client: ClientType) => {
    const page = await goToFullPageClickToEdit(client);

    await page.clearEditor();
    await page.type(selectors.editor, 'Hello');
    await page.keys('Enter');

    await page.click('p');

    await page.waitForSelector('div.ak-editor-content-area', {
      timeout: 10000,
    });

    const editorExists: boolean = await page.isExisting(
      'div.ak-editor-content-area',
    );
    const rendererExists: boolean = await page.isExisting(
      'div.ak-renderer-document',
    );

    const editorVisible: boolean = await page.isVisible(
      'div.ak-editor-content-area',
    );
    expect(editorExists).toBe(true);
    expect(editorVisible).toBe(true);
    expect(rendererExists).toBe(false);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag image, verify, wait, publish, close media viewer and make sure editor not opened',
  {
    skip: ['safari', 'edge'],
  },
  async (client: ClientType) => {
    const page = await goToFullPageClickToEdit(client);

    await page.clearEditor();

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).uploadImageFromDrag();
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

    // Close viewer by clicking button
    await mediaViewer.closeMediaViewer(false);

    // Wait for the renderer to possibly transition to the editor.
    // There is currently no way around waiting a number of seconds, as we are waiting for something
    // *not* to happen. A waitForVisible still requires an arbitrary timeout, and extra complexity
    // of passing the test when it times out.
    await sleep(5000);

    // Check the editor does not load
    expect(await page.isExisting('.ProseMirror')).toBe(false);
  },
);
