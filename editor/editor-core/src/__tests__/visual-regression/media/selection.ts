import {
  snapshot,
  Appearance,
  initEditorWithAdf,
  editorCommentContentSelector,
} from '../_utils';
import {
  insertMedia,
  scrollToMedia,
} from '../../__helpers/page-objects/_media';
import { clickEditableContent } from '../../__helpers/page-objects/_editor';
import { pressKey } from '../../__helpers/page-objects/_keyboard';
import { Page } from '../../__helpers/page-objects/_types';
import { EditorProps } from '../../../types';

describe('Snapshot Test: Media', () => {
  let page: Page;
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
      await page.mouse.move(-1, -1);
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
    const takeCommentSnapshot = async (page: Page) =>
      snapshot(page, undefined, editorCommentContentSelector);

    describe('media group', () => {
      beforeEach(async () => {
        await initEditor(Appearance.comment, { width: 600, height: 400 });

        // insert 3 media items
        await insertMedia(page, ['one.svg', 'two.svg', 'three.svg']);
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
          { width: 600, height: 400 },
          { media: { allowMediaSingle: true } },
        );

        // insert single media item
        await insertMedia(page);

        // Move mouse out of the page to not create fake cursor
        await page.mouse.move(-1, -1);
      });

      afterEach(async () => {
        await scrollToMedia(page);
        await takeCommentSnapshot(page);
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
  });
});
