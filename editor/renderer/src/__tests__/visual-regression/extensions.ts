import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForElementCount } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import { snapshot, initRendererWithADF } from './_utils';
import { selectors } from '../__helpers/page-objects/_expand';
import { selectors as rendererSelectors } from '../__helpers/page-objects/_renderer';
import * as nestedIframe from '../__fixtures__/extension-iframe-nested.adf.json';
import * as breakoutExtensions from '../__fixtures__/extension-breakout.adf.json';
import * as extensionLayouts from './__fixtures__/extension-layouts.adf.json';
import { animationFrame } from '../__helpers/page-objects/_renderer';
import { shadowClassNames } from '@atlaskit/editor-common/ui';

const initRenderer = async (
  page: PuppeteerPage,
  adf: any,
  viewport?: { width: number; height: number },
) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    device: Device.LaptopMDPI,
    viewport,
    adf,
  });
};

describe('Snapshot Test: Extensions', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should correctly stay within their parent layout regardless of specified width', async () => {
    await initRenderer(page, nestedIframe);
    await animationFrame(page);
    await waitForElementCount(
      page,
      `${rendererSelectors.extension}.${shadowClassNames.RIGHT_SHADOW}`,
      2,
    );
  });

  it('should correctly render breakout extensions', async () => {
    await initRenderer(page, breakoutExtensions, { width: 1280, height: 200 });
  });

  it('should correctly render extension layouts', async () => {
    await initRenderer(page, extensionLayouts, { width: 1280, height: 2000 });
    await page.waitForSelector(selectors.expand);
    await page.click(selectors.expandToggle);
  });
});
