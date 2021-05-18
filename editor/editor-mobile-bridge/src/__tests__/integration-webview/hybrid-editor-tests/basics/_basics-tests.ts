import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../../_utils/afe-app-helpers';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';
import basicAdf from '../../__fixtures__/basic-content.adf.json';
import fontSizeAdf from '../../__fixtures__/font-size.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';
import { validateFontSizeOverride } from '../../_utils/afe-app-helpers';

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
  MobileTestCase(
    'Editor Text: Validate font size change at runtime',
    {},
    async client => {
      const page = await Page.create(client);
      await loadEditor(page);
      await validateFontSizeOverride(page, fontSizeAdf, '.ProseMirror');
    },
  );
};
