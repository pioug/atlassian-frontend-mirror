import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  callNativeBridge,
  editor,
  editable,
  getDocFromElement,
  skipBrowsers as skip,
} from '../_utils';

const fakeMobileId = `fake-aaaa-bbbb-cccc-dddddddddd`;

const uploadPreviewUpdatePayload = (dimensions?: {
  width: number;
  height: number;
}) => ({
  file: {
    dimensions,
    id: fakeMobileId,
    name: 'test-file.jpeg',
    type: 'image/jpeg',
  },
  preview: {
    dimensions,
  },
});

const mobileUploadEndPayload = (publicId: string, collectionName: string) => ({
  file: {
    id: fakeMobileId,
    publicId,
    collectionName,
    name: 'test-file.jpeg',
    type: 'image/jpeg',
  },
});

BrowserTestCase(
  `media.ts: Collection + Dimensions => uploading`,
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-preview-update',
      JSON.stringify(
        uploadPreviewUpdatePayload({
          width: 2265,
          height: 1500,
        }),
      ),
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `media.ts: Collection + Dimensions => complete`,
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-preview-update',
      JSON.stringify(
        uploadPreviewUpdatePayload({
          width: 2265,
          height: 1500,
        }),
      ),
    );

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-end',
      JSON.stringify(
        mobileUploadEndPayload(
          '03907bf7-7dbb-408f-a334-27a5ae6bb7b9',
          'MediaServicesDemoCollection',
        ),
      ),
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `media.ts: Collection + No dimension => uploading`,
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-preview-update',
      JSON.stringify(uploadPreviewUpdatePayload()),
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `media.ts: Collection + No dimension => complete`,
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-preview-update',
      JSON.stringify(uploadPreviewUpdatePayload()),
    );

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-end',
      JSON.stringify(
        mobileUploadEndPayload(
          '03907bf7-7dbb-408f-a334-27a5ae6bb7b9',
          'MediaServicesDemoCollection',
        ),
      ),
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `media.ts: Empty collection + Dimensions => uploading`,
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-preview-update',
      JSON.stringify(
        uploadPreviewUpdatePayload({
          width: 2265,
          height: 1500,
        }),
      ),
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `media.ts: Empty collection + Dimensions => complete`,
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-preview-update',
      JSON.stringify(
        uploadPreviewUpdatePayload({
          width: 2265,
          height: 1500,
        }),
      ),
    );

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-end',
      JSON.stringify(
        mobileUploadEndPayload('03907bf7-7dbb-408f-a334-27a5ae6bb7b9', ''),
      ),
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `media.ts: Empty collection + No dimension => uploading`,
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-preview-update',
      JSON.stringify(uploadPreviewUpdatePayload()),
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `media.ts: Empty collection + No dimension => complete`,
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-preview-update',
      JSON.stringify(
        uploadPreviewUpdatePayload({
          width: 2265,
          height: 1500,
        }),
      ),
    );

    await callNativeBridge(
      browser,
      'onMediaPicked',
      'upload-end',
      JSON.stringify(
        mobileUploadEndPayload('03907bf7-7dbb-408f-a334-27a5ae6bb7b9', ''),
      ),
    );

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
