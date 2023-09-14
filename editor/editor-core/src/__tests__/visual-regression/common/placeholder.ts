// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  editorSelector,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/noData-adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickToolbarMenu,
  ToolbarMenuItem,
  toolbarMenuItemsSelectors as selectors,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Placeholder', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 800, height: 300 },
    });
  });

  it('wraps long placeholder onto new line', async () => {
    await snapshot(page);
  });

  it('shifts on right align', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignment);
    await page.waitForSelector(selectors[ToolbarMenuItem.toolbarDropList]);
    await clickToolbarMenu(page, ToolbarMenuItem.alignmentRight);

    await snapshot(
      page,
      { useUnsafeThreshold: true, tolerance: 0.01 },
      editorSelector,
    );
  });

  it('shifts on center align', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.alignment);
    await page.waitForSelector(selectors[ToolbarMenuItem.toolbarDropList]);
    await clickToolbarMenu(page, ToolbarMenuItem.alignmentCenter);

    await snapshot(
      page,
      { useUnsafeThreshold: true, tolerance: 0.01 },
      editorSelector,
    );
  });
});
