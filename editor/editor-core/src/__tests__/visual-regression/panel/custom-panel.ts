import { Device, snapshot, initFullPageEditorWithAdf } from '../_utils';
import adf from './__fixtures__/custom-panel.json';
import {
  PuppeteerPage,
  waitForTooltip,
} from '@atlaskit/visual-regression/helper';
import { panelSelectors } from '../../__helpers/page-objects/_panel';
import { waitForEmojisToLoad } from '../../__helpers/page-objects/_emoji';
import { waitForFloatingControl } from '../../__helpers/page-objects/_toolbar';

describe('Custom panel looks correct for fullpage:', () => {
  let page: PuppeteerPage;
  const allowPanel = { allowCustomPanel: true, allowCustomPanelEdit: true };
  const floatingControlsAriaLabel = 'Panel floating controls';
  const backgroundColorButtonAriaLabel = 'Background color';
  const backgroundColorButtonSelector = `button[aria-label*="${backgroundColorButtonAriaLabel}" i]`;
  const purpleColorButtonSelector = 'button[aria-label="Dark purple"]';

  beforeAll(async () => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('default custom panel light mode', async () => {
    await initFullPageEditorWithAdf(
      page,
      adf,
      Device.LaptopMDPI,
      undefined,
      {
        allowPanel,
      },
      'light',
    );
    await waitForEmojisToLoad(page);
    await page.waitForSelector(panelSelectors.panel);
  });

  it('default custom panel dark mode', async () => {
    await initFullPageEditorWithAdf(
      page,
      adf,
      Device.LaptopMDPI,
      undefined,
      {
        allowPanel,
      },
      'dark',
    );
    await waitForEmojisToLoad(page);
    await page.waitForSelector(panelSelectors.panel);
  });

  it('displays correctly with opened color picker in the floating toolbar in the light mode', async () => {
    await initFullPageEditorWithAdf(
      page,
      adf,
      Device.LaptopMDPI,
      undefined,
      {
        allowPanel,
      },
      'light',
    );
    await page.waitForSelector(panelSelectors.panel);
    await page.click(panelSelectors.panelContent);
    await waitForFloatingControl(page, floatingControlsAriaLabel);
    await page.click(backgroundColorButtonSelector);
    await page.waitForSelector(purpleColorButtonSelector);
    await waitForTooltip(page);
  });
});
