// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickToolbarMenu,
  toolbarMenuItemsSelectors as selectors,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  editorSelector,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/noData-adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Placeholder', () => {
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
