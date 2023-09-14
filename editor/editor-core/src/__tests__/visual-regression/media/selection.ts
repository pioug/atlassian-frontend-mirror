import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  Appearance,
  initEditorWithAdf,
  editorCommentContentSelector,
  editorSelector,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { EditorProps } from '../../../types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  changeMediaLayout,
  MediaLayout,
  scrollToMedia,
  waitForMediaToBeLoaded,
} from '@atlaskit/editor-test-helpers/page-objects/media';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickEditableContent,
  animationFrame,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import mediaGroupAdf from './__fixtures__/media-group-multiple-cards.adf.json';
import mediaSelectionAdf from './__fixtures__/media-selection.adf.json';

describe('Snapshot Test: Media', () => {
  let page: PuppeteerPage;
  const initEditor = async (
    appearance: Appearance,
    viewport: { width: number; height: number },
    adf?: Object,
    editorProps?: Partial<EditorProps>,
  ) => {
    await initEditorWithAdf(page, {
      appearance,
      viewport,
      editorProps,
      adf,
    });

    // click into the editor
    await clickEditableContent(page);
  };

  beforeAll(async () => {
    page = global.page;
  });

  describe('full page editor', () => {
    beforeEach(async () => {
      await initEditor(
        Appearance.fullPage,
        { width: 800, height: 700 },
        mediaSelectionAdf,
        { media: { allowMediaSingle: true } },
      );
      await waitForMediaToBeLoaded(page);
      await changeMediaLayout(page, MediaLayout.alignStart);
      await page.click(`${editorSelector} p`);
      // Move mouse out of the page to not create fake cursor
      await page.mouse.move(0, 0);
    });

    afterEach(async () => {
      await animationFrame(page);
      await scrollToMedia(page);
      await animationFrame(page);
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
        await initEditor(
          Appearance.comment,
          { width: 600, height: 400 },
          mediaGroupAdf,
        );
        await waitForMediaToBeLoaded(page);
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
          mediaSelectionAdf,
          { media: { allowMediaSingle: true } },
        );
        await waitForMediaToBeLoaded(page);
        await changeMediaLayout(page, MediaLayout.alignStart);
        await page.click(`${editorSelector} p`);
        // Move mouse out of the page to not create fake cursor
        await page.mouse.move(0, 0);
      });

      afterEach(async () => {
        await animationFrame(page);
        await scrollToMedia(page);
        await animationFrame(page);
        await takeCommentSnapshot(page);
      });

      it('should renders selection ring around media (via up)', async () => {
        await pressKey(page, 'ArrowUp');
      });

      // FIXME will be unskipped in https://product-fabric.atlassian.net/servicedesk/customer/portal/99/DTR-167?created=true
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
