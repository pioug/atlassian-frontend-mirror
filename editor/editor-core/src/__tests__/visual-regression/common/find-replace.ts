import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  editorSelector,
  pmSelector,
} from '../_utils';
import {
  waitForLoadedBackgroundImages,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import findReplaceAdf from './__fixtures__/with-content.json';
import borderRadiusAdf from './__fixtures__/find-replace-border-radius-adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import { emojiSelectors } from '../../__helpers/page-objects/_emoji';
import { findReplaceSelectors } from '../../__helpers/page-objects/_find-replace';
import {
  ToolbarMenuItem,
  toolbarMenuItemsSelectors,
} from '../../__helpers/page-objects/_toolbar';

describe('Find/replace:', () => {
  let page: Page;

  const initEditor = async (
    adf: any,
    viewport = { width: 1280, height: 600 },
  ) => {
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport,
      editorProps: { allowFindReplace: true },
    });
    await page.waitFor(findReplaceSelectors.toolbarButton);
    await page.click(findReplaceSelectors.toolbarButton);
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
    await page.waitForSelector(findReplaceSelectors.decorations);
    await snapshot(page, undefined, editorSelector);
  });

  it('should accurately highlight and de-highlight a find while it is edited', async () => {
    await initEditor(undefined, { width: 600, height: 300 });
    await page.type(findReplaceSelectors.findInput, 'hello');

    await page.type(pmSelector, 'hello hello');
    await snapshot(page, undefined, editorSelector);
    await page.keyboard.press('Backspace');
    await snapshot(page, undefined, editorSelector);
    await page.type(pmSelector, 'o');
    await snapshot(page, undefined, editorSelector);

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.type(pmSelector, ' ');
    await snapshot(page, undefined, editorSelector);

    await page.keyboard.press('Backspace');
    await snapshot(page, undefined, editorSelector);
  });

  it('should render find/replace popup below any other editor popups', async () => {
    await initEditor(findReplaceAdf, { width: 600, height: 300 });

    await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.emoji]);
    const emojiPickerSelector = 'div[data-emoji-picker-container="true"]';
    await page.waitForSelector(emojiPickerSelector);
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
    await snapshot(page, undefined, editorSelector);

    await page.click(toolbarMenuItemsSelectors[ToolbarMenuItem.insertMenu]);
    await waitForTooltip(page);
    await snapshot(page, undefined, editorSelector);
  });
});
