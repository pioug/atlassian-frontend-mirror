import {
  clickFirstCell,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  editorCommentContentSelector,
  initCommentEditorWithAdf,
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/numbered-table.adf.json';
import tableWithContentAdf from './__fixtures__/numbered-table-with-content.adf.json';
import multipleTablesAdf from './__fixtures__/numbered-table-multiple.adf.json';
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { THEME_MODES } from '@atlaskit/theme/constants';

describe('Snapshot Test: numbered table', () => {
  let page: PuppeteerPage;

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

    // TODO: https://product-fabric.atlassian.net/browse/ED-13527
    it.skip('looks correct for comment', async () => {
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

    // TODO: https://product-fabric.atlassian.net/browse/ED-13527
    it.skip('should show insert button when mouse is hover numbered button', async () => {
      await initFullPageEditorWithAdf(
        page,
        adf,
        undefined,
        undefined,
        undefined,
        mode,
      );
      await clickFirstCell(page, true);
      await waitForFloatingControl(page, 'Table floating controls');
      await page.hover(tableSelectors.nthRowControl(2));
      await page.waitForSelector(tableSelectors.insertRowButton);
      await snapshot(page);
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
      await snapshot(page);
    });
  });
});
