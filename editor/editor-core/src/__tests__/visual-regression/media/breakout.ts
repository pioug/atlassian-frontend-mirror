/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import { insertExpand } from '@atlaskit/editor-test-helpers/page-objects/expand';
import { toggleBreakout } from '@atlaskit/editor-test-helpers/page-objects/layouts';
import {
  resizeMediaInPosition,
  waitForMediaToBeLoaded,
} from '@atlaskit/editor-test-helpers/page-objects/media';
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import adf from './__fixtures__/breakout-nodes-with-media.adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Snapshot Test: Media inside of breakout nodes', () => {
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
    it('can be resized more than the line height', async () => {
      await insertExpand(page);
      await toggleBreakout(page, times);
      await resizeMediaInPosition(page, 0, 300);
      await snapshot(page);
    });
  });
});
