// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/table-with-text-and-empty-row.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  multiCellTableSelectionTopLeftToBottomRight,
  multiCellTableSelectionBottomRightToFirstCell,
  multiCellTableSelectionBottomRightToMiddleTopCell,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

describe('multi cell table selection', () => {
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
