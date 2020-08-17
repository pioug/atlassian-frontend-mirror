import { Device, snapshot, initFullPageEditorWithAdf } from '../_utils';
import adf from './__fixtures__/table-with-action.adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Table with action looks correct for fullpage:', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('default layout ', async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
  });
});
