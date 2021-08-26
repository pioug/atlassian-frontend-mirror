import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  typeInEditorAtEndOfDocument,
  selectors,
} from '../../__helpers/page-objects/_editor';
import {
  waitForTypeAheadMenu,
  waitForMenuIconsToLoad,
} from '../../__helpers/page-objects/_quick-insert';

describe('Quick Insert:', () => {
  let page: PuppeteerPage;
  beforeEach(async () => {
    page = global.page;
  });

  it('should render the quick insert menu', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
    });
    await typeInEditorAtEndOfDocument(page, '/');
    await waitForTypeAheadMenu(page);
    await waitForMenuIconsToLoad(page, 6);
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
    await snapshot(page);
  });

  it('should render the quick insert menu with custom panel when custom panel is enabled', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 800 },
      editorProps: { allowPanel: { UNSAFE_allowCustomPanel: true } },
    });
    await typeInEditorAtEndOfDocument(page, '/');
    await waitForTypeAheadMenu(page);
    await page.type(selectors.lastEditorChildParagraph, 'custom');
    await waitForMenuIconsToLoad(page, 1);
    await page.waitForSelector(selectors.typeaheadPopup, { visible: true });
    await snapshot(page);
  });
});
