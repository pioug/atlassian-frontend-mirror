import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { insertMedia } from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { goToEditorTestingWDExample } from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectTable } from '@atlaskit/editor-test-helpers/page-objects/table';
import type { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import type Page from '@atlaskit/webdriver-runner/wd-wrapper';
import tableWithOneCellAdf from './_fixtures_/tableWithOneCellAdf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { resizeMediaSingle } from '@atlaskit/editor-test-helpers/page-objects/media';
import { assertWidthBeforeAndAfter, setupEditor } from './_utils';

BrowserTestCase(
  'resize-mediaSingle.ts: Does not throw for allowTables.advanced: false',
  { skip: [] },
  async (browserObject: BrowserObject) => {
    let page: Page = await goToEditorTestingWDExample(browserObject);
    await page.setWindowSize(1980, 1200);

    await setupEditor(page, {
      advancedAllowTables: false,
      allowLayouts: false,
      initialAdf: tableWithOneCellAdf,
    });

    await selectTable(page);

    /**
     * First part of the test. Normal table layout.
     */
    await insertMedia(page, ['high-res-image.jpg']);

    let startWidth = 742;
    let endWidth = 499;
    let widths = await resizeMediaSingle(page, {
      units: 'pixels',
      amount: -100,
    });

    // if resizing is aborted or the logic to decide whether to resize
    // throws resizing won't happen, thus the dimensions stay the same
    assertWidthBeforeAndAfter(
      {
        startWidth,
        endWidth,
      },
      widths,
    );
  },
);
