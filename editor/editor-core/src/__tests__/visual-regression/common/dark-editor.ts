import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/with-content.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { emojiSelectors } from '../../__helpers/page-objects/_emoji';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';
import { waitForAllMedia } from '@atlaskit/renderer/src/__tests__/__helpers/page-objects/_media';

describe('Snapshot Test: Dark Editor', () => {
  let page: PuppeteerPage;
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
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
    await waitForAllMedia(page, 5);
    await snapshot(page);
  });
});
