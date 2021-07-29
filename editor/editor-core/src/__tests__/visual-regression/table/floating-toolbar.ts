import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initFullPageEditorWithAdf } from '../_utils';
import adf from './__fixtures__/default-table.adf.json';
import {
  clickFirstCell,
  clickTableOptions,
  clickCellOptions,
  selectCellOption,
} from '../../__helpers/page-objects/_table';
import { waitForFloatingControl } from '../../__helpers/page-objects/_toolbar';

const floatingControlsAriaLabel = 'Table floating controls';
const dropdownListSelector =
  '[aria-label="Popup"] [data-role="droplistContent"]';

describe('Table floating toolbar:fullpage', () => {
  let page: PuppeteerPage;

  // FIXME: toolbar centering isn't right...
  beforeEach(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(page, adf);
    // Focus the table and select the first (non header row) cell
    await clickFirstCell(page, true);
    // Wait for floating table controls underneath the table
    await waitForFloatingControl(page, floatingControlsAriaLabel);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('display options', async () => {
    // Click table options within the floating toolbar
    await clickTableOptions(page);
    // Wait for the drop down list within floating table controls to be shown
    await page.waitForSelector(
      `[aria-label="${floatingControlsAriaLabel}"] ${dropdownListSelector}`,
    );
  });

  it('display cell options', async () => {
    // Click table cell options button within the selected cell
    await clickCellOptions(page);
    // Wait for table cell options drop down list to be shown
    await page.waitForSelector(dropdownListSelector);
  });

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  it.skip('display cell background', async () => {
    // Wait for table cell options drop down list to be shown, then
    // select background color option and wait for color picker popout to be shown
    await selectCellOption(page, 'Cell background');
    await page.waitForSelector(
      `${dropdownListSelector} .pm-table-contextual-submenu`,
    );
    await page.waitForSelector(
      `${dropdownListSelector} .pm-table-contextual-submenu`,
    );
  });
});
