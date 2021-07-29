import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import {
  resizeMediaInPosition,
  waitForMediaToBeLoaded,
  insertMedia,
} from '../../__helpers/page-objects/_media';
import { insertExpand } from '../../__helpers/page-objects/_expand';
import { toggleBreakout } from '../../__helpers/page-objects/_layouts';
import adf from './__fixtures__/breakout-nodes-with-media.adf.json';

describe('Snapshot Test: Media inside of breakout nodes', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
  });

  it('should display using the breakout node width', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      editorProps: {
        media: {
          allowMediaSingle: true,
          allowResizing: true,
        },
        allowTables: {
          advanced: true,
        },
      },
      viewport: { width: 1280, height: 4200 },
    });
    await waitForMediaToBeLoaded(page);
    await snapshot(page);
  });

  describe.each<[string, number]>([
    ['wide', 1],
    ['full-width', 2],
  ])('when the layout is %s', (mode, times) => {
    // FIXME These tests were flakey in the Puppeteer v10 Upgrade
    it.skip('can be resized more than the line height', async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        editorProps: {
          media: {
            allowMediaSingle: true,
            allowResizing: true,
          },
          allowTables: {
            advanced: true,
          },
        },
        viewport: { width: 1280, height: 800 },
      });

      await insertExpand(page);
      await insertMedia(page);
      await waitForMediaToBeLoaded(page);
      await toggleBreakout(page, times);
      await resizeMediaInPosition(page, 0, 300);
      await snapshot(page);
    });
  });
});
