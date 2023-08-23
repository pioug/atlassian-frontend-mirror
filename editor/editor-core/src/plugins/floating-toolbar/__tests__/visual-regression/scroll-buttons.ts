import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  getSelectorForTableCell,
  tableSelectors,
  floatingToolbarAriaLabel as floatingTableControlsAriaLabel,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import {
  panelSelectors,
  openEmojiPopupInFloatingToolbar,
  openColorPopupInFloatingToolbar,
} from '@atlaskit/editor-test-helpers/page-objects/panel';
import {
  retryUntilStablePosition,
  waitForFloatingControl,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import type { PuppeteerPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import { waitForEmojisToLoad } from '@atlaskit/editor-test-helpers/page-objects/emoji';
import {
  pressKey,
  pressKeyCombo,
} from '@atlaskit/editor-test-helpers/page-objects/keyboard';

import toolbarAdf from './__fixtures__/toolbar-adf.json';
import toolbarCustomPanelAdf from './__fixtures__/toolbar-adf-with-custom-panel.json';
import type { EditorProps } from '../../../../types';

const scrollRightButtonSelector = 'button[aria-label="Scroll right"]';

interface InitOptions {
  appearance?: Appearance;
  doc?: any;
  editorProps?: Partial<EditorProps>;
}

async function focusToolbar() {
  await pressKeyCombo(page, ['Alt', 'F10']);
}

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
        ...featureFlags,
      },
    },
  });
}

const initPage = async (): Promise<void> => {
  await initEditor();
  const endCellSelector = getSelectorForTableCell({ row: 3, cell: 2 });
  await page.waitForSelector(endCellSelector);
  await retryUntilStablePosition(
    page,
    () => page.click(endCellSelector),
    tableSelectors.floatingToolbar,
  );
  await waitForFloatingControl(page, floatingTableControlsAriaLabel);
};

const waitForTimeOut = async (timerMs: number = 200) => {
  await page.waitForTimeout(timerMs);
};

describe('Floating toolbars:', () => {
  beforeAll(async () => {
    page = global.page;
  });

  describe('with more items than can be displayed', () => {
    describe('snapshots', () => {
      beforeEach(async () => {
        await initPage();
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

      it('should render scroll buttons', async () => {
        focusToolbar();
        await pressKey(page, ['ArrowRight', 'ArrowRight', 'ArrowRight']);
      });

      it('should render scroll buttons', async () => {
        focusToolbar();
        await pressKey(page, ['ArrowLeft', 'ArrowRight']);
      });

      it('should scroll to the right when scroll right button is clicked', async () => {
        await page.click(scrollRightButtonSelector);
        await waitForTimeOut();
      });
    });

    describe('with popup items', () => {
      // skip Appearance.mobile
      it.skip.each([
        // FIXME: This test was manually skipped due to failure on 23/08/2023: https://product-fabric.atlassian.net/browse/ED-19658
        // Appearance.fullWidth,
        // FIXME: This test was manually skipped due to failure on 23/08/2023: https://product-fabric.atlassian.net/browse/ED-19659
        // Appearance.comment,
        // FIXME: This test was manually skipped due to failure on 23/08/2023: https://product-fabric.atlassian.net/browse/ED-19660
        // Appearance.chromeless,
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

          // This test is only concerned about whether the popup location looks correct, not the content
          // So we hide the content inside the colour picker and emojis picker to reduce flakiness
          await page.addStyleTag({
            content: `
              [data-test-id="color-picker-menu"] [role="radiogroup"],
              [data-emoji-picker-container] > div { visibility: hidden !important; }
            `,
          });

          await page.waitForSelector(panelSelectors.panelContent);
          await retryUntilStablePosition(
            page,
            () => page.click(panelSelectors.panelContent),
            panelSelectors.floatingToolbar,
          );
          await openEmojiPopupInFloatingToolbar(page);
          await waitForEmojisToLoad(page);
          await snapshot(page);

          await openColorPopupInFloatingToolbar(page);
          // Ensure no text selection leaks between tests and causes flaky VR snapshots
          await page.evaluate(() => document.getSelection()?.removeAllRanges());
          await snapshot(page);
        },
      );
    });
  });
});
