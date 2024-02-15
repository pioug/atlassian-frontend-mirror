/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  pressKey,
  pressKeyCombo,
} from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import {
  floatingToolbarAriaLabel as floatingTableControlsAriaLabel,
  getSelectorForTableCell,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import {
  retryUntilStablePosition,
  waitForFloatingControl,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import type { PuppeteerPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';

import type { EditorProps } from '../../../types';

import toolbarAdf from './__fixtures__/toolbar-adf.json';
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

// FIXME: Skipping theses tests as it has been failing on master on CI due to "Screenshot comparison failed" issue.
// Build URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2319963/steps/%7B31b3ca1c-6917-4861-88ed-d816d6fae22f%7D
describe.skip('Floating toolbars:', () => {
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
