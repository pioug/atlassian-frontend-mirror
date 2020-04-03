import { snapshot, Appearance, initEditorWithAdf } from '../_utils';
import adf from './__fixtures__/card-xss.adf.json';
import { Page } from '../../__helpers/page-objects/_types';

describe('Cards:', () => {
  let page: Page;
  beforeEach(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 600, height: 400 },
    });
  });

  // TODO: https://product-fabric.atlassian.net/browse/ED-7721
  it.skip('should render invalid urls as invalid content', async () => {
    await snapshot(page);
  });
});
