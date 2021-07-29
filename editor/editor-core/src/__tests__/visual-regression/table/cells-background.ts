import { Device, initFullPageEditorWithAdf, snapshot } from '../_utils';

import {
  clickCellOptions,
  clickFirstCell,
  hoverCellOption,
  selectCellBackground,
  tableSelectors,
} from '../../__helpers/page-objects/_table';

import adf from './__fixtures__/default-table.adf.json';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { TableCssClassName } from '../../../plugins/table/types';
import { THEME_MODES } from '@atlaskit/theme/constants';

describe('Table context menu: cells background', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  describe.each(THEME_MODES)('Theme: %s', (theme) => {
    beforeEach(async () => {
      await initFullPageEditorWithAdf(
        page,
        adf,
        Device.LaptopMDPI,
        undefined,
        undefined,
        theme === 'dark' ? 'dark' : 'light',
      );
    });

    it('should render the default cell background colors properly', async () => {
      await snapshot(page);
    });

    it('should show cell background submenu on hover', async () => {
      await clickFirstCell(page);
      await hoverCellOption(page, tableSelectors.cellBackgroundText);
      await page.waitForSelector(`.${TableCssClassName.CONTEXTUAL_SUBMENU}`, {
        visible: true,
      });
      await snapshot(page);
    });

    // FIXME These tests were flakey in the Puppeteer v10 Upgrade
    it.skip('should show correct background color in menu preview', async () => {
      await clickFirstCell(page);

      // default is white
      await clickCellOptions(page);
      await snapshot(page);
      await page.click(tableSelectors.contextualMenu); // dismiss

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
});
