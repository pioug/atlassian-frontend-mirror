import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../../_utils/afe-app-helpers';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';
import basicAdf from '../../__fixtures__/basic-content.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';

export default async () => {
  MobileTestCase(
    'Editor Text: Load ADF with different text nodes displayed',
    {},
    async client => {
      const page = await Page.create(client);
      await loadEditor(page);
      await setADFContent(page, basicAdf);
      await mobileSnapshot(page);
    },
  );
};
