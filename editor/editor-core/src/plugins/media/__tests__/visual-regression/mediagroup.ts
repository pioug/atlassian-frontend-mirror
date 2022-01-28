import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initFullPageEditorWithAdf,
  Device,
} from '../../../../__tests__/visual-regression/_utils';
import mediaNodeInLastColumnMiddleRowDoc from './__fixtures__/media-node-middle-row-last-column.json';
import mediaNodeInLastColumnLastRowDoc from './__fixtures__/media-node-last-row-last-column.json';

const mediaCardSelector = '[data-testid="media-file-card-view"]';

async function initEditor(page: PuppeteerPage, content: any) {
  await initFullPageEditorWithAdf(page, content, Device.LaptopMDPI, undefined, {
    media: {
      allowMediaSingle: false,
      allowMediaGroup: true,
    },
  });

  await page.waitForSelector(mediaCardSelector, {
    visible: true,
  });
}

describe('Snapshot Test: Media Group', () => {
  let page: PuppeteerPage;

  beforeEach(() => {
    page = global.page;
  });

  describe('in editor', () => {
    describe('when media group node in last column middle row', () => {
      it('should be selected', async () => {
        await initEditor(page, mediaNodeInLastColumnMiddleRowDoc);
        await page.click(mediaCardSelector);
        await page.mouse.move(0, 0);
        await snapshot(page);
      });
    });

    describe('when media group node in last column last row', () => {
      it('should be selected', async () => {
        await initEditor(page, mediaNodeInLastColumnLastRowDoc);
        await page.click(mediaCardSelector);
        await page.mouse.move(0, 0);
        await snapshot(page);
      });
    });
  });
});
