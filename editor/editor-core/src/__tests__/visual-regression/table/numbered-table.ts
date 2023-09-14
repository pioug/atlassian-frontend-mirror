// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickFirstCell,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editorCommentContentSelector,
  initCommentEditorWithAdf,
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/numbered-table.adf.json';
import tableWithContentAdf from './__fixtures__/numbered-table-with-content.adf.json';
import multipleTablesAdf from './__fixtures__/numbered-table-multiple.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { THEME_MODES } from '@atlaskit/theme/constants';
import { isElementBySelectorInDocument } from '../../../test-utils';

const numberedColumnSelector = '.pm-table-numbered-column';
const undefinedThreshold = {};

describe('Snapshot Test: numbered table', () => {
  let page: PuppeteerPage;

  const checkIsInsertRowButtonInDocument = async () => {
    return await page.evaluate(
      isElementBySelectorInDocument,
      tableSelectors.insertRowButton,
    );
  };

  beforeAll(async () => {
    page = global.page;
  });

  describe.each(THEME_MODES)('Theme: %s', (theme) => {
    const mode = theme === 'dark' ? 'dark' : 'light';

    it('looks correct for fullpage', async () => {
      await initFullPageEditorWithAdf(
        page,
        multipleTablesAdf,
        Device.LaptopMDPI,
        undefined,
        undefined,
        mode,
      );
      await clickFirstCell(page, true);
      await waitForFloatingControl(page, 'Table floating controls');
      await snapshot(page);
    });

    it('looks correct for comment', async () => {
      await initCommentEditorWithAdf(
        page,
        multipleTablesAdf,
        Device.LaptopMDPI,
        mode,
      );
      await clickFirstCell(page, true);
      await waitForFloatingControl(page, 'Table floating controls');
      await snapshot(page, undefined, editorCommentContentSelector);
    });

    it('should show insert button when mouse is hover numbered button', async () => {
      await initFullPageEditorWithAdf(
        page,
        adf,
        undefined,
        undefined,
        undefined,
        mode,
      );

      await expect(checkIsInsertRowButtonInDocument()).resolves.toBeFalsy();

      await clickFirstCell(page, true);
      await waitForFloatingControl(page, 'Table floating controls');
      await page.hover(tableSelectors.nthRowControl(2));
      await page.waitForSelector(tableSelectors.insertRowButton);

      await expect(checkIsInsertRowButtonInDocument()).resolves.toBeTruthy();
    });

    it('should show numbered column correctly', async () => {
      await initFullPageEditorWithAdf(
        page,
        tableWithContentAdf,
        undefined,
        undefined,
        undefined,
        mode,
      );

      await snapshot(page, undefinedThreshold, numberedColumnSelector);
    });
  });
});
