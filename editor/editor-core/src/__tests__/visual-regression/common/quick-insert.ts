import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  typeInEditorAtEndOfDocument,
  selectors,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  waitForTypeAheadMenu,
  waitForMenuIconsToLoad,
} from '@atlaskit/editor-test-helpers/page-objects/quick-insert';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';

const lastItemIsFocused =
  'document.querySelector("#typeahaed_decoration_element_id [data-index]:last-child [aria-selected=\\"true\\"]") === document.activeElement;';
const firstItemIsFocused =
  'document.querySelector("#typeahaed_decoration_element_id [data-index]:first-child [aria-selected=\\"true\\"]") === document.activeElement';

const secondItemUnselectedSelector =
  '#typeahaed_decoration_element_id [data-index]:nth-child(2) [aria-selected="false"]';
const secondItemSelectedSelector =
  '#typeahaed_decoration_element_id [data-index]:nth-child(2) [aria-selected="true"]';

const secondItemBackgroundColor = `window.getComputedStyle(document.querySelector('${secondItemUnselectedSelector}')).backgroundColor`;
const secondItemSelectedBackgroundColor = `window.getComputedStyle(document.querySelector('${secondItemSelectedSelector}')).backgroundColor`;
const secondItemBoxShadow = `window.getComputedStyle(document.querySelector('${secondItemSelectedSelector}')).boxShadow`;

describe('Quick Insert:', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  it('should render the quick insert menu', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
    await typeInEditorAtEndOfDocument(page, '/');
    await waitForTypeAheadMenu(page);
    await waitForMenuIconsToLoad(page, 6, 'svg');
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
    await snapshot(page);
  });

  it('should render the quick insert menu with custom panel when custom panel is enabled', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
      editorProps: {
        allowPanel: { allowCustomPanel: true, allowCustomPanelEdit: true },
      },
    });
    await typeInEditorAtEndOfDocument(page, '/');
    await waitForTypeAheadMenu(page);
    await page.type(selectors.lastEditorChildParagraph, 'custom');
    await waitForMenuIconsToLoad(page, 1, 'svg');
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
    await snapshot(page);
  });
});

describe('should render the quick insert menu, highlight and select the menu item when hovered', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  it('- Emoji Menu', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
    await typeInEditorAtEndOfDocument(page, ':');
    await waitForTypeAheadMenu(page);
    await waitForMenuIconsToLoad(page, 8, '.emoji-common-emoji-sprite');
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });

    // save a non hovered background value
    const defaultBgColor = await page.evaluate(secondItemBackgroundColor);
    await page.hover(secondItemUnselectedSelector);

    // expect the background value is different when hovered
    expect(await page.evaluate(secondItemSelectedBackgroundColor)).not.toBe(
      defaultBgColor,
    );
  });

  it('- Mentions Menu', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
    await typeInEditorAtEndOfDocument(page, '@');
    await waitForTypeAheadMenu(page);
    await waitForMenuIconsToLoad(page, 6, 'img');
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
    const defaultBgColor = await page.evaluate(secondItemBackgroundColor);
    await page.hover(secondItemUnselectedSelector);
    expect(await page.evaluate(secondItemSelectedBackgroundColor)).not.toBe(
      defaultBgColor,
    );
  });

  it('- General Menu', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
    await typeInEditorAtEndOfDocument(page, '/');
    await waitForTypeAheadMenu(page);
    await waitForMenuIconsToLoad(page, 6, 'svg');
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
    const defaultBgColor = await page.evaluate(secondItemBackgroundColor);
    await page.hover(secondItemUnselectedSelector);
    expect(await page.evaluate(secondItemSelectedBackgroundColor)).not.toBe(
      defaultBgColor,
    );
  });
});

describe('should render the quick insert menu and visible focus style should appear for list item when focused', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  it('- Emoji Menu', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
    await typeInEditorAtEndOfDocument(page, ':');
    await waitForTypeAheadMenu(page);
    await waitForMenuIconsToLoad(page, 6, '.emoji-common-emoji-sprite');
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
    await pressKey(page, ['ArrowDown']);
    // the focus ring uses css box shadow so we check if it exists
    expect(await page.evaluate(secondItemBoxShadow)).not.toBe('none');
  });

  it('- Mentions Menu', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
    await typeInEditorAtEndOfDocument(page, '@');
    await waitForTypeAheadMenu(page);
    await waitForMenuIconsToLoad(page, 6, 'img');
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
    await pressKey(page, ['ArrowDown']);
    expect(await page.evaluate(secondItemBoxShadow)).not.toBe('none');
  });

  it('- General Menu', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
    await typeInEditorAtEndOfDocument(page, '/');
    await waitForTypeAheadMenu(page);
    await waitForMenuIconsToLoad(page, 6, 'svg');
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
    await pressKey(page, ['ArrowDown']);
    expect(await page.evaluate(secondItemBoxShadow)).not.toBe('none');
  });
});

describe('should render the quick insert menu and up and down arrow key should focus the last and first item of the list', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  it('- Emoji Menu', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
    await typeInEditorAtEndOfDocument(page, ':');
    await waitForTypeAheadMenu(page);
    await waitForMenuIconsToLoad(page, 6, '.emoji-common-emoji-sprite');
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
    await pressKey(page, ['ArrowUp']);
    expect(await page.evaluate(lastItemIsFocused)).toBe(true);
    await pressKey(page, ['ArrowDown']);
    expect(await page.evaluate(firstItemIsFocused)).toBe(true);
  });

  it('- Mentions Menu', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
    await typeInEditorAtEndOfDocument(page, '@');
    await waitForTypeAheadMenu(page);
    await waitForMenuIconsToLoad(page, 6, 'img');
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
    await pressKey(page, ['ArrowUp']);
    expect(await page.evaluate(lastItemIsFocused)).toBe(true);
    await pressKey(page, ['ArrowDown']);
    expect(await page.evaluate(firstItemIsFocused)).toBe(true);
  });

  it('- General Menu', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
    await typeInEditorAtEndOfDocument(page, '/');
    await waitForTypeAheadMenu(page);
    await waitForMenuIconsToLoad(page, 6, 'svg');
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
    await pressKey(page, ['ArrowUp']);
    expect(await page.evaluate(lastItemIsFocused)).toBe(true);
    await pressKey(page, ['ArrowDown']);
    expect(await page.evaluate(firstItemIsFocused)).toBe(true);
  });
});
