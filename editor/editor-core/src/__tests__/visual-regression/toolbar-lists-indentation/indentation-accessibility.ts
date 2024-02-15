// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectToolbarMenuWithKeyboard } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  clickQuerySelectorElement,
  initEditorWithAdf,
  isElementFocused,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import * as indentedAdf from '../common/__fixtures__/indented-nodes-adf.json';
import * as outdentedAdf from '../common/__fixtures__/outdented-nodes-adf.json';

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

    it('should shift focus for bullet lists', async () => {
      await clickQuerySelectorElement(page, 'li', 5);

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.indent);
      await pressKey(page, 'Enter');

      expect(await isElementFocused(page, buttonSelectors.outdent)).toBe(true);
    });

    // FIXME: Error: menu button for '[data-testid="indent"]' not found
    // Build: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2427940/steps/%7B8dad43db-20a7-4581-bdb1-67e7dcafdf0e%7D/test-report
    it.skip('should shift focus for task lists', async () => {
      await clickQuerySelectorElement(page, '.task-item', 5);

      await selectToolbarMenuWithKeyboard(page, buttonSelectors.indent);
      await pressKey(page, 'Enter');

      expect(await isElementFocused(page, buttonSelectors.outdent)).toBe(true);
    });
  });
});
