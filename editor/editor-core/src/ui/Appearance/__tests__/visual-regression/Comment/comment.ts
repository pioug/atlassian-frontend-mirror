import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import {
  initCommentEditorWithAdf,
  snapshot,
} from '../../../../../__tests__/visual-regression/_utils';
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

  test('with short content', async () => {
    await initCommentEditorWithAdf(page, createDocumentWithParagraphs());
  });

  test('with long content', async () => {
    await initCommentEditorWithAdf(page, createDocumentWithParagraphs(10));
  });
});
