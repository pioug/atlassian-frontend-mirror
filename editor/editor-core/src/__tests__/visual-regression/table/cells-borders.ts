import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initFullPageEditorWithAdf } from '../_utils';
import adf from './__fixtures__/table-with-merged-rows.adf.json';

describe('Table cells borders:fullpage', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  it('display cell borders', async () => {
    await initFullPageEditorWithAdf(page, adf);
    await snapshot(page);
  });
});
