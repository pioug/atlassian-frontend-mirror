import { initFullPageEditorWithAdf, snapshot } from '../_utils';
import * as panel from './__fixtures__/panel-adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import { panelSelectors } from '../../__helpers/page-objects/_panel';

describe('Panel:', () => {
  let page: Page;

  beforeAll(() => {
    page = global.page;
  });

  it('looks correct', async () => {
    await initFullPageEditorWithAdf(page, panel);
    await page.click(panelSelectors.panel);
    await snapshot(page);
  });
});
