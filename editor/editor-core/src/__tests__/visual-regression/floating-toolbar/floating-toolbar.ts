/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
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
import type { EditorProps } from '../../../types';
import type { PuppeteerPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import {
  pressKey,
  pressKeyCombo,
} from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import { waitForNoTooltip } from '@atlaskit/visual-regression/helper';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */

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

    // FIXME: This test was automatically skipped due to failure on 07/10/2023: https://product-fabric.atlassian.net/browse/ED-20352
    it.skip('should render and focus the block extension toolbar inside table', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 2, cell: 3 });
      await page.click(`${endCellSelector} .extensionView-content-wrap`);

      await waitForExtensionToolbar(page);
    });

    // FIXME: This test was automatically skipped due to failure on 07/10/2023: https://product-fabric.atlassian.net/browse/ED-20353
    it.skip('should render and focus the inline extension toolbar inside table', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 2, cell: 2 });
      await page.click(`${endCellSelector} .inlineExtensionView-content-wrap`);

      await waitForExtensionToolbar(page);
    });

    // FIXME: skip this test due to failure on https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/1793237/steps/%7Bbfeda82e-4c64-4434-a3e9-82f26105ba1f%7D/test-report
    it.skip('should render and focus the info extension toolbar inside table', async () => {
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

    // FIXME: This test was automatically skipped due to failure on 5/05/2023: https://product-fabric.atlassian.net/browse/ED-17753
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

      await page.mouse.move(0, 0);
      await waitForNoTooltip(page);
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

  // FIXME: This test was automatically skipped due to failure on 19/08/2023: https://product-fabric.atlassian.net/browse/ED-19607
  it.skip('should focus first menu item in when opening dropdown by keyboard', async () => {
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
