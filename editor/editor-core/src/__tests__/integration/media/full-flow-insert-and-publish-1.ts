import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToFullPage,
  goToFullPageClickToEdit,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { sleep } from '@atlaskit/editor-test-helpers/sleep';
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  mediaImageSelector,
  mediaClickableSelector,
} from '@atlaskit/editor-test-helpers/page-objects/media';
import { MediaViewerPageObject } from '@atlaskit/media-integration-test-helpers';
import type { MediaMockControlsBackdoor } from '@atlaskit/media-test-helpers';
import { waitForNumImages } from './_utils';

type ClientType = Parameters<typeof goToFullPage>[0];

// Skipping safari because of ongoing issue (comms via email with support with Browserstack atm)
// Skipping IE because editor doesn't load properly and media button is not activated on time.
// Skipping Edge because sometimes it fails due to "The uploadFile command is not available in msedge". (comms via email with support with Browserstack atm)

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag folder that contains a folder (which has multiple images), verify, wait',
  {
    skip: ['safari'],
  },
  async (client: ClientType) => {
    const page = await goToFullPage(client);

    await page.execute(() => {
      localStorage['folderUploads'] = true;
      (
        (window as any).mediaMockControlsBackdoor as MediaMockControlsBackdoor
      ).uploadFolderContainingFolderFromDrag();
    });

    await waitForNumImages(page, 4);
  },
);

// FIXME: This test was automatically skipped due to failure on 04/09/2023: https://product-fabric.atlassian.net/browse/ED-19851
BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag folder (contains an image), verify, wait',
  {
    // skip: ['safari'],
    skip: ['*'],
  },
  async (client: ClientType) => {
    const page = await goToFullPage(client);

    await page.execute(() => {
      localStorage['folderUploads'] = true;
      (
        (window as any).mediaMockControlsBackdoor as MediaMockControlsBackdoor
      ).uploadFolderFromDrag();
    });

    await waitForNumImages(page, 1);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag image, verify, wait',
  {
    skip: ['safari'],
  },
  async (client: ClientType) => {
    const page = await goToFullPage(client);

    await page.execute(() => {
      (
        (window as any).mediaMockControlsBackdoor as MediaMockControlsBackdoor
      ).uploadImageFromDrag();
    });

    await waitForNumImages(page, 1);
  },
);

BrowserTestCase(
  'full-flow-insert-and-publish.ts: Click paragraph, ensure editor loads',
  {
    skip: ['safari'],
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

// FIXME: This test was automatically skipped due to failure on 27/05/2023: https://product-fabric.atlassian.net/browse/ED-18087
BrowserTestCase(
  'full-flow-insert-and-publish.ts: Drag image, verify, wait, publish, close media viewer and make sure editor not opened',
  {
    // skip: ['safari'],
    skip: ['*'],
  },
  async (client: ClientType) => {
    const page = await goToFullPageClickToEdit(client);

    await page.clearEditor();

    await page.execute(() => {
      (
        (window as any).mediaMockControlsBackdoor as MediaMockControlsBackdoor
      ).uploadImageFromDrag();
    });

    await waitForNumImages(page, 1);

    await page.publish();

    expect(await page.isVisible(mediaImageSelector)).toBe(true);

    await page.pause(300); // When running against chromedriver directly it may fail without this pause because event handlers haven't been assigned yet
    await page.click(mediaClickableSelector);

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
