import { TableCssClassName } from '@atlaskit/editor-plugins/table/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickCellOptions,
  clickFirstCell,
  hoverCellOption,
  selectCellBackground,
  tableSelectors,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/default-table.adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Table context menu: cells background', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
  });

  it('should render the default cell background colors properly', async () => {
    await snapshot(page);
  });

  // FIXME DTR-1737 This test is skipped because current snapshot doesn't have a check mark icon on color palette.
  it.skip('should show cell background submenu on hover', async () => {
    await clickFirstCell(page);
    await hoverCellOption(page, tableSelectors.cellBackgroundText);
    await page.waitForSelector(`.${TableCssClassName.CONTEXTUAL_SUBMENU}`, {
      visible: true,
    });
    await snapshot(page);
  });

  it('should show correct background color in menu preview', async () => {
    await clickFirstCell(page);

    // default is white
    await clickCellOptions(page);
    await snapshot(page);
    await page.click(tableSelectors.contextualMenuButton); // dismiss

    await clickFirstCell(page);

    // change cell background colour
    await selectCellBackground({
      page,
      colorIndex: 3, // light blue color
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: 1,
      },
    });

    // verify preview has changed
    await clickCellOptions(page);
    await snapshot(page);
  });

  it(`should set background color to cells`, async () => {
    await clickFirstCell(page);
    await selectCellBackground({
      page,
      colorIndex: 3, // light blue color
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: 3,
      },
    });
    await snapshot(page);

    await selectCellBackground({
      page,
      colorIndex: 6, // light red color
      from: {
        row: 2,
        column: 1,
      },
      to: {
        row: 2,
        column: 3,
      },
    });
    await snapshot(page);

    await selectCellBackground({
      page,
      colorIndex: 8, // light gray color
      from: {
        row: 3,
        column: 1,
      },
      to: {
        row: 3,
        column: 3,
      },
    });
    await snapshot(page);
  });
});
