import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import {
  resizeMediaInPosition,
  waitForMediaToBeLoaded,
} from '@atlaskit/editor-test-helpers/page-objects/media';
import { insertExpand } from '@atlaskit/editor-test-helpers/page-objects/expand';
import { toggleBreakout } from '@atlaskit/editor-test-helpers/page-objects/layouts';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import adf from './__fixtures__/breakout-nodes-with-media.adf.json';

describe('Snapshot Test: Media inside of breakout nodes', () => {
  let page: PuppeteerPage;

  beforeAll(async () => {
    page = global.page;
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
  });

  it('should display using the breakout node width', async () => {
    await snapshot(page);
  });

  describe.each<[string, number]>([
    ['wide', 1],
    ['full-width', 2],
  ])('when the layout is %s', (mode, times) => {
    // FIXME These tests were flakey in the Puppeteer v10 Upgrade
    it.skip('can be resized more than the line height', async () => {
      await insertExpand(page);
      await toggleBreakout(page, times);
      await resizeMediaInPosition(page, 0, 300);
      await snapshot(page);
    });
  });
});
