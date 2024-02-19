// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  multiCellTableSelectionBottomRightToFirstCell,
  multiCellTableSelectionBottomRightToMiddleTopCell,
  multiCellTableSelectionTopLeftToBottomRight,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/table-with-text-and-empty-row.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('multi cell table selection', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  it(`should correctly highlight entire table selection`, async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
    });

    await multiCellTableSelectionTopLeftToBottomRight(page);
    await snapshot(page);
  });

  it(`should correctly highlight table selection from the second row`, async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
    });

    await multiCellTableSelectionBottomRightToFirstCell(page);
    await snapshot(page);
  });

  it(`should correctly highlight table selection from the second column`, async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
    });

    await multiCellTableSelectionBottomRightToMiddleTopCell(page);
    await snapshot(page);
  });
});
