import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/with-content.json';
import { Page } from '../../__helpers/page-objects/_types';
import { emojiReadySelector } from '../../__helpers/page-objects/_emoji';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';
// TODO: https://product-fabric.atlassian.net/browse/ED-7721
describe.skip('Snapshot Test: Mobile Dark Editor', () => {
  let page: Page;
  beforeAll(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.mobile,
      viewport: { width: 414, height: 3000 }, // Width iPhone
      mode: 'dark',
    });
  });

  it('should correctly render dark mode in mobile editor', async () => {
    await waitForLoadedBackgroundImages(page, emojiReadySelector, 10000);
    await snapshot(page);
  });
});
