import {
  snapshot,
  Device,
  initRendererWithADF,
  deviceViewPorts,
} from '../_utils';
import * as resizeAdf from './__fixtures__/renderer-media.adf.json';
import * as commentRendererAdf from './__fixtures__/comment-renderer-media-adf.json';
import * as captionRendererAdf from './__fixtures__/caption-renderer-media-adf.json';
import * as longCaptionRendererAdf from './__fixtures__/caption-long-renderer-media-adf.json';
import * as wrappedCommentRendererAdf from './__fixtures__/comment-renderer-wrapped-media.adf.json';
import * as wrappedMediaAdf from './__fixtures__/wrapped-media.adf.json';
import * as wrappedMediaTextAdf from './__fixtures__/wrapped-media-text.adf.json';
import * as wrappedMediaTextSplitAdf from './__fixtures__/wrapped-media-text-split.adf.json';
import * as wrappedMediaTextLayoutAdf from './__fixtures__/wrapped-media-text-layout.adf.json';
import * as wrappedMediaTextLayoutSplitAdf from './__fixtures__/wrapped-media-text-layout-split.adf.json';
import * as wrappedMediaSmallAdf from './__fixtures__/wrapped-media-small.adf.json';
import * as layoutAdf from '../../../../examples/helper/media-resize-layout.adf.json';
import * as mediaImageWidthBiggerThanColumnWidth from './__fixtures__/media-image-width-bigger-than-column-width.adf.json';

import { waitForAllMedia } from '../../__helpers/page-objects/_media';
import { selectors as rendererSelectors } from '../../__helpers/page-objects/_renderer';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { RendererAppearance } from '../../../ui/Renderer/types';
import { BoundingBox } from 'puppeteer';

const devices = [
  Device.LaptopHiDPI,
  Device.LaptopMDPI,
  Device.iPad,
  Device.iPadPro,
  Device.iPhonePlus,
];

const initRenderer = async (
  page: PuppeteerPage,
  adf: any,
  device: Device = Device.Default,
  appearance: RendererAppearance = 'full-page',
  allowDynamicTextSizing: boolean = true,
) => {
  const viewport = {
    ...deviceViewPorts[device],
    // 1st we don't care about height anyway, because snapshot will be taken of whole container div
    // anyway. But because media only start to load when in viewport, we want to make sure viewport
    // is big enough to encompass entirety of a page right away, so we can wait for media to load before snapshotting.
    height: 10000,
  };

  await initRendererWithADF(page, {
    appearance,
    rendererProps: { allowDynamicTextSizing, disableHeadingIDs: true },
    adf,
    viewport,
  });
};

describe('Snapshot Test: Media', () => {
  let page: PuppeteerPage;
  let snapshotRenderer = async (clip?: BoundingBox) => {
    await page.waitForSelector(
      '[data-testid="media-file-card-view"][data-test-status="complete"]',
    );
    await page.waitForSelector(rendererSelectors.document);
    await snapshot(
      page,
      {},
      rendererSelectors.container,
      clip && {
        clip,
      },
    );
  };

  beforeEach(() => {
    page = global.page;
  });

  describe('resize', () => {
    devices.forEach(device => {
      it(`should correctly render for ${device}`, async () => {
        await initRenderer(page, resizeAdf, device);
        await waitForAllMedia(page, 17);
        await snapshotRenderer();
      });
    });
  });

  describe('layout', () => {
    devices.forEach(device => {
      it(`should correctly render for ${device}`, async () => {
        await initRenderer(page, layoutAdf, device);
        await waitForAllMedia(page, 16);
        await snapshotRenderer();
      });
    });
  });

  xdescribe('caption', () => {
    it('should render a caption', async () => {
      await initRenderer(page, captionRendererAdf, undefined, 'full-page');
    });
    it('should wrap a long caption correctly', async () => {
      await initRenderer(page, longCaptionRendererAdf, undefined, 'full-page');
    });
  });

  describe('comment appearance', () => {
    it('should renderer the same size for comment apperance', async () => {
      await initRenderer(page, commentRendererAdf, undefined, 'comment');
      await waitForAllMedia(page, 1);
      await snapshotRenderer();
    });

    it('should render correct sizes for wrapped media', async () => {
      await initRenderer(page, wrappedCommentRendererAdf, undefined, 'comment');
      await waitForAllMedia(page, 5);
      await snapshotRenderer();
    });
  });

  describe('wrapped media', () => {
    it('should render 2 media items in 1 line when wrapped', async () => {
      await initRenderer(page, wrappedMediaAdf);
      await waitForAllMedia(page, 6);
      await snapshotRenderer();
    });

    it('should render 2 media items in 1 line when wrapped with text in between', async () => {
      await initRenderer(page, wrappedMediaTextAdf);
      await waitForAllMedia(page, 2);
      await snapshotRenderer();
    });

    it('should render 2 media items in 2 lines when wrapped with a large enough width', async () => {
      await initRenderer(page, wrappedMediaTextSplitAdf);
      await waitForAllMedia(page, 2);
      await snapshotRenderer({
        height: 1000,
        width: 1000,
        x: 0,
        y: 0,
      });
    });

    it('should render 2 media items in 1 line when wrapped without dynamic text sizing', async () => {
      await initRenderer(
        page,
        wrappedMediaSmallAdf,
        Device.LaptopHiDPI,
        'full-page',
        false,
      );
      await waitForAllMedia(page, 2);
      await snapshotRenderer();
    });
  });

  describe('layout', () => {
    it('should render 2 media items in 1 line when wrapped with text in between', async () => {
      await initRenderer(page, wrappedMediaTextLayoutAdf);
      await waitForAllMedia(page, 2);
      await snapshotRenderer();
    });

    it('should render 2 media items in 2 lines when wrapped with a large enough width', async () => {
      await initRenderer(page, wrappedMediaTextLayoutSplitAdf);
      await waitForAllMedia(page, 2);
      await snapshotRenderer();
    });
  });

  describe('table', () => {
    it('[EDM-1081]: with image width bigger than column width', async () => {
      await initRenderer(page, mediaImageWidthBiggerThanColumnWidth);
      await waitForAllMedia(page, 1);
      await snapshotRenderer();
    });
  });
});
