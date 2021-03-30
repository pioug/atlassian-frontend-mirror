import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../../_utils/afe-app-helpers';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';
import {
  waitForAtLeastNumFileCards,
  resizeMediaSingle,
} from '../../_utils/media';
import mediaSingleAdf from '../../__fixtures__/media-single.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';

MobileTestCase(
  'Media: Resize a MediaSingle node',
  // TODO: Enable ios resizing test https://product-fabric.atlassian.net/browse/EDM-1845
  { skipPlatform: ['ios'] },
  async client => {
    const page = await Page.create(client);
    await loadEditor(page);
    await page.switchToWeb();
    await setADFContent(page, mediaSingleAdf);
    await waitForAtLeastNumFileCards(page, 1);

    await resizeMediaSingle(page, {
      units: 'pixels',
      amount: 50,
    });

    await mobileSnapshot(page);
  },
);
