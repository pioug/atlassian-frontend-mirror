import {
  PuppeteerPage,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF, Device } from '../_utils';
import * as captionAdf from './__fixtures__/caption.adf.json';
import * as longCaptionAdf from './__fixtures__/caption-long.adf.json';
import * as complicatedCaptionAdf from './__fixtures__/caption-complicated.adf.json';
import {
  selectors,
  waitForAllMedia,
} from '../../__helpers/page-objects/_media';

const initRenderer = (page: PuppeteerPage, adf: any) => {
  return initRendererWithADF(page, {
    appearance: 'full-page',
    device: Device.LaptopMDPI,
    rendererProps: {
      adfStage: 'stage0',
      media: { featureFlags: { captions: true } },
    },
    adf,
  });
};

// FIXME These tests were flakey in the Puppeteer v10 Upgrade
describe.skip('Snapshot Test: Decision', () => {
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
