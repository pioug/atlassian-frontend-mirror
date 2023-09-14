// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/table-inside-bodied-extension.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  insertRow,
  insertColumn,
  clickFirstCell,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: table insert/delete', () => {
  let page: PuppeteerPage;
  beforeAll(async () => {
    page = global.page;
  });

  beforeEach(async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1040, height: 500 },
    });
    await clickFirstCell(page, true);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should be able to insert row', async () => {
    await insertRow(page, 1);
  });

  it('should be able to insert column', async () => {
    await insertColumn(page, 1, 'left');
  });
});
