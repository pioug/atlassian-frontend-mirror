// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { typeInEditorAtEndOfDocument } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForTypeAheadMenu } from '@atlaskit/editor-test-helpers/page-objects/quick-insert';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForTooltip } from '@atlaskit/visual-regression/helper';

import adf from './adf/content-with-panel-adf.json';

describe('TypeAheadPopup', () => {
  let page: PuppeteerPage;

  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 1000, height: 350 },
      editorProps: {
        allowUndoRedoButtons: true,
      },
      adf,
    });
  });

  it('should close typeahead popup and place cursor at the end, when undo and right-arrow key pressed', async () => {
    await page.waitForSelector(`button[aria-label*="Undo"]`);

    await typeInEditorAtEndOfDocument(page, '/Info');
    await waitForTypeAheadMenu(page);
    await page.click('button[aria-label="Info panel"]');

    await clickToolbarMenu(page, ToolbarMenuItem.undo);
    await waitForTooltip(page);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.type('text after panel');

    await snapshot(page);
  });
});
