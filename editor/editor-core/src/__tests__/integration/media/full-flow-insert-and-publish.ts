import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToFullPage,
  goToFullPageClickToEdit,
} from '../../__helpers/testing-example-helpers';
import * as path from 'path';
import { MediaMockControlsBackdoor } from '@atlaskit/media-test-helpers';
import { sleep } from '@atlaskit/editor-test-helpers';
import { MediaViewerPageObject } from '@atlaskit/media-integration-test-helpers';
import { FullPageEditor } from '../../__helpers/page-objects/_media';
import { insertMention, lozenge } from '../_helpers';
import { selectors } from '../../__helpers/page-objects/_editor';
type ClientType = Parameters<typeof goToFullPage>[0];

const imageFileName = 'popup.jpg';
const videoFileName = 'example.mp4';
const textFileName = 'hello.txt';

const uploadFile = async (page: FullPageEditor, fileName: string) => {
  const localPath = path.join(__dirname, '_resources_', fileName);
  await page.mediaPicker.uploadFile(localPath);
};

async function openAndGetMediaViewer(client: WebdriverIO.BrowserObject) {
  const mediaViewer = new MediaViewerPageObject(client);
  await mediaViewer.init();
  return mediaViewer;
}

async function assertCardCompleteStatus(page: FullPageEditor) {
  expect(
    await page.isVisible(
      '[data-testid="media-file-card-view"][data-test-status="complete"]',
    ),
  ).toBe(true);
}

async function assertImageDetailsInMediaViewer(
  mediaViewer: MediaViewerPageObject,
) {
  expect(await mediaViewer.getCurrentMediaDetails()).toEqual({
    icon: 'image',
    name: imageFileName,
    size: '9 KB',
    type: 'image',
  });
}

async function assertSingleMediaGroupItem(
  page: FullPageEditor,
  client: ClientType,
) {
  expect(
    await page.isVisible(
      '[data-testid="media-filmstrip"] [data-testid="media-file-card-view"][data-test-status="complete"]',
    ),
  ).toBe(true);

  await page.publish();

  expect(
    await page.isVisible('.MediaGroup [data-testid="media-file-card-view"]'),
  ).toBe(true);

  await page.click('.MediaGroup [data-testid="media-file-card-view"]');

  const mediaViewer = new MediaViewerPageObject(client);
  await mediaViewer.init();
  expect(await mediaViewer.getCurrentMediaDetails()).toEqual({
    icon: 'doc',
    name: textFileName,
    size: '12 B',
    type: 'document',
  });
}

async function assertCardByFileName(page: FullPageEditor, fileName: string) {
  expect(
    await page.isVisible(
      `[data-testid="media-file-card-view"][data-test-media-name="${fileName}"]`,
    ),
  ).toBe(true);
}

async function clickCardByFileName(page: FullPageEditor, fileName: string) {
  await page.click(
    `[data-testid="media-file-card-view"][data-test-media-name="${fileName}"]`,
  );
}

async function clickCustomMediaPlayerPlayPauseButton(page: FullPageEditor) {
  await page.click(
    '[data-testid="custom-media-player"] [data-testid="custom-media-player-play-toggle-button"]',
  );
}

async function assertCustomMediaPlayerIsPaused(page: FullPageEditor) {
  expect(
    await page.isVisible(
      `[data-testid="custom-media-player"] [data-test-is-playing="false"]`,
    ),
  );
}
async function assertCustomMediaPlayerIsPlaying(page: FullPageEditor) {
  expect(
    await page.isVisible(
      `[data-testid="custom-media-player"] [data-test-is-playing="true"]`,
    ),
  );
}

// Skipping safari because of ongoing issue (comms via email with support with Browserstack atm)
// Skipping IE because editor doesn't load properly and media button is not activated on time.
// Skipping Edge because sometimes it fails due to "The uploadFile command is not available in msedge". (comms via email with support with Browserstack atm)
const skipVersions: Parameters<typeof BrowserTestCase>[1] = {
  skip: ['safari', 'edge'],
};

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Upload image, wait, Insert, publish, check',
  skipVersions,
  async (client: ClientType) => {
    const page = await goToFullPage(client);
    await page.clearEditor();

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await uploadFile(page, imageFileName);

    // This will wait for file to upload (this will happened very fast, but it doesn't matter
    const uploadCard = await page.mediaPicker.getFilteredRecentUploadCards({
      status: 'complete',
      filename: imageFileName,
    });

    //Checking to make sure that only one file matches filter
    expect(uploadCard.length).toBe(1);
    expect(uploadCard[0].meta.status).toBe('complete');

    await page.mediaPicker.clickInsertButton();

    await assertCardCompleteStatus(page);

    await page.publish();

    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    await page.click('[data-testid="media-file-card-view"]');

    const mediaViewer = await openAndGetMediaViewer(client);

    await assertImageDetailsInMediaViewer(mediaViewer);

    await mediaViewer.closeMediaViewer(true);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Upload text, wait, Insert, publish, check',
  skipVersions,
  async (client: ClientType) => {
    const page = await goToFullPage(client);
    await page.clearEditor();

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await uploadFile(page, textFileName);

    // This will wait for file to upload (this will happened very fast, but it doesn't matter
    const uploadCard = await page.mediaPicker.getFilteredRecentUploadCards({
      status: 'complete',
      filename: textFileName,
    });

    //Checking to make sure that only one file matches filter
    expect(uploadCard.length).toBe(1);
    expect(uploadCard[0].meta.status).toBe('complete');

    await page.mediaPicker.clickInsertButton();

    await assertSingleMediaGroupItem(page, client);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Pick from recent, Insert, publish, check',
  skipVersions,
  async (client: ClientType) => {
    const page = await goToFullPage(client);
    await page.clearEditor();

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await uploadFile(page, imageFileName);
    // This will wait for file to upload (this will happened very fast, but it doesn't matter)
    await page.mediaPicker.getFilteredRecentUploadCards({
      status: 'complete',
      filename: imageFileName,
    });

    await page.mediaPicker.clickCancelButton();

    // Opening picker again
    await page.openMediaPicker();
    // This will wait for /items to load and filecard to show up
    const uploadCard = await page.mediaPicker.getFilteredRecentUploadCards({
      status: 'complete',
      filename: imageFileName,
    });

    //Checking to make sure that only one file matches filter
    expect(uploadCard.length).toBe(1);
    expect(uploadCard[0].meta.status).toBe('complete');

    await page.mediaPicker.selectCards({ status: 'complete' });

    await page.mediaPicker.clickInsertButton();

    await assertCardCompleteStatus(page);

    await page.publish();

    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    await page.click('[data-testid="media-file-card-view"]');

    const mediaViewer = await openAndGetMediaViewer(client);

    await assertImageDetailsInMediaViewer(mediaViewer);

    await mediaViewer.closeMediaViewer(true);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Upload, Insert immediately, publish, check',
  skipVersions,
  async (client: ClientType) => {
    const page = await goToFullPage(client);

    await page.clearEditor();

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).shouldWaitUpload = true;
    });

    await uploadFile(page, imageFileName);

    // This will wait for file to upload (this will happened very fast, but it doesn't matter
    const uploadCards = await page.mediaPicker.getFilteredRecentUploadCards({
      status: 'uploading',
      filename: imageFileName,
    });

    //Checking to make sure that only one file matches filter
    expect(uploadCards.length).toBe(1);
    expect(uploadCards[0].meta.status).toBe('uploading');

    await page.mediaPicker.clickInsertButton();

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).shouldWaitUpload = false;
    });

    await assertCardCompleteStatus(page);

    await page.publish();

    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    await page.click('[data-testid="media-file-card-view"]');

    const mediaViewer = await openAndGetMediaViewer(client);

    await assertImageDetailsInMediaViewer(mediaViewer);

    await mediaViewer.closeMediaViewer(true);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag folder that contains a folder (which has multiple images), verify, wait, check recents',
  skipVersions,
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

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(4);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag folder (contains an image), verify, wait, check recents',
  skipVersions,
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

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(1);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag image, verify, wait, check recents',
  skipVersions,
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

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(1);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag image, verify, wait, publish, check',
  skipVersions,
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
  'full-flow-insert-and-publish.ts: Upload, wait, Insert, publish, Check video',
  skipVersions,
  async (client: ClientType) => {
    const page = await goToFullPage(client);

    await page.clearEditor();

    // TODO This is workaround around https://product-fabric.atlassian.net/browse/EDM-484 issue
    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).resetMediaMock(
        { isSlowServer: true },
      );
    });

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await uploadFile(page, videoFileName);

    await page.mediaPicker.getFilteredRecentUploadCards({
      status: 'complete',
      filename: videoFileName,
    });

    await page.mediaPicker.clickInsertButton();

    await assertCardCompleteStatus(page);

    await page.publish();

    expect(await page.isVisible('[data-testid="media-card-view"]')).toBe(true);

    await clickCardByFileName(page, videoFileName);

    await assertCustomMediaPlayerIsPlaying(page);
    await clickCustomMediaPlayerPlayPauseButton(page);
    await assertCustomMediaPlayerIsPaused(page);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Upload, image and video, wait, insert, publish, check',
  skipVersions,
  async (client: ClientType) => {
    const page = await goToFullPage(client);
    await page.clearEditor();

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await uploadFile(page, imageFileName);
    await uploadFile(page, videoFileName);

    // This will wait for file to upload (this will happened very fast, but it doesn't matter
    const uploadImageCard = await page.mediaPicker.getFilteredRecentUploadCards(
      {
        status: 'complete',
        filename: imageFileName,
      },
    );
    //Checking to make sure that only one file matches filter
    expect(uploadImageCard.length).toBe(1);
    expect(uploadImageCard[0].meta.status).toBe('complete');

    const uploadVideoCard = await page.mediaPicker.getFilteredRecentUploadCards(
      {
        status: 'complete',
        filename: videoFileName,
      },
    );
    //Checking to make sure that only one file matches filter
    expect(uploadVideoCard.length).toBe(1);
    expect(uploadVideoCard[0].meta.status).toBe('complete');

    await page.mediaPicker.clickInsertButton();

    await assertCardByFileName(page, imageFileName);
    await assertCardByFileName(page, videoFileName);

    await page.publish();

    await assertCardByFileName(page, imageFileName);
    await assertCardByFileName(page, videoFileName);

    await clickCardByFileName(page, imageFileName);
    const mediaViewer = await openAndGetMediaViewer(client);
    await assertImageDetailsInMediaViewer(mediaViewer);

    // Navigate to video file
    await mediaViewer.navigateNext();

    // Verify video player works in media viewer
    await assertCustomMediaPlayerIsPaused(page);
    await clickCustomMediaPlayerPlayPauseButton(page);
    await assertCustomMediaPlayerIsPlaying(page);
    await clickCustomMediaPlayerPlayPauseButton(page);
    await assertCustomMediaPlayerIsPaused(page);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Click paragraph, ensure editor loads',
  skipVersions,
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
  'full-flow-insert-and-publish.ts: Upload, Insert immediately, publish, check, click paragraph',
  skipVersions,
  async (client: ClientType) => {
    const page = await goToFullPageClickToEdit(client);

    await page.clearEditor();
    await page.type(selectors.editor, 'Hello');
    await page.keys('Enter');

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).shouldWaitUpload = true;
    });

    await uploadFile(page, imageFileName);

    // This will wait for file to upload (this will happened very fast, but it doesn't matter
    const uploadCards = await page.mediaPicker.getFilteredRecentUploadCards({
      status: 'uploading',
      filename: imageFileName,
    });

    //Checking to make sure that only one file matches filter
    expect(uploadCards.length).toBe(1);
    expect(uploadCards[0].meta.status).toBe('uploading');

    await page.mediaPicker.clickInsertButton();

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).shouldWaitUpload = false;
    });

    await assertCardCompleteStatus(page);

    await page.publish();

    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    await page.click('[data-testid="media-file-card-view"]');

    const mediaViewer = await openAndGetMediaViewer(client);

    await assertImageDetailsInMediaViewer(mediaViewer);

    await mediaViewer.closeMediaViewer(true);

    await page.click('p');

    await page.waitForSelector('.ProseMirror', { timeout: 10000 });
    expect(await page.isVisible('.ProseMirror')).toBe(true);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Upload, Insert immediately, publish, check, click mention',
  skipVersions,
  async (client: ClientType) => {
    const page = await goToFullPageClickToEdit(client);

    await page.clearEditor();
    await insertMention(page, 'Carolyn');
    await page.waitForSelector(lozenge);
    await page.keys('Enter');

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).shouldWaitUpload = true;
    });

    await uploadFile(page, imageFileName);

    // This will wait for file to upload (this will happened very fast, but it doesn't matter
    const uploadCards = await page.mediaPicker.getFilteredRecentUploadCards({
      status: 'uploading',
      filename: imageFileName,
    });

    //Checking to make sure that only one file matches filter
    expect(uploadCards.length).toBe(1);
    expect(uploadCards[0].meta.status).toBe('uploading');

    await page.mediaPicker.clickInsertButton();

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).shouldWaitUpload = false;
    });

    await assertCardCompleteStatus(page);

    await page.publish();

    expect(await page.isVisible('[data-testid="media-file-card-view"]')).toBe(
      true,
    );

    await page.click('[data-testid="media-file-card-view"]');

    const mediaViewer = await openAndGetMediaViewer(client);

    await assertImageDetailsInMediaViewer(mediaViewer);

    await mediaViewer.closeMediaViewer(true);

    await page.click('[data-mention-id]');

    // Wait for the renderer to possibly transition to the editor.
    // There is currently no way around waiting a number of seconds, as we are waiting for something
    // *not* to happen. A waitForVisible still requires an arbitrary timeout, and extra complexity
    // of passing the test when it times out.
    await sleep(5000);

    // Check the editor does not load
    expect(await page.isExisting('.ProseMirror')).toBe(false);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag image, verify, wait, publish, close media viewer and make sure editor not opened',
  skipVersions,
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
