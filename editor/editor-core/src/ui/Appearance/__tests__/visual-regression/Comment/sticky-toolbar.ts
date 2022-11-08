import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import {
  initCommentEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { createDocumentWithParagraphs } from '../__fixtures/paragraph-content';

import {
  animationFrame,
  clickEditableContent,
  scrollToBottom,
} from '@atlaskit/editor-test-helpers/page-objects/editor';

describe('Comment with sticky toolbar', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  describe('disabled', () => {
    test('without scroll', async () => {
      await initCommentEditorWithAdf(
        page,
        createDocumentWithParagraphs(10),
        undefined,
        undefined,
        { useStickyToolbar: false },
      );
    });

    test('with scroll', async () => {
      await initCommentEditorWithAdf(
        page,
        createDocumentWithParagraphs(10),
        undefined,
        undefined,
        { useStickyToolbar: false },
      );
      await clickEditableContent(page);
      await scrollToBottom(page);
      await animationFrame(page);
    });
  });

  describe('enabled', () => {
    test('without scroll', async () => {
      await initCommentEditorWithAdf(
        page,
        createDocumentWithParagraphs(10),
        undefined,
        undefined,
        { useStickyToolbar: true },
      );
    });

    test('with scroll', async () => {
      await initCommentEditorWithAdf(
        page,
        createDocumentWithParagraphs(10),
        undefined,
        undefined,
        { useStickyToolbar: true },
      );
      await clickEditableContent(page);
      await scrollToBottom(page);
      await animationFrame(page);
    });
  });
});
