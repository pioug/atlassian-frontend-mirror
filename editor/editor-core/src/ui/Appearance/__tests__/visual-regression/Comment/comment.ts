import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initCommentEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { createDocumentWithParagraphs } from '../__fixtures/paragraph-content';

describe('Comment', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  test('empty content', async () => {
    await initCommentEditorWithAdf(page, {});
  });

  test('empty content with minHeight', async () => {
    await initCommentEditorWithAdf(page, {}, undefined, undefined, {
      minHeight: 250,
    });
  });

  test('with short content', async () => {
    await initCommentEditorWithAdf(page, createDocumentWithParagraphs());
  });

  test('with long content', async () => {
    await initCommentEditorWithAdf(page, createDocumentWithParagraphs(10));
  });

  test('with long content but maxHeight set', async () => {
    await initCommentEditorWithAdf(
      page,
      createDocumentWithParagraphs(10),
      undefined,
      undefined,
      { maxHeight: 150 },
    );
  });
});
