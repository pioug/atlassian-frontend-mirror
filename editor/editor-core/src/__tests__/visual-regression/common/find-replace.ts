import {
  snapshot,
  initEditorWithAdf,
  Appearance,
  editorSelector,
} from '../_utils';
import adf from './__fixtures__/with-content.json';
import { Page } from '../../__helpers/page-objects/_types';
import { searchMatchClass } from '../../../plugins/find-replace/styles';

const toolbarBtnSelector = '[aria-label="Find and replace"]';
const findTextfieldSelector = 'input[name="find"]';
const decorationSelector = `.${searchMatchClass}`;

describe('Find/replace:', () => {
  let page: Page;
  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 600 },
      editorProps: { allowFindReplace: true },
    });
    await page.click(toolbarBtnSelector);
  });

  it('should render find/replace popup', async () => {
    await snapshot(page, undefined, editorSelector);
  });

  it('should render text highlights when a find is active', async () => {
    await page.type(findTextfieldSelector, 'e');
    await page.waitForSelector(decorationSelector);

    await snapshot(page, undefined, editorSelector);
  });
});