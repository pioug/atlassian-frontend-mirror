// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  isDropdownMenuItemFocused,
  selectToolbarDropdownMenuItemWithKeyboard,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  clickQuerySelectorElement,
  initEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import * as indentedAdf from '../adf/indented-nodes-adf.json';
import * as outdentedAdf from '../adf/outdented-nodes-adf.json';

const buttonSelectors = {
  dropdown: '[aria-label="Lists"]',
  bulletList: '[data-testid="dropdown-item__Bullet list"]',
  indent: '[data-testid="dropdown-item__Indent"]',
  outdent: '[data-testid="dropdown-item__Outdent"]',
};

describe('dropdown menu button accessibility', () => {
  let page: PuppeteerPage;

  describe('disabled outdent button will shift focus to the next button', () => {
    beforeEach(async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        viewport: { width: 500, height: 500 },
        adf: indentedAdf,
        editorProps: {
          showIndentationButtons: true,
        },
      });
      await page.waitForSelector(buttonSelectors.dropdown);
    });

    it('should shift focus to indent button when paragraphs disable the button', async () => {
      await clickQuerySelectorElement(page, 'p');

      await selectToolbarDropdownMenuItemWithKeyboard(
        page,
        buttonSelectors.dropdown,
        buttonSelectors.outdent,
      );
      await pressKey(page, 'Enter');

      expect(
        await isDropdownMenuItemFocused(page, buttonSelectors.indent),
      ).toBe(true);
    });

    it('should shift focus to indent button when headings disable the button', async () => {
      await clickQuerySelectorElement(page, 'h1');

      await selectToolbarDropdownMenuItemWithKeyboard(
        page,
        buttonSelectors.dropdown,
        buttonSelectors.outdent,
      );
      await pressKey(page, 'Enter');

      expect(
        await isDropdownMenuItemFocused(page, buttonSelectors.indent),
      ).toBe(true);
    });

    // FIXME: This test was automatically skipped due to failure on 31/08/2023: https://product-fabric.atlassian.net/browse/ED-19808
    it.skip('should shift focus to indent button when bullet lists disable the button', async () => {
      await clickQuerySelectorElement(page, 'li');

      await selectToolbarDropdownMenuItemWithKeyboard(
        page,
        buttonSelectors.dropdown,
        buttonSelectors.outdent,
      );
      await pressKey(page, 'Enter');

      expect(
        await isDropdownMenuItemFocused(page, buttonSelectors.indent),
      ).toBe(true);
    });

    it('should shift focus to indent button when task lists disable the button', async () => {
      await clickQuerySelectorElement(page, '.task-item', 1);

      await selectToolbarDropdownMenuItemWithKeyboard(
        page,
        buttonSelectors.dropdown,
        buttonSelectors.outdent,
      );
      await pressKey(page, 'Enter');

      expect(
        await isDropdownMenuItemFocused(page, buttonSelectors.indent),
      ).toBe(true);
    });
  });

  describe('disabled indent button will shift focus to the next non-disabled button', () => {
    beforeEach(async () => {
      page = global.page;
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        viewport: { width: 500, height: 500 },
        adf: outdentedAdf,
        editorProps: {
          showIndentationButtons: true,
        },
      });
      await page.waitForSelector(buttonSelectors.dropdown);
    });

    it('should shift focus to bullet list when paragraphs disable the button', async () => {
      await clickQuerySelectorElement(page, 'p');

      await selectToolbarDropdownMenuItemWithKeyboard(
        page,
        buttonSelectors.dropdown,
        buttonSelectors.indent,
      );
      await pressKey(page, 'Enter');

      expect(
        await isDropdownMenuItemFocused(page, buttonSelectors.bulletList),
      ).toBe(true);
    });

    it('should shift focus to outdent button when headings disable the button', async () => {
      await clickQuerySelectorElement(page, 'h1');

      await selectToolbarDropdownMenuItemWithKeyboard(
        page,
        buttonSelectors.dropdown,
        buttonSelectors.indent,
      );
      await pressKey(page, 'Enter');

      expect(
        await isDropdownMenuItemFocused(page, buttonSelectors.outdent),
      ).toBe(true);
    });

    it('should shift focus to bullet list button when bullet lists disable the button', async () => {
      await clickQuerySelectorElement(page, 'li', 5);

      await selectToolbarDropdownMenuItemWithKeyboard(
        page,
        buttonSelectors.dropdown,
        buttonSelectors.indent,
      );
      await pressKey(page, 'Enter');

      expect(
        await isDropdownMenuItemFocused(page, buttonSelectors.bulletList),
      ).toBe(true);
    });

    it('should shift focus to outdent button when task lists disable the button', async () => {
      await clickQuerySelectorElement(page, '.task-item', 5);

      await selectToolbarDropdownMenuItemWithKeyboard(
        page,
        buttonSelectors.dropdown,
        buttonSelectors.indent,
      );
      await pressKey(page, 'Enter');

      expect(
        await isDropdownMenuItemFocused(page, buttonSelectors.outdent),
      ).toBe(true);
    });
  });
});
