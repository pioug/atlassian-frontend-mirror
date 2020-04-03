import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { Page } from '../../__helpers/page-objects/_types';
import { typeInEditorAtEndOfDocument } from '../../__helpers/page-objects/_editor';
import { waitForMenuIconsToLoad } from '../../__helpers/page-objects/_quick-insert';

describe('Quick Insert:', () => {
  let page: Page;
  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 700 },
    });
  });

  it('should render the quick insert menu', async () => {
    await typeInEditorAtEndOfDocument(page, '/');
    await page.waitForSelector('.fabric-editor-typeahead');
    await waitForMenuIconsToLoad(page);

    await snapshot(page);
  });
});
