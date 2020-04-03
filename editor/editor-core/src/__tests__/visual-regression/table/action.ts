import { Device, snapshot, initFullPageEditorWithAdf } from '../_utils';
import adf from './__fixtures__/table-with-action.adf.json';
import { Page } from '../../__helpers/page-objects/_types';

describe('Table with action looks correct for fullpage:', () => {
  let page: Page;

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
