import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  typeInEditorAtEndOfDocument,
  selectors,
} from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  waitForTypeAheadMenu,
  waitForMenuIconsToLoad,
} from '@atlaskit/editor-test-helpers/page-objects/quick-insert';
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';

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

describe('should render the quick insert menu and highlight the menu item when hovered', () => {
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
    await page.hover('[aria-label=":smile:"]');
    await snapshot(page);
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
    await page.hover('[data-mention-name="Darryl"]');
    await snapshot(page);
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
    await page.hover('[aria-label="Expand"]');
    await snapshot(page);
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
    await pressKey(page, ['ArrowDown', 'ArrowDown']);
    await snapshot(page);
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
    await pressKey(page, ['ArrowDown', 'ArrowDown']);
    await snapshot(page);
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
    await pressKey(page, ['ArrowDown', 'ArrowDown']);
    await snapshot(page);
  });
});
