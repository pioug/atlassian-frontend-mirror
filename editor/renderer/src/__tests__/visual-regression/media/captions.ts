import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { Device } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  selectors,
  waitForAllMedia,
} from '../../__helpers/page-objects/_media';
import { initRendererWithADF, snapshot } from '../_utils';
import * as complicatedCaptionAdf from './__fixtures__/caption-complicated.adf.json';
import * as longCaptionAdf from './__fixtures__/caption-long.adf.json';
import * as captionAdf from './__fixtures__/caption.adf.json';

const initRenderer = (page: PuppeteerPage, adf: any) => {
  return initRendererWithADF(page, {
    appearance: 'full-page',
    device: Device.LaptopMDPI,
    rendererProps: {
      adfStage: 'stage0',
      media: { allowCaptions: true },
    },
    adf,
  });
};

describe('Snapshot Test: Decision', () => {
  let page: PuppeteerPage;
  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, undefined);
  });

  test('should render caption correctly', async () => {
    await initRenderer(page, captionAdf);
    await page.waitForSelector(selectors.caption);
    await waitForAllMedia(page, 1);
  });

  test('should render long caption correctly', async () => {
    await initRenderer(page, longCaptionAdf);
    await page.waitForSelector(selectors.caption);
    await waitForAllMedia(page, 1);
  });

  test('should render complicated caption correctly', async () => {
    await initRenderer(page, complicatedCaptionAdf);
    await page.waitForSelector(selectors.caption);
    await waitForAllMedia(page, 1);
    await waitForLoadedBackgroundImages(page);
  });
});
