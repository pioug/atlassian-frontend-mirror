import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingExample,
  goToFullPage,
} from '../../__helpers/testing-example-helpers';
import * as path from 'path';
import { MediaMockControlsBackdoor } from '@atlaskit/media-test-helpers';
import { MediaViewerPageObject } from '@atlaskit/media-integration-test-helpers';
import { FullPageEditor } from '../../__helpers/page-objects/_media';

type ClientType = Parameters<typeof goToEditorTestingExample>[0];

const uploadImage = async (page: FullPageEditor) => {
  const filename = 'popup.png';
  const localPath = path.join(__dirname, '_resources_', filename);
  await page.mediaPicker.uploadFile(localPath);
};

async function assertSingleMediaItem(page: FullPageEditor, client: ClientType) {
  expect(
    await page.isVisible(
      '.media-single [data-testid="media-file-card-view"][data-test-status="complete"]',
    ),
  ).toBe(true);

  await page.publish();

  expect(await page.isVisible('.media-single')).toBe(true);

  await page.pause(300); // When running against chromedriver directly it may fail without this pause because event handlers haven't been assigned yet
  await page.click('.media-single');

  const mediaViewer = new MediaViewerPageObject(client);
  await mediaViewer.init();
  expect(await mediaViewer.getCurrentMediaDetails()).toEqual({
    icon: 'image',
    name: 'popup.png',
    size: '56 KB',
    type: 'image',
  });
}

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Upload, wait, Insert, publish, check',
  // Skipping safari because of ongoing issue (comms via email with support) with Browserstack atm
  // Skipping IE because editor doesn't load properly and media button is not activated on time.
  { skip: ['ie', 'safari'] },
  async (client: ClientType) => {
    const page = await goToFullPage(client);

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await uploadImage(page);

    // This will wait for file to upload (this will happened very fast, but it doesn't matter
    const uploadCard = await page.mediaPicker.getFilteredRecentUploadCards({
      status: 'complete',
      filename: 'popup.png',
    });

    //Checking to make sure that only one file matches filter
    expect(uploadCard.length).toBe(1);
    expect(uploadCard[0].meta.status).toBe('complete');

    await page.mediaPicker.clickInsertButton();

    await assertSingleMediaItem(page, client);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Pick from recent, Insert, publish, check',
  // Skipping safari because of ongoing issue (comms via email with support) with Browserstack atm
  // Skipping IE because editor doesn't load properly and media button is not activated on time.
  { skip: ['ie', 'safari'] },
  async (client: Parameters<typeof goToFullPage>[0]) => {
    //  Setup work. Add image first. Close picker, and open it again for it to be "recents"
    const page = await goToFullPage(client);
    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await uploadImage(page);
    // This will wait for file to upload (this will happened very fast, but it doesn't matter)
    await page.mediaPicker.getFilteredRecentUploadCards({
      status: 'complete',
      filename: 'popup.png',
    });

    await page.mediaPicker.clickCancelButton();

    // Opening picker again
    await page.openMediaPicker();
    // This will wait for /items to load and filecard to show up
    const uploadCard = await page.mediaPicker.getFilteredRecentUploadCards({
      status: 'complete',
      filename: 'popup.png',
    });

    //Checking to make sure that only one file matches filter
    expect(uploadCard.length).toBe(1);
    expect(uploadCard[0].meta.status).toBe('complete');

    await page.mediaPicker.selectCards({ status: 'complete' });

    await page.mediaPicker.clickInsertButton();

    await assertSingleMediaItem(page, client);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Upload, Insert immediately, publish, check',
  // Skipping safari because of ongoing issue (comms via email with support) with Browserstack atm
  // Skipping IE because editor doesn't load properly and media button is not activated on time.
  { skip: ['ie', 'safari'] },
  async (client: ClientType) => {
    const page = await goToFullPage(client);

    await page.openMediaPicker();

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).shouldWaitUpload = true;
    });

    await uploadImage(page);

    // This will wait for file to upload (this will happened very fast, but it doesn't matter
    const uploadCards = await page.mediaPicker.getFilteredRecentUploadCards({
      status: 'uploading',
      filename: 'popup.png',
    });

    //Checking to make sure that only one file matches filter
    expect(uploadCards.length).toBe(1);
    expect(uploadCards[0].meta.status).toBe('uploading');

    await page.mediaPicker.clickInsertButton();

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).shouldWaitUpload = false;
    });

    await assertSingleMediaItem(page, client);
  },
);
