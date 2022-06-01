import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { selectElementWithText } from '../../__helpers/page-objects/_editor';
import { waitForFloatingControl } from '../../__helpers/page-objects/_toolbar';
import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import tableAdf from './__fixtures__/table-headers-with-headings.adf.json';

describe('Table headers with headings', () => {
  let page: PuppeteerPage;

  const initEditor = async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: tableAdf,
      viewport: { width: 1280, height: 920 },
    });
  };

  beforeAll(async () => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditor();
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should render first heading in header without margin-top', async () => {
    await page.waitForSelector('h1');
    await selectElementWithText({
      page,
      tag: 'h2',
      text: 'How are you?',
    });
    await waitForFloatingControl(page, 'Table floating controls');
  });
});
