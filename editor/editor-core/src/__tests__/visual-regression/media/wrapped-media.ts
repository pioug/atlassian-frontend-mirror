import { Page } from 'puppeteer';
import { snapshot, initFullPageEditorWithAdf } from '../_utils';
import * as wrappedMediaAdf from './__fixtures__/wrapped-media.adf.json';
import * as wrappedInBlockMedia from './__fixtures__/wrapped-in-block-media.adf.json';
import { waitForMediaToBeLoaded } from '../../__helpers/page-objects/_media';
import * as nonResizableMedia from './__fixtures__/non-resizable-media.adf.json';
import { pressKey } from '../../__helpers/page-objects/_keyboard';

describe('Snapshot Test: Wrapped media', () => {
  let page: Page;
  const viewport = { width: 1024, height: 900 };

  beforeAll(async () => {
    page = global.page;
    /**
     * Set viewport size up front to avoid test flakiness.
     *
     * The selected media node shows the media floating toolbar underneath.
     *
     * The centering logic for the toolbar is based on the width of the
     * anchoring element. Media single nodes use a CSS transition on their
     * width property to ease the resizing in the event the viewport changes.
     *
     * This causes a delay for the floating toolbar to react to the resize
     * event which can cause test flakiness (misaligned toolbar).
     *
     * The reduced pixel values also aid in reducing the chance that the threshold
     * isn't met when a legitimate regression occurs.
     */
    await page.setViewport(viewport);
  });

  it('should have 2 media items in 1 line when wrapped', async () => {
    await initFullPageEditorWithAdf(page, wrappedMediaAdf, undefined, viewport);
    await pressKey(page, 'ArrowDown');
    await waitForMediaToBeLoaded(page);
    await snapshot(page);
  });

  it('should wrap properly inside other block nodes', async () => {
    await initFullPageEditorWithAdf(
      page,
      wrappedInBlockMedia,
      undefined,
      viewport,
    );

    await waitForMediaToBeLoaded(page);
    await snapshot(page);
  });

  it('should show media even if width is not present on a wrapped media item', async () => {
    const page = global.page;

    await initFullPageEditorWithAdf(
      page,
      nonResizableMedia,
      undefined,
      viewport,
      {
        media: {
          allowMediaSingle: true,
          allowResizing: false,
          allowMediaGroup: true,
        },
      },
    );
    await waitForMediaToBeLoaded(page);
    await snapshot(page);
  });
});
