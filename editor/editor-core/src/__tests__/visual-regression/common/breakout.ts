// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { clickFirstParagraph } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickOnLayoutColumn,
  layoutSelectors,
  scrollToLayoutColumn,
  toggleBreakout,
} from '@atlaskit/editor-test-helpers/page-objects/layouts';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  retryUntilStablePosition,
  waitForFloatingControl,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
  updateEditorProps,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/columns.adf.json';
import layoutEmptyAdf from './__fixtures__/layout-empty.adf.json';

// Copied from 'packages/editor/editor-plugin-layout/src/toolbar.ts`
const layoutToolbarTitle = 'Layout floating controls';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Columns:', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
  });

  it('should place breakout at the start/end of the scroll', async () => {
    const columnNumber = 1;
    const offset = 100;

    await retryUntilStablePosition(
      page,
      () => clickOnLayoutColumn(page, columnNumber),
      `[aria-label*="${layoutToolbarTitle}"]`,
      1000,
      true,
    );
    await waitForFloatingControl(page, layoutToolbarTitle);
    await scrollToLayoutColumn(page, columnNumber, offset);
    await waitForFloatingControl(page, 'Go wide', undefined, false);
    await snapshot(page);
  });

  it('should place breakout button in correct position after visually hiding, re-rendering and then re-displaying the Editor', async () => {
    await initFullPageEditorWithAdf(page, layoutEmptyAdf, Device.LaptopHiDPI);
    await clickFirstParagraph(page, { topLevelParagraph: false });

    await waitForFloatingControl(page, layoutToolbarTitle);
    await page.waitForSelector(layoutSelectors.column, { visible: true });
    await page.waitForSelector(layoutSelectors.breakoutButton, {
      visible: true,
    });

    // first we make the node's layout wide
    await toggleBreakout(page, 1);

    // then we visually hide and disable the Editor
    await page.evaluate(() => {
      const container =
        document.querySelector<HTMLDivElement>('#editor-container');
      container!.style.display = 'none';
    });

    await updateEditorProps(page, { disabled: true });

    // then we re-enable and visually re-display the Editor
    await updateEditorProps(page, { disabled: false });

    await page.evaluate(() => {
      const container =
        document.querySelector<HTMLDivElement>('#editor-container');
      container!.style.display = 'unset';
    });

    await page.waitForSelector(layoutSelectors.column, { visible: true });
    // unfortunately we need to hide floating toolbar as its incorrectly positioned
    // during snapshot, but not in a way that's reproducible locally (and as its not the focus
    // of this test, we ignore it for now). We also cannot simply 'clip' the snapshot because
    // clipping affects layout (and fixes breakout button positioning).
    await hideFloatingToolbar(page);
    await snapshot(page);
  });
});

const hideFloatingToolbar = async (page: PuppeteerPage) => {
  await page.evaluate(
    (floatingToolbarSelector) => {
      const elem = document.querySelector(floatingToolbarSelector);
      elem && (elem.style.display = 'none');
    },
    [layoutSelectors.floatingToolbar],
  );
};
