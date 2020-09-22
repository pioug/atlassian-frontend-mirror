import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { typeInEditorAtEndOfDocument } from '../../__helpers/page-objects/_editor';
import {
  waitForTypeAheadMenu,
  waitForMenuIconsToLoad,
} from '../../__helpers/page-objects/_quick-insert';

describe('Quick Insert:', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
  });

  it('should render the quick insert menu', async () => {
    await typeInEditorAtEndOfDocument(page, '/');
    await waitForTypeAheadMenu(page);
    await waitForMenuIconsToLoad(page, 6);
    await snapshot(page);
  });
});
