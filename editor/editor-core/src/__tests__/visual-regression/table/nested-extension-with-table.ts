// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/nested-table.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { clickFirstCell } from '@atlaskit/editor-test-helpers/page-objects/table';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: nested block extension with table', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  it(`looks correct`, async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1040, height: 600 },
    });
    await clickFirstCell(page, true);
    await snapshot(page);
  });
});
