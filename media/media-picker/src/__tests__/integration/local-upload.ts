import * as path from 'path';
import { MediaMockControlsBackdoor } from '@atlaskit/media-test-helpers';
import { BetaBrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import { gotoPopupSimplePage } from '../../../pages/popup-simple-page';

BetaBrowserTestCase(
  'local-upload.ts: MediaPicker - insert newly fully uploaded file',
  // Skipping safari because of ongoing issue (comms via email with support) with Browserstack atm
  { skip: ['safari'] },
  async (client: Parameters<typeof gotoPopupSimplePage>[0]) => {
    const page = await gotoPopupSimplePage(client);
    const filename = 'popup.png';
    const localPath = path.join(__dirname, '..', '..', '..', 'docs', filename);

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await page.mediaPicker.uploadFile(localPath);
    const cardWithFilename = await page.mediaPicker.getFilteredRecentUploadCards(
      {
        filename,
        status: 'complete',
      },
    );
    expect(cardWithFilename).toBeDefined();
    await page.mediaPicker.clickInsertButton();

    expect(await page.getEvent('uploads-start')).toMatchObject({
      payload: { files: [{ name: filename }] },
    });

    expect(await page.getEvent('upload-end')).toMatchObject({
      payload: { file: { name: filename } },
    });
  },
);

BetaBrowserTestCase(
  'local-upload.ts: MediaPicker - insert a file before it finished uploading',
  // Skipping safari because of ongoing issue (comms via email with support) with Browserstack atm
  { skip: ['safari'] },
  async (client: Parameters<typeof gotoPopupSimplePage>[0]) => {
    const page = await gotoPopupSimplePage(client);

    await page.waitUntil(
      async () =>
        await page.execute(() => (window as any).mediaMockControlsBackdoor),
    );

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).shouldWaitUpload = true;
    });

    const filename = 'popup.png';
    const localPath = path.join(__dirname, '..', '..', '..', 'docs', filename);

    expect(await page.mediaPicker.getAllRecentUploadCards()).toHaveLength(0);

    await page.mediaPicker.uploadFile(localPath);
    const cardWithFilename = await page.mediaPicker.getFilteredRecentUploadCards(
      {
        filename,
        status: 'uploading',
      },
    );
    expect(cardWithFilename).toBeDefined();
    await page.mediaPicker.clickInsertButton();

    expect(await page.getEvent('uploads-start')).toMatchObject({
      payload: { files: [{ name: filename }] },
    });

    await page.execute(() => {
      ((window as any)
        .mediaMockControlsBackdoor as MediaMockControlsBackdoor).shouldWaitUpload = false;
    });

    expect(await page.getEvent('upload-end')).toMatchObject({
      payload: { file: { name: filename } },
    });
  },
);
