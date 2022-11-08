import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/breakout-table-in-expand.adf.json';
import { clickFirstCell } from '@atlaskit/editor-test-helpers/page-objects/table';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: nested breakout table within expand', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  it(`looks correct`, async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1040, height: 800 },
    });
    await clickFirstCell(page, true);
    await snapshot(page);
  });
});
