import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  Appearance,
  initEditorWithAdf,
  editorCommentContentSelector,
  editorSelector,
} from '../_utils';
import {
  insertMedia,
  scrollToMedia,
} from '../../__helpers/page-objects/_media';
import { clickEditableContent } from '../../__helpers/page-objects/_editor';
import { pressKey } from '../../__helpers/page-objects/_keyboard';
import { EditorProps } from '../../../types';
import mediaGroupAdf from './__fixtures__/media-group-multiple-cards.adf.json';

describe('Snapshot Test: Media', () => {
  let page: PuppeteerPage;
  const initEditor = async (
    appearance: Appearance,
    viewport: { width: number; height: number },
    editorProps?: Partial<EditorProps>,
  ) => {
    await initEditorWithAdf(page, {
      appearance,
      viewport,
      editorProps,
    });

    // click into the editor
    await clickEditableContent(page);
  };

  beforeAll(async () => {
    page = global.page;
  });

  describe('full page editor', () => {
    beforeEach(async () => {
      await initEditor(Appearance.fullPage, { width: 800, height: 700 });

      // insert single media item
      await insertMedia(page);
      // Move mouse out of the page to not create fake cursor
      await page.mouse.move(0, 0);
    });

    afterEach(async () => {
      await scrollToMedia(page);
      await snapshot(page);
    });

    it('should renders selection ring around media (via up)', async () => {
      await pressKey(page, 'ArrowUp');
    });

    it('should render right side gap cursor (via arrow left)', async () => {
      await pressKey(page, 'ArrowLeft');
    });

    it('renders selection ring around media (via 2 arrow left)', async () => {
      await pressKey(page, ['ArrowLeft', 'ArrowLeft']);
    });

    it('should render left side gap cursor (via 3 arrow left)', async () => {
      await pressKey(page, ['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
    });
  });

  describe('comment editor', () => {
    const takeCommentSnapshot = async (page: PuppeteerPage) =>
      snapshot(page, undefined, editorCommentContentSelector);

    describe('media group', () => {
      beforeEach(async () => {
        await initEditorWithAdf(page, {
          appearance: Appearance.comment,
          adf: mediaGroupAdf,
          viewport: {
            width: 600,
            height: 400,
          },
        });
        await page.click(`${editorSelector} p`);
      });

      it('renders selection ring around last media group item (via up)', async () => {
        await pressKey(page, 'ArrowUp');
        await takeCommentSnapshot(page);
      });

      it('renders selection ring around media group items (via left)', async () => {
        await pressKey(page, ['ArrowLeft', 'ArrowLeft']);
        await takeCommentSnapshot(page);

        await pressKey(page, 'ArrowLeft');
        await takeCommentSnapshot(page);

        await pressKey(page, 'ArrowLeft');
        await takeCommentSnapshot(page);
      });

      it('renders left side gap cursor', async () => {
        await pressKey(page, [
          'ArrowLeft',
          'ArrowLeft',
          'ArrowLeft',
          'ArrowLeft',
          'ArrowLeft',
        ]);
        await takeCommentSnapshot(page);
      });
    });

    describe('media single', () => {
      beforeEach(async () => {
        await initEditor(
          Appearance.comment,
          { width: 550, height: 400 },
          { media: { allowMediaSingle: true } },
        );

        // insert single media item
        await insertMedia(page);

        // Move mouse out of the page to not create fake cursor
        await page.mouse.move(0, 0);
      });

      afterEach(async () => {
        await scrollToMedia(page);
        await takeCommentSnapshot(page);
      });

      it('should renders selection ring around media (via up)', async () => {
        await pressKey(page, 'ArrowUp');
      });

      // FIXME: This test was automatically skipped due to failure on 8/24/2021: https://product-fabric.atlassian.net/browse/ED-13662
      it.skip('should render right side gap cursor (via arrow left)', async () => {
        await pressKey(page, 'ArrowLeft');
      });

      it('renders selection ring around media (via 2 arrow left)', async () => {
        await pressKey(page, ['ArrowLeft', 'ArrowLeft']);
      });

      it('should render left side gap cursor (via 3 arrow left)', async () => {
        await pressKey(page, ['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
      });
    });
  });
});
