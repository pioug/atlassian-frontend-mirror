// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickFirstCell,
  insertColumn,
  insertRow,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/table-inside-bodied-extension.adf.json';

// FIXME: Skipping theses tests as it has been failing on master on CI due to "Screenshot comparison failed" issue.
// Build URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2319963/steps/%7B31b3ca1c-6917-4861-88ed-d816d6fae22f%7D
describe.skip('Snapshot Test: table insert/delete', () => {
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
