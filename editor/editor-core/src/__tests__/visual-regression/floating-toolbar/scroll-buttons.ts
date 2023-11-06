/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
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
  retryUntilStablePosition,
  waitForFloatingControl,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import type { PuppeteerPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import {
  pressKey,
  pressKeyCombo,
} from '@atlaskit/editor-test-helpers/page-objects/keyboard';

import toolbarAdf from './__fixtures__/toolbar-adf.json';
import type { EditorProps } from '../../../types';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */

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
  });
});
