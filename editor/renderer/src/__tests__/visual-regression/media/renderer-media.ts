import {
  snapshot,
  Device,
  initRendererWithADF,
  deviceViewPorts,
} from '../_utils';
import * as resizeAdf from './__fixtures__/renderer-media.adf.json';
import * as commentRendererAdf from './__fixtures__/comment-renderer-media-adf.json';
import * as wrappedMediaADf from './__fixtures__/wrapped-media.adf.json';
import * as wrappedMediaSmallADF from './__fixtures__/wrapped-media-small.adf.json';

import * as layoutAdf from '../../../../examples/helper/media-resize-layout.adf.json';
import { selectors as mediaSelectors } from '../../__helpers/page-objects/_media';
import { selectors as rendererSelectors } from '../../__helpers/page-objects/_renderer';
import { Page, ScreenshotOptions } from 'puppeteer';
import { RendererAppearance } from '../../../ui/Renderer/types';

const devices = [
  Device.LaptopHiDPI,
  Device.LaptopMDPI,
  Device.iPad,
  Device.iPadPro,
  Device.iPhonePlus,
];

const initRenderer = async (
  page: Page,
  adf: any,
  device?: Device,
  appearance: RendererAppearance = 'full-page',
  allowDynamicTextSizing: boolean = true,
) =>
  await initRendererWithADF(page, {
    appearance,
    rendererProps: { allowDynamicTextSizing, disableHeadingIDs: true },
    adf,
    device,
  });

describe('Snapshot Test: Media', () => {
  let page: Page;
  let snapshotRenderer = async (options: ScreenshotOptions = {}) => {
    await page.waitForSelector(mediaSelectors.errorLoading); // In test should show overlay error
    await page.waitForSelector(rendererSelectors.document);
    await snapshot(page, {}, rendererSelectors.document, options);
  };

  beforeEach(() => {
    page = global.page;
  });

  describe('resize', () => {
    devices.forEach(device => {
      it(`should correctly render for ${device}`, async () => {
        await initRenderer(page, resizeAdf, device);
        await snapshotRenderer();
      });
    });
  });

  describe('layout', () => {
    const deviceDocumentHeight = {
      [Device.Default]: 6500,
      [Device.LaptopHiDPI]: 6700,
      [Device.LaptopMDPI]: 6600,
      [Device.iPadPro]: 6500,
      [Device.iPad]: 6150,
      [Device.iPhonePlus]: 4900,
    };

    devices.forEach(device => {
      it(`should correctly render for ${device}`, async () => {
        await initRenderer(page, layoutAdf, device);
        await snapshotRenderer({
          clip: {
            x: 0,
            y: 0,
            width: deviceViewPorts[device].width,
            height: deviceDocumentHeight[device],
          },
        });
      });
    });
  });

  describe('comment appearance', () => {
    it('should renderer the same size for comment apperance', async () => {
      await initRenderer(page, commentRendererAdf, undefined, 'comment');
      await snapshotRenderer();
    });
  });

  describe('wrapped media', () => {
    it('should render 2 media items in 1 line when wrapped', async () => {
      await initRenderer(page, wrappedMediaADf);
      await snapshotRenderer();
    });

    it('should render 2 media items in 1 line when wrapped without dynamic text sizing', async () => {
      await initRenderer(
        page,
        wrappedMediaSmallADF,
        Device.LaptopHiDPI,
        'full-page',
        false,
      );
      await snapshotRenderer();
    });
  });
});
