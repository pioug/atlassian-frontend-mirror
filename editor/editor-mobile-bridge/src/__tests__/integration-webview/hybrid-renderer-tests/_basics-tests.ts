import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
// import { setADFContent } from '../_utils/afe-app-helpers';
import { loadRenderer } from '../_page-objects/hybrid-renderer-page';
// import basicAdf from '../__fixtures__/basic-content.adf.json';
import fontSizeAdf from '../__fixtures__/font-size.adf.json';
// import { mobileSnapshot } from '../_utils/snapshot';
import { validateFontSizeOverride } from '../_utils/afe-app-helpers';

export default async () => {
  // TODO: Test is inconsistent.
  // MobileTestCase(
  //   'Renderer Text: Load ADF with different text nodes displayed',
  //   {},
  //   async client => {
  //     const page = await Page.create(client);
  //     await loadRenderer(page);
  //     await setADFContent(page, basicAdf, 'renderer');
  //     await mobileSnapshot(page);
  //   },
  // );

  MobileTestCase(
    'Renderer Text: Validate font size change at runtime',
    {},
    async (client) => {
      const page = await Page.create(client);
      await loadRenderer(page);
      await validateFontSizeOverride(
        page,
        fontSizeAdf,
        '.ak-renderer-document',
        '24',
        'renderer',
      );
    },
  );

  MobileTestCase(
    'Renderer Text: Validate font size larger than 34px is set to max font size of 34px.',
    {},
    async (client) => {
      const page = await Page.create(client);
      await loadRenderer(page);
      await validateFontSizeOverride(
        page,
        fontSizeAdf,
        '.ak-renderer-document',
        '35',
        'renderer',
      );
    },
  );
};
