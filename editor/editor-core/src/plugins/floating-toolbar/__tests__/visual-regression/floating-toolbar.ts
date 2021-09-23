import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '../../../../__tests__/visual-regression/_utils';
import {
  getSelectorForTableCell,
  tableSelectors,
} from '../../../../__tests__/__helpers/page-objects/_table';
import toolbarAdf from './__fixtures__/toolbar-adf.json';
import extendedToolbarAdf from './__fixtures__/toolbar-with-extension-buttons-adf.json';
import { waitForElementWithText } from '../../../../__tests__/__helpers/page-objects/_editor';
import {
  clickOnExtension,
  waitForExtensionToolbar,
} from '../../../../__tests__/__helpers/page-objects/_extensions';
import { retryUntilStablePosition } from '../../../../__tests__/__helpers/page-objects/_toolbar';
import { EditorProps } from '../../../../types/editor-props';
import { PuppeteerPage } from '../../../../__tests__/__helpers/page-objects/_types';

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

  afterEach(async () => {
    await snapshot(page);
  });

  describe('standard floating toolbars', () => {
    beforeEach(async () => {
      await initEditor();
    });

    // FIXME: This test was automatically skipped due to failure on 8/26/2021: https://product-fabric.atlassian.net/browse/ED-13676
    it.skip('should render the table toolbar', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 3, cell: 2 });
      await page.waitForSelector(endCellSelector);
      await retryUntilStablePosition(
        page,
        () => page.click(endCellSelector),
        tableSelectors.floatingToolbar,
      );

      await waitForElementWithText(page, tableSelectors.tableOptionsText);
    });

    it('should render the block extension toolbar inside table', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 2, cell: 3 });
      await page.click(`${endCellSelector} .extensionView-content-wrap`);

      await waitForExtensionToolbar(page);
    });

    it('should render the inline extension toolbar inside table', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 2, cell: 2 });
      await page.click(`${endCellSelector} .inlineExtensionView-content-wrap`);

      await waitForExtensionToolbar(page);
    });

    // FIXME: This test was automatically skipped due to failure on 9/17/2021: https://product-fabric.atlassian.net/browse/ED-13773
    it.skip('should render the info extension toolbar inside table', async () => {
      const endCellSelector = getSelectorForTableCell({ row: 3, cell: 3 });
      await page.click(`${endCellSelector} .inlineExtensionView-content-wrap`);

      await waitForExtensionToolbar(page);
    });

    it('should render toolbar for macro', async () => {
      await clickOnExtension(
        page,
        'com.atlassian.confluence.macro.core',
        'expand',
      );
      await waitForExtensionToolbar(page);
    });
  });

  describe('with extension buttons', () => {
    // FIXME: This test was automatically skipped due to failure on 8/26/2021: https://product-fabric.atlassian.net/browse/ED-13676
    it.skip('should render toolbar with extension buttons', async () => {
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
