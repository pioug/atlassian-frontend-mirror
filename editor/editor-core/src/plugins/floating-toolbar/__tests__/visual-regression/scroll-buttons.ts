import { waitForTooltip } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  getSelectorForTableCell,
  tableSelectors,
  clickTableOptions,
  clickCellBackgroundInFloatingToolbar,
  floatingToolbarAriaLabel as floatingTableControlsAriaLabel,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import {
  panelSelectors,
  openEmojiPopupInFloatingToolbar,
  openColorPopupInFloatingToolbar,
} from '@atlaskit/editor-test-helpers/page-objects/panel';
import toolbarAdf from './__fixtures__/toolbar-adf.json';
import toolbarCustomPanelAdf from './__fixtures__/toolbar-adf-with-custom-panel.json';
import {
  retryUntilStablePosition,
  waitForFloatingControl,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import { PuppeteerPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import type { EditorProps } from '../../../../types';

const dropdownListSelector =
  '[aria-label="Popup"] [data-role="droplistContent"]';
const colourPickerPopupSelector = '[aria-label="Popup"] [role="radiogroup"]';

interface InitOptions {
  appearance?: Appearance;
  doc?: any;
  editorProps?: Partial<EditorProps>;
}

describe('Floating toolbars:', () => {
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
      viewport: { width: 375, height: 700 },
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

  describe('with more items than the editor width can display', () => {
    beforeEach(async () => {
      await initEditor();
      const endCellSelector = getSelectorForTableCell({ row: 3, cell: 2 });
      await page.waitForSelector(endCellSelector);
      await retryUntilStablePosition(
        page,
        () => page.click(endCellSelector),
        tableSelectors.floatingToolbar,
      );
      await waitForFloatingControl(page, floatingTableControlsAriaLabel);
    });

    afterEach(async () => {
      await snapshot(
        page,
        { tolerance: 0.05, useUnsafeThreshold: true },
        undefined,
        {
          captureBeyondViewport: false,
        },
      );
    });

    it('should render scroll buttons', async () => {});

    it.skip('should render dropdown at the correct position and scroll buttons disabled when dropdown is opened', async () => {
      await clickTableOptions(page);
      await page.waitForSelector(
        `[aria-label="${floatingTableControlsAriaLabel}"] ${dropdownListSelector}`,
      );
    });

    it.skip('should scroll to the right when scroll right button is clicked', async () => {
      await page.click('button[aria-label="Scroll right"]');
      // wait for scroll to finish
      await page.waitForTimeout(200);
    });

    it.skip('should render colour picker at the correct position and scroll buttons disabled when dropdown is opened', async () => {
      await clickCellBackgroundInFloatingToolbar(page);
      await waitForTooltip(page, tableSelectors.cellBackgroundText);
      await page.waitForSelector(colourPickerPopupSelector);
    });
  });

  describe('with popup items', () => {
    // skip Appearance.mobile
    it.each([
      Appearance.fullWidth,
      Appearance.fullPage,
      Appearance.comment,
      Appearance.chromeless,
    ])(
      'should render color and emoji pickers dropdown is opened with "%s" appearance',
      async (appearance) => {
        await initEditor({
          appearance,
          doc: toolbarCustomPanelAdf,
          editorProps: {
            allowPanel: {
              allowCustomPanel: true,
              allowCustomPanelEdit: true,
            },
          },
        });

        await page.waitForSelector(panelSelectors.panelContent);
        await retryUntilStablePosition(
          page,
          () => page.click(panelSelectors.panelContent),
          panelSelectors.floatingToolbar,
        );
        await openEmojiPopupInFloatingToolbar(page);
        await snapshot(page);

        await openColorPopupInFloatingToolbar(page);
        await snapshot(page);
      },
    );
  });
});
