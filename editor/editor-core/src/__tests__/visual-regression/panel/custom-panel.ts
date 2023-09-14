// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/custom-panel.json';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { panelSelectors } from '@atlaskit/editor-test-helpers/page-objects/panel';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForEmojisToLoad } from '@atlaskit/editor-test-helpers/page-objects/emoji';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { waitForFloatingControl } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

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

  // FIXME: This test was automatically skipped due to failure on 24/05/2023: https://product-fabric.atlassian.net/browse/ED-18044
  it.skip('default custom panel light mode', async () => {
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
  });
});
