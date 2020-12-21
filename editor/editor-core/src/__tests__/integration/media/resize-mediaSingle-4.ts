import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page, { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import { goToEditorTestingWDExample } from '../../__helpers/testing-example-helpers';
import mediaSingleInsideListWithinLayoutAdf from './_fixtures_/media-single-inside-list-within-layout.adf.json';
import { resizeMediaSingle } from '../../__helpers/page-objects/_media';
import { assertWidthBeforeAndAfter, setupEditor } from './resize-mediaSingle-1';

BrowserTestCase(
  'resize-mediaSingle.ts: Image within List is resized to 100% inside column of a two-column layout [EDM-1318]',
  { skip: [] },
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingWDExample(browserObject);
    await page.setWindowSize(1980, 1200);

    await setupEditor(page, {
      advancedAllowTables: true,
      allowLayouts: true,
      initialAdf: mediaSingleInsideListWithinLayoutAdf,
    });

    let startWidth = 157;
    let endWidth = 338;
    let widths = await resizeMediaSingle(page, {
      units: 'pixels',
      amount: 500,
    });

    assertWidthBeforeAndAfter(
      {
        startWidth,
        endWidth,
      },
      widths,
      'with two-column layout',
    );
  },
);
