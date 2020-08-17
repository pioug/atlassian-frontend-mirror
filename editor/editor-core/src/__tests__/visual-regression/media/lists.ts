import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import {
  clickEditableContent,
  typeInEditor,
} from '../../__helpers/page-objects/_editor';
import {
  insertMedia,
  waitForMediaToBeLoaded,
  resizeMediaInPosition,
  scrollToMedia,
  clickMediaInPosition,
} from '../../__helpers/page-objects/_media';
import * as panelList from './__fixtures__/panel-list-adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

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
    beforeEach(async () => {
      await initEditor();
    });

    afterEach(async () => {
      await insertMedia(page);
      await scrollToMedia(page);
      await waitForMediaToBeLoaded(page);
      await clickMediaInPosition(page, 0); // want to see resize handles

      await snapshot(page);
    });

    it('can insert a media single inside a bullet list', async () => {
      await typeInEditor(page, '* ');
    });

    it('can insert a media single inside a numbered list', async () => {
      // type some text
      await typeInEditor(page, '1. ');
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
