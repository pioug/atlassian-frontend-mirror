import { typeInEditorAtEndOfDocument } from '@atlaskit/editor-test-helpers/page-objects/editor';
import { waitForTypeAheadMenu } from '@atlaskit/editor-test-helpers/page-objects/quick-insert';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
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

  // https://product-fabric.atlassian.net/browse/ED-15750
  it('should close typeahead popup and place cursor at the end, when undo and right-arrow key pressed', async () => {
    await page.waitForSelector(`button[aria-label*="Undo"]`);

    await typeInEditorAtEndOfDocument(page, '/Info');
    await waitForTypeAheadMenu(page);
    await page.click('button[aria-label="Info panel"]');

    await clickToolbarMenu(page, ToolbarMenuItem.undo);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.type('text after panel');

    await snapshot(page);
  });
});
