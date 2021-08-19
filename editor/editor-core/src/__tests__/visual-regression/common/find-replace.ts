import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  editorSelector,
  pmSelector,
} from '../_utils';
import {
  PuppeteerPage,
  waitForLoadedBackgroundImages,
  waitForTooltip,
  waitForNoTooltip,
  waitForElementCount,
} from '@atlaskit/visual-regression/helper';
import findReplaceAdf from './__fixtures__/with-content.json';
import borderRadiusAdf from './__fixtures__/find-replace-border-radius-adf.json';
import matchCaseAdf from './__fixtures__/find-replace-match-case-adf.json';
import { emojiSelectors } from '../../__helpers/page-objects/_emoji';
import { findReplaceSelectors } from '../../__helpers/page-objects/_find-replace';
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '../../__helpers/page-objects/_toolbar';
import { FindReplaceOptions } from '../../../plugins/find-replace/types';
import { selectAtPosWithProseMirror } from '../../__helpers/page-objects/_editor';

describe('Find/replace:', () => {
  let page: PuppeteerPage;

  const initEditor = async (
    adf: any,
    viewport = { width: 1280, height: 600 },
    options: boolean | FindReplaceOptions = true,
  ) => {
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport,
      editorProps: { allowFindReplace: options },
    });
    await page.waitForSelector(findReplaceSelectors.toolbarButton);
    await page.click(findReplaceSelectors.toolbarButton);
    await waitForTooltip(page, 'Find and replace');
  };

  it('should render find/replace popup', async () => {
    await initEditor(findReplaceAdf);
    await snapshot(page, undefined, editorSelector);
  });

  it('should render text highlights only against matches when a find is active', async () => {
    await initEditor(findReplaceAdf);
    await page.type(findReplaceSelectors.findInput, 'e');
    await page.waitForSelector(findReplaceSelectors.decorations);

    await snapshot(page, undefined, editorSelector);
  });

  it('should render selected word styles correctly’', async () => {
    await initEditor(borderRadiusAdf, { width: 600, height: 300 });
    await page.type(findReplaceSelectors.findInput, 'hi');
    await waitForElementCount(page, findReplaceSelectors.decorations, 162);
    // Unfortunately need to wait for browser to paint background colors
    await page.waitForTimeout(500);
    await snapshot(page, undefined, editorSelector);
  });
  // FIXME: Inconsistent test
  it.skip('should accurately highlight and de-highlight a find while it is edited', async () => {
    await initEditor(undefined, { width: 600, height: 300 });
    await page.click(findReplaceSelectors.findInput);
    await page.type(findReplaceSelectors.findInput, 'hello');
    await page.waitForSelector(
      `${findReplaceSelectors.findInput}[value="hello"]`,
    );
    await page.click(pmSelector);
    await page.type(pmSelector, 'hello hello');
    await waitForNoTooltip(page);
    await page.waitForSelector(findReplaceSelectors.decorations);
    await snapshot(page, undefined, editorSelector);
    await page.keyboard.press('Backspace');
    await page.waitForSelector(findReplaceSelectors.decorations);
    await snapshot(page, undefined, editorSelector);
    await page.type(pmSelector, 'o');
    await page.waitForSelector(findReplaceSelectors.decorations);
    await snapshot(page, undefined, editorSelector);

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.type(pmSelector, ' ');
    await page.waitForSelector(findReplaceSelectors.decorations);
    await snapshot(page, undefined, editorSelector);

    await page.keyboard.press('Backspace');
    await page.waitForSelector(findReplaceSelectors.decorations);
    await snapshot(page, undefined, editorSelector);
  });

  // TODO: https://product-fabric.atlassian.net/browse/ED-13527
  it.skip('should render find/replace popup below any other editor popups', async () => {
    await initEditor(findReplaceAdf, { width: 1000, height: 300 });

    await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.emoji]);
    const emojiPickerSelector = 'div[data-emoji-picker-container="true"]';
    await page.waitForSelector(emojiPickerSelector);
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
    await snapshot(page, undefined, editorSelector);

    await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.insertMenu]);
    await waitForTooltip(page);
    await snapshot(page, undefined, editorSelector);
  });

  describe('when Match Case feature toggle is enabled', () => {
    const options = { allowMatchCase: true };
    const toggleMatchCase = async (page: PuppeteerPage) => {
      await page.waitForSelector(findReplaceSelectors.matchCaseButton);
      await page.click(findReplaceSelectors.matchCaseButton);
      await page.waitForSelector(findReplaceSelectors.decorations);
    };

    it('should render Match Case button', async () => {
      await initEditor(matchCaseAdf, { width: 600, height: 600 }, options);
      await page.waitForSelector(findReplaceSelectors.matchCaseButton);
      await snapshot(page, undefined, editorSelector);
    });

    it('should not match case by default', async () => {
      await initEditor(matchCaseAdf, { width: 600, height: 600 }, options);
      await page.waitForSelector(findReplaceSelectors.matchCaseButton);
      await page.type(findReplaceSelectors.findInput, 'HELLO');
      await page.waitForSelector(findReplaceSelectors.decorations);
      await snapshot(page, undefined, editorSelector);
    });
    // FIXME: Inconsistent test
    it.skip('should update text decorations when enabling match case', async () => {
      await initEditor(matchCaseAdf, { width: 600, height: 600 }, options);
      await page.waitForSelector(findReplaceSelectors.matchCaseButton);
      await page.type(findReplaceSelectors.findInput, 'HELLO');
      await page.waitForSelector(findReplaceSelectors.decorations);

      // When clicking on find-replace pop-up, will also set cursor in editor(unintentionally),
      // it is not reliable, and would cause failures.
      // So we force set cursor position in this test.
      // Set cursor to the beginning of the document.
      await selectAtPosWithProseMirror(page, 0, 0);
      await toggleMatchCase(page);
      await snapshot(page, undefined, editorSelector);
    });

    it('should update text decorations when disabling match case', async () => {
      await initEditor(matchCaseAdf, { width: 600, height: 600 }, options);
      await page.waitForSelector(findReplaceSelectors.matchCaseButton);
      await page.type(findReplaceSelectors.findInput, 'HELLO');
      await page.waitForSelector(findReplaceSelectors.decorations);

      // When clicking on find-replace pop-up, will also set cursor in editor(unintentionally),
      // it is not reliable, and would cause failures.
      // So we force set cursor position in this test.
      // Set cursor to the beginning of the document.
      await selectAtPosWithProseMirror(page, 0, 0);
      await toggleMatchCase(page);

      // Set cursor to the end of the first paragraph.
      await selectAtPosWithProseMirror(page, 18, 18);
      await toggleMatchCase(page);
      await snapshot(page, undefined, editorSelector);
    });
  });
});
