import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import {
  initChromelessEditorWithAdf,
  snapshot,
} from '../../../../../__tests__/visual-regression/_utils';
import { createDocumentWithParagraphs } from '../__fixtures/paragraph-content';

describe('Chromeless', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  test('empty content', async () => {
    await initChromelessEditorWithAdf(page, {});
  });

  test('with short content', async () => {
    await initChromelessEditorWithAdf(page, createDocumentWithParagraphs());
  });

  test('with long content', async () => {
    await initChromelessEditorWithAdf(page, createDocumentWithParagraphs(10));
  });

  test('with long content but maxHeight set', async () => {
    await initChromelessEditorWithAdf(
      page,
      createDocumentWithParagraphs(10),
      undefined,
      undefined,
      { maxHeight: 150 },
    );
  });
});
