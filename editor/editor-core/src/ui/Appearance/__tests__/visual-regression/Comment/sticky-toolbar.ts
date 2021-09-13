import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import {
  initCommentEditorWithAdf,
  snapshot,
} from '../../../../../__tests__/visual-regression/_utils';
import { createDocumentWithParagraphs } from '../__fixtures/paragraph-content';

import {
  animationFrame,
  clickEditableContent,
  scrollToBottom,
} from '../../../../../__tests__/__helpers/page-objects/_editor';

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

    // FIXME: This test was automatically skipped due to failure on 9/7/2021: https://product-fabric.atlassian.net/browse/ED-13717
    test.skip('with scroll', async () => {
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

    // FIXME: This test was automatically skipped due to failure on 9/7/2021: https://product-fabric.atlassian.net/browse/ED-13717
    test.skip('with scroll', async () => {
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
