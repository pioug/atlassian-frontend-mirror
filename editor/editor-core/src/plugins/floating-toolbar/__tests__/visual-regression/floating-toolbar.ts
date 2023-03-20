import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  getSelectorForTableCell,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import toolbarAdf from './__fixtures__/toolbar-adf.json';
import extendedToolbarAdf from './__fixtures__/toolbar-with-extension-buttons-adf.json';
import { waitForElementWithText } from '@atlaskit/editor-test-helpers/page-objects/editor';
import {
  clickOnExtension,
  waitForExtensionToolbar,
} from '@atlaskit/editor-test-helpers/page-objects/extensions';
import {
  isDropdownMenuItemFocused,
  retryUntilStablePosition,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import { EditorProps } from '../../../../types/editor-props';
import { PuppeteerPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import {
  pressKey,
  pressKeyCombo,
} from '@atlaskit/editor-test-helpers/page-objects/keyboard';

async function focusToolbar() {
  await pressKeyCombo(page, ['Alt', 'F10']);
}
interface InitOptions {
  appearance?: Appearance;
  doc?: any;
  editorProps?: Partial<EditorProps>;
}

describe('Floating toolbars:', () => {
  let page: PuppeteerPage;

  async function initEditor(
    options: {
      editorProps?: EditorProps;
      adf: string;
      enableManifest: boolean;
    } = {
      adf: toolbarAdf,
      enableManifest: false,
    },
  ) {
    const withTestExtensionProviders = options.enableManifest
      ? {
          floatingToolbarManifest: true,
        }
      : undefined;
    await initEditorWithAdf(page, {
      withTestExtensionProviders,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 700 },
      ...options,
    });
  }
  beforeEach(async () => {
    page = global.page;
  });

  describe('standard floating toolbars', () => {
    beforeEach(async () => {
      await initEditor();
    });

    afterEach(async () => {
      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
      await focusToolbar();
      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
    });

    it('should render and focus the block extension toolbar inside table', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 2, cell: 3 });
      await page.click(`${endCellSelector} .extensionView-content-wrap`);

      await waitForExtensionToolbar(page);
    });

    it('should render and focus the inline extension toolbar inside table', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 2, cell: 2 });
      await page.click(`${endCellSelector} .inlineExtensionView-content-wrap`);

      await waitForExtensionToolbar(page);
    });

    it('should render and focus the info extension toolbar inside table', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 3, cell: 3 });
      await page.click(`${endCellSelector} .inlineExtensionView-content-wrap`);

      await waitForExtensionToolbar(page);
    });

    it('should render and focus toolbar for macro', async () => {
      await clickOnExtension(
        page,
        'com.atlassian.confluence.macro.core',
        'expand',
      );
      await waitForExtensionToolbar(page);
    });
  });

  describe('standard floating toolbars', () => {
    beforeEach(async () => {
      await initEditor();
    });

    afterEach(async () => {
      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
    });

    // TODO: restore skipped test https://product-fabric.atlassian.net/browse/ED-16714
    it.skip('should render the table toolbar', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 3, cell: 2 });
      await page.waitForSelector(endCellSelector);
      await retryUntilStablePosition(
        page,
        () => page.click(endCellSelector),
        tableSelectors.floatingToolbar,
      );

      await waitForElementWithText(page, tableSelectors.tableOptionsText);

      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
      await focusToolbar();
    });

    // TODO: Restore skipped test https://product-fabric.atlassian.net/browse/ED-16714
    it.skip('should render the table toolbar', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 3, cell: 2 });
      await page.waitForSelector(endCellSelector);
      await retryUntilStablePosition(
        page,
        () => page.click(endCellSelector),
        tableSelectors.floatingToolbar,
      );

      await waitForElementWithText(page, tableSelectors.tableOptionsText);

      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
      await focusToolbar();
      await pressKey(page, ['ArrowRight', 'ArrowRight', 'ArrowRight']);
    });

    it('should remove danger styling from table when toolbar updates', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 3, cell: 2 });
      await page.waitForSelector(endCellSelector);
      await retryUntilStablePosition(
        page,
        () => page.click(endCellSelector),
        tableSelectors.floatingToolbar,
      );

      await waitForElementWithText(page, tableSelectors.tableOptionsText);
      await page.waitForSelector('button[aria-label="Remove"]');

      await page.hover('button[aria-label="Remove"]');
      // selection moves to next block component and updates the toolbar
      await page.keyboard.press('ArrowDown');
    });

    it('should remove danger styling from table when toolbar unmounts', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 1, cell: 1 });
      await page.waitForSelector(endCellSelector);
      await retryUntilStablePosition(
        page,
        () => page.click(endCellSelector),
        tableSelectors.floatingToolbar,
      );

      await waitForElementWithText(page, tableSelectors.tableOptionsText);
      await page.waitForSelector('button[aria-label="Remove"]');

      await page.hover('button[aria-label="Remove"]');
      await page.keyboard.press('ArrowUp');
    });

    it('should remove macro danger styling when toolbar updates', async () => {
      await clickOnExtension(
        page,
        'com.atlassian.confluence.macro.core',
        'expand',
      );
      await waitForExtensionToolbar(page);
      await page.waitForSelector('button[aria-label="Remove"]');

      await page.hover('button[aria-label="Remove"]');
      // move selection into table above
      await pressKey(page, ['ArrowUp', 'ArrowUp', 'ArrowUp']);
    });

    it('should remove macro danger styling when toolbar unmounts', async () => {
      await clickOnExtension(
        page,
        'com.atlassian.confluence.macro.core',
        'expand',
      );
      await waitForExtensionToolbar(page);
      await page.waitForSelector('button[aria-label="Remove"]');

      await page.hover('button[aria-label="Remove"]');
      await pressKey(page, ['ArrowDown', 'ArrowDown', 'ArrowDown']);
    });
  });

  describe('standard floating toolbars', () => {
    beforeEach(async () => {
      await initEditor();
    });

    afterEach(async () => {
      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
    });

    it('Escape should focus back to the inline extension', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 2, cell: 2 });
      await page.click(`${endCellSelector} .inlineExtensionView-content-wrap`);

      await waitForExtensionToolbar(page);
      await focusToolbar();
      await pressKey(page, ['Escape']);
    });
  });

  describe('with extension buttons', () => {
    afterEach(async () => {
      await snapshot(page, undefined, undefined, {
        captureBeyondViewport: false,
      });
    });

    it('should render toolbar with extension buttons', async () => {
      await initEditor({
        editorProps: {
          allowExtension: {
            allowExtendFloatingToolbars: true,
          },
          allowTables: true,
        },
        enableManifest: true,
        adf: extendedToolbarAdf,
      });

      const endCellSelector = getSelectorForTableCell({ row: 3, cell: 2 });
      await page.waitForSelector(endCellSelector);
      await retryUntilStablePosition(
        page,
        () => page.click(endCellSelector),
        tableSelectors.floatingToolbar,
      );
      await waitForElementWithText(page, 'Item with icon and label');
    });
  });
});

describe('Table Floating Toolbar with Cell options', () => {
  let page: PuppeteerPage;

  async function initEditor(options?: InitOptions) {
    const {
      appearance = Appearance.fullPage,
      doc = toolbarAdf,
      editorProps = {},
    } = options || {};
    const featureFlags = editorProps.featureFlags || {};

    await initEditorWithAdf(page, {
      appearance,
      viewport: { width: 1280, height: 700 },
      adf: doc,
      editorProps: {
        ...editorProps,
        featureFlags: {
          floatingToolbarCopyButton: true,
          tableCellOptionsInFloatingToolbar: true,
          ...featureFlags,
        },
      },
    });
  }

  beforeEach(async () => {
    page = global.page;
  });

  it('should highlight table rows & cols when delete row & delete cell options are focused', async () => {
    await initEditor();
    const endCellSelector = getSelectorForTableCell({ row: 3, cell: 2 });
    await page.waitForSelector(endCellSelector);
    await retryUntilStablePosition(
      page,
      () => page.click(endCellSelector),
      tableSelectors.floatingToolbar,
    );

    await waitForElementWithText(page, tableSelectors.tableOptionsText);
    await focusToolbar();
    await pressKey(page, ['ArrowRight', 'Enter']);
    await pressKey(page, ['ArrowDown', 'ArrowDown']);
    await snapshot(page);
    await pressKey(page, ['ArrowDown']);
    await snapshot(page);
  });

  it('should focus first menu item in when opening dropdown by keyboard', async () => {
    await initEditor();
    const endCellSelector = getSelectorForTableCell({ row: 3, cell: 2 });
    await page.waitForSelector(endCellSelector);
    await retryUntilStablePosition(
      page,
      () => page.click(endCellSelector),
      tableSelectors.floatingToolbar,
    );

    await waitForElementWithText(page, tableSelectors.tableOptionsText);
    await focusToolbar();
    await pressKey(page, ['Enter']);
    expect(
      await isDropdownMenuItemFocused(
        page,
        '[data-role="droplistContent"] button',
      ),
    ).toBe(true);
  });
});
