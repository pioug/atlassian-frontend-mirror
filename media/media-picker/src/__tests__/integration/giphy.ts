import { BetaBrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import { gotoPopupSimplePage } from '../../../pages/popup-simple-page';

BetaBrowserTestCase(
  'giphy.ts: MediaPicker - insert Giphy image',
  { skip: [] },
  async (client: Parameters<typeof gotoPopupSimplePage>[0]) => {
    const page = await gotoPopupSimplePage(client);
    const randomCardIndex = ~~(Math.random() * 10);

    await page.mediaPicker.clickGiphyButton();

    const cardWithFilename = await page.mediaPicker.getNthUploadCard(
      randomCardIndex,
    );
    expect(cardWithFilename).toBeDefined();

    const {
      meta: { filename },
    } = cardWithFilename;

    await page.mediaPicker.selectNthUploadCard(randomCardIndex);
    await page.mediaPicker.clickInsertButton();

    expect(await page.getEvent('uploads-start')).toMatchObject({
      payload: { files: [{ name: filename, type: 'image/gif' }] },
    });

    expect(await page.getEvent('upload-preview-update')).toMatchObject({
      payload: {
        file: { name: filename, type: 'image/gif' },
        preview: {
          dimensions: {
            width: 320,
            height: 240,
          },
          scaleFactor: 1,
        },
      },
    });

    expect(await page.getEvent('upload-end')).toMatchObject({
      payload: { file: { name: filename, type: 'image/gif' } },
    });
  },
);
