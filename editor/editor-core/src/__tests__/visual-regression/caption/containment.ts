// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickMediaInPosition,
  waitForMediaToBeLoaded,
} from '@atlaskit/editor-test-helpers/page-objects/media';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { retryUntilStablePosition } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import captionWrappedExpand from './__fixtures__/caption-wrapped-expand.adf.json';
import captionWrappedLayout from './__fixtures__/caption-wrapped-layout.adf.json';
import captionWrappedSkinnyTable from './__fixtures__/caption-wrapped-skinny-table.adf.json';
import captionWrappedTable from './__fixtures__/caption-wrapped-table.adf.json';

async function initEditor(page: PuppeteerPage, adf: object) {
  await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI, undefined, {
    media: {
      allowMediaSingle: true,
      allowCaptions: true,
    },
  });

  await waitForMediaToBeLoaded(page);

  await retryUntilStablePosition(
    page,
    () => clickMediaInPosition(page, 0), // this is the operation you want to perform, which also makes the floating toolbar visible. Usually a page.click()
    '[aria-label*="Media floating controls"]', // this is the toolbar (or any other) selector whose position you want settled before continuing
    1000, // this is the duration between the periodic positioning checks - I recommend trying with 1000ms first.
  );
}

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Snapshot Test: Caption with media', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('containment', () => {
    afterEach(async () => {
      await snapshot(page);
    });

    it('should show the caption in a table', async () => {
      await initEditor(page, captionWrappedTable);
    });

    it('should show the caption in a skinny table', async () => {
      await initEditor(page, captionWrappedSkinnyTable);
    });

    it('should show the caption in a layout', async () => {
      await initEditor(page, captionWrappedLayout);
    });

    it('should show the caption in an expand', async () => {
      await initEditor(page, captionWrappedExpand);
    });
  });
});
