import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  clickQuerySelectorElement,
  isElementFocused,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectToolbarMenuWithKeyboard } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import * as indentedAdf from '../../../../../src/__tests__/visual-regression/common/__fixtures__/indented-nodes-adf.json';
import * as outdentedAdf from '../../../../../src/__tests__/visual-regression/common/__fixtures__/outdented-nodes-adf.json';

const buttonSelectors = {
  indent: '[data-testid="indent"]',
  outdent: '[data-testid="outdent"]',
};

describe('toolbar accessbility', () => {
  let page: PuppeteerPage;

  describe('testing outdent button will shift focus to indentation button', () => {
    beforeEach(async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        viewport: { width: 1000, height: 500 },
        adf: indentedAdf,
        editorProps: {
          showIndentationButtons: true,
          allowIndentation: true,
        },
      });
      await page.waitForSelector(buttonSelectors.outdent);
      await page.waitForSelector(buttonSelectors.indent);
    });

    it('should shift focus for paragraphs', async () => {
      await clickQuerySelectorElement(page, 'p');

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.outdent);
      await pressKey(page, 'Enter');

      expect(await isElementFocused(page, buttonSelectors.indent)).toBe(true);
    });

    it('should shift focus for headings', async () => {
      await clickQuerySelectorElement(page, 'h1');

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.outdent);
      await pressKey(page, 'Enter');

      expect(await isElementFocused(page, buttonSelectors.indent)).toBe(true);
    });

    it('should shift focus for bullet lists', async () => {
      await clickQuerySelectorElement(page, 'li');

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.outdent);
      await pressKey(page, 'Enter');

      expect(await isElementFocused(page, buttonSelectors.indent)).toBe(true);
    });

    it('should shift focus for task lists', async () => {
      await clickQuerySelectorElement(page, '.task-item', 1);

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.outdent);
      await pressKey(page, 'Enter');

      expect(await isElementFocused(page, buttonSelectors.indent)).toBe(true);
    });
  });

  describe('testing indent button will shift focus to outdentation button', () => {
    beforeEach(async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        viewport: { width: 1000, height: 500 },
        adf: outdentedAdf,
        editorProps: {
          showIndentationButtons: true,
          allowIndentation: true,
        },
      });
      await page.waitForSelector(buttonSelectors.outdent);
      await page.waitForSelector(buttonSelectors.indent);
    });

    it('should shift focus for paragraphs', async () => {
      await clickQuerySelectorElement(page, 'p');

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.indent);
      await pressKey(page, 'Enter');

      expect(await isElementFocused(page, buttonSelectors.outdent)).toBe(true);
    });

    it('should shift focus for headings', async () => {
      await clickQuerySelectorElement(page, 'h1');

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.indent);
      await pressKey(page, 'Enter');

      expect(await isElementFocused(page, buttonSelectors.outdent)).toBe(true);
    });

    // FIXME: This test was automatically skipped due to failure on 16/06/2023: https://product-fabric.atlassian.net/browse/ED-18842
    it.skip('should shift focus for bullet lists', async () => {
      await clickQuerySelectorElement(page, 'li', 5);

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.indent);
      await pressKey(page, 'Enter');

      expect(await isElementFocused(page, buttonSelectors.outdent)).toBe(true);
    });

    it('should shift focus for task lists', async () => {
      await clickQuerySelectorElement(page, '.task-item', 5);

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.indent);
      await pressKey(page, 'Enter');

      expect(await isElementFocused(page, buttonSelectors.outdent)).toBe(true);
    });
  });
});
