import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import * as indentation from './__fixtures__/indentation-adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';

const firstParagraphSelector = '.ProseMirror p:nth-of-type(1)';
const secondParagraphSelector = '.ProseMirror p:nth-of-type(2)';
const firstHeadingSelector = '.ProseMirror h1:nth-of-type(1)';
const secondHeadingSelector = '.ProseMirror h1:nth-of-type(2)';

describe('Indentation', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });

  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, indentation);
  });

  afterEach(async () => {
    await snapshot(page);
  });
  describe('on tab key press', () => {
    // If the indentation mark is applied to the first node in the doc, it should have no margin-topu
    it('adds indentation mark to first paragraph and removes margin-top', async () => {
      await page.click(firstParagraphSelector);
      await pressKey(page, ['Tab']);
    });

    it('adds indentation mark to second paragraph and retains margin-top', async () => {
      await page.click(secondParagraphSelector);
      await pressKey(page, ['Tab']);
    });
    // Headings are underneath p's in ADF
    it('adds indentation mark to first heading and retains margin-top', async () => {
      await page.click(firstHeadingSelector);
      await pressKey(page, ['Tab']);
    });

    it('adds indentation mark to second heading and retains margin-top', async () => {
      await page.click(secondHeadingSelector);
      await pressKey(page, ['Tab']);
    });
  });
});
