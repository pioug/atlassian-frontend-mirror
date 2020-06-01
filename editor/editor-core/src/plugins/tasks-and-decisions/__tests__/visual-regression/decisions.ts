import {
  snapshot,
  initFullPageEditorWithAdf,
  Device,
} from '../../../../__tests__/visual-regression/_utils';
import { Page } from '../../../../__tests__/__helpers/page-objects/_types';
import * as adjacentDecisionsAdf from './__fixtures__/adjacent-decisions-adf.json';

describe('decisions', () => {
  let page: Page;

  it('adjacent', async () => {
    page = global.page;
    await initFullPageEditorWithAdf(
      page,
      adjacentDecisionsAdf,
      Device.LaptopMDPI,
    );
    await snapshot(page);
  });
});
