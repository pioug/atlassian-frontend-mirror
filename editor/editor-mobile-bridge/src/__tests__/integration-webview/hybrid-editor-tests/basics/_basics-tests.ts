import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../../_utils/afe-app-helpers';
import { loadEditor } from '../../_page-objects/hybrid-editor-page';
import fontSizeAdf from '../../__fixtures__/font-size.adf.json';
import { mobileSnapshot } from '../../_utils/snapshot';
import { validateFontSizeOverride } from '../../_utils/afe-app-helpers';

export default async () => {
  // TODO: ED-13890 - Fix inconsistent test snapshot diff
  //MobileTestCase(
  //  'Editor Text: Load ADF with different text nodes displayed',
  //  {},
  //  async (client) => {
  //    const page = await Page.create(client);
  //    await loadEditor(page);
  //    await setADFContent(page, basicAdf);
  //    await mobileSnapshot(page);
  //  },
  //);
  MobileTestCase(
    'Editor Text: Validate font size change at runtime',
    {},
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await validateFontSizeOverride(page, fontSizeAdf, '.ProseMirror', '24');
    },
  );
  MobileTestCase(
    'Editor Text: Validate font size larger than 34px is set to max font size of 34px.',
    {},
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await validateFontSizeOverride(page, fontSizeAdf, '.ProseMirror', '35');
    },
  );
  MobileTestCase(
    'Clickable Area: Mobile does not scroll when clicking in clickable area',
    {},
    async (client) => {
      const page = await Page.create(client);
      await loadEditor(page);
      await setADFContent(page, fontSizeAdf);
      await page.execute(() => {
        window.bridge?.setKeyboardControlsHeight('300');
      });
      await page.click('.editor-click-wrapper');
      await mobileSnapshot(page);
    },
  );
};
