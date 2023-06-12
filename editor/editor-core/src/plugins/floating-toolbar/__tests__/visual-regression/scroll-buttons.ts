import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  getSelectorForTableCell,
  tableSelectors,
  clickTableOptions,
  floatingToolbarAriaLabel as floatingTableControlsAriaLabel,
  clickCellBackgroundInFloatingToolbar,
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
import { PuppeteerPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import { waitForEmojisToLoad } from '@atlaskit/editor-test-helpers/page-objects/emoji';
import {
  pressKey,
  pressKeyCombo,
} from '@atlaskit/editor-test-helpers/page-objects/keyboard';

import toolbarAdf from './__fixtures__/toolbar-adf.json';
import toolbarCustomPanelAdf from './__fixtures__/toolbar-adf-with-custom-panel.json';
import type { EditorProps } from '../../../../types';
import { isElementBySelectorInDocument } from '../../../../test-utils';

const dropdownListSelector =
  '[aria-label="Popup"] [data-role="droplistContent"]';
const colourPickerPopupSelector =
  '[aria-label="Color picker popup"] [role="radiogroup"]';
const scrollLeftButtonSelector = 'button[aria-label="Scroll left"]';
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
        tableCellOptionsInFloatingToolbar: true,
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

    describe('without snapshots', () => {
      beforeEach(async () => {
        await initPage();
      });

      // FIXME: This test was automatically skipped due to failure on 14/05/2023: https://product-fabric.atlassian.net/browse/ED-17833
      it.skip('should disable scroll buttons when colour picker open', async () => {
        // Act
        // Have to scroll right to see button
        await page.waitForSelector(scrollRightButtonSelector);
        await page.click(scrollRightButtonSelector);

        // Act
        // Click on cell background color button
        await clickCellBackgroundInFloatingToolbar(page);

        // Wait
        await page.waitForSelector(colourPickerPopupSelector);
        await page.waitForSelector(scrollLeftButtonSelector);

        // Assert
        const scrollLeftButtonDisabledExists = await page.evaluate(
          isElementBySelectorInDocument,
          `${scrollLeftButtonSelector}[disabled]`,
        );
        const scrollRightButtonDisabledExists = await page.evaluate(
          isElementBySelectorInDocument,
          `${scrollRightButtonSelector}[disabled]`,
        );

        expect(scrollLeftButtonDisabledExists).toBeTruthy();
        expect(scrollRightButtonDisabledExists).toBeTruthy();
      });

      it('should disable scroll buttons when dropdown open', async () => {
        // Act
        await clickTableOptions(page);

        // Wait
        let elementWaitingFor = 'dropdownList';
        try {
          await page.waitForSelector(
            `[aria-label="${floatingTableControlsAriaLabel}"] ${dropdownListSelector}`,
          );
          elementWaitingFor = 'scrollLeftButton';
          await page.waitForSelector(scrollLeftButtonSelector);
        } catch (e) {
          throw new Error(
            `Error waiting for ${elementWaitingFor}\nERROR MSG:\n${e}`,
          );
        }

        // Assert
        const scrollLeftButtonExists = await page.evaluate(
          isElementBySelectorInDocument,
          `${scrollLeftButtonSelector}[disabled]`,
        );
        const scrollRightButtonExists = await page.evaluate(
          isElementBySelectorInDocument,
          `${scrollRightButtonSelector}[disabled]`,
        );

        expect(scrollLeftButtonExists).toBeTruthy();
        expect(scrollRightButtonExists).toBeTruthy();
      });

      // FIXME: This test was automatically skipped due to failure on 11/06/2023: https://product-fabric.atlassian.net/browse/ED-18764
      it.skip('should retain scroll position on type', async () => {
        await page.click(scrollRightButtonSelector);
        await waitForTimeOut();

        const scrollPosBefore = await page.evaluate(() => {
          return (
            document.querySelector('[data-testid="floating-toolbar-items"]')
              ?.scrollLeft || 0
          );
        });

        expect(scrollPosBefore).toBeGreaterThan(0);

        await page.keyboard.type('test');

        const scrollPosAfter = await page.evaluate(() => {
          return (
            document.querySelector('[data-testid="floating-toolbar-items"]')
              ?.scrollLeft || 0
          );
        });

        const threshold = 10;
        expect(
          scrollPosAfter >= scrollPosBefore - threshold &&
            scrollPosAfter <= scrollPosBefore + threshold,
        ).toBe(true);
      });
    });

    describe('with popup items', () => {
      // skip Appearance.mobile
      // Skipped all tests since there are flaky test tickets for each appearance now
      it.skip.each([
        // FIXME: This test was automatically skipped due to failure on 23/05/2023: https://product-fabric.atlassian.net/browse/ED-17981
        // Appearance.fullWidth,
        // FIXME: This test was automatically skipped due to failure on 15/05/2023: https://product-fabric.atlassian.net/browse/ED-17737
        // Appearance.fullPage
        // FIXME: This test was automatically skipped due to failure on 23/05/2023: https://product-fabric.atlassian.net/browse/ED-17965
        // Appearance.comment,
        // FIXME: This test was automatically skipped due to failure on 28/04/2023: https://product-fabric.atlassian.net/browse/ED-17644
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
          await snapshot(page);
        },
      );
    });
  });
});
