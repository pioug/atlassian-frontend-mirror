// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { clickEditableContent } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  waitForMediaToBeLoaded,
  resizeMediaInPosition,
} from '@atlaskit/editor-test-helpers/page-objects/media';
import * as panelList from './__fixtures__/panel-list-adf.json';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import bulletListAdf from './__fixtures__/mediaSingle-in-buttetList.adf.json';
import numberListAdf from './__fixtures__/mediaSingle-in-numberList.adf.json';

let page: PuppeteerPage;

const initEditor = async (adf?: Object) => {
  await initEditorWithAdf(page, {
    appearance: Appearance.fullPage,
    adf,
    viewport: { width: 1040, height: 1000 },
  });
  await clickEditableContent(page);
};

describe('Snapshot Test: Media', () => {
  beforeEach(async () => {
    page = global.page;
  });

  describe('Lists', () => {
    it('can insert a media single inside a bullet list', async () => {
      await initEditor(bulletListAdf);
      await waitForMediaToBeLoaded(page);

      await snapshot(page);
    });

    it('can insert a media single inside a numbered list', async () => {
      await initEditor(numberListAdf);
      await waitForMediaToBeLoaded(page);

      await snapshot(page);
    });
  });

  // TODO: Convert to integration test (https://product-fabric.atlassian.net/browse/ED-6692)
  describe('Lists in panels', () => {
    beforeEach(async () => {
      await initEditor(panelList);
    });

    it('can be resized in a list in a panel', async () => {
      await resizeMediaInPosition(page, 0, 300);
      await snapshot(page);
    });
  });
});
