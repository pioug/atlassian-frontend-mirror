// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { panelSelectors } from '@atlaskit/editor-test-helpers/page-objects/panel';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { unsupportedNodeSelectors } from '@atlaskit/editor-test-helpers/page-objects/unsupported';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import unsupportedBlockAdf from '../../__fixtures__/unsupported-block-adf.json';
import unsupportedInlineAdf from '../../__fixtures__/unsupported-inline-adf.json';
import unsupportedInlineInsidePanelAdf from '../../__fixtures__/unsupported-inline-inside-panel-adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Unsupport content', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  describe('Unsupported block', () => {
    it('displays as selected when node is clicked', async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: unsupportedBlockAdf,
        viewport: { width: 1040, height: 400 },
      });
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedBlock);
      await page.click(unsupportedNodeSelectors.unsupportedBlock);
    });
  });

  describe('Unsupported inline', () => {
    it('displays as selected when node is clicked', async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: unsupportedInlineAdf,
        viewport: { width: 1040, height: 400 },
      });
      await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
      await page.click(unsupportedNodeSelectors.unsupportedInline);
    });

    describe('when nested', () => {
      beforeEach(async () => {
        await initEditorWithAdf(page, {
          appearance: Appearance.fullPage,
          adf: unsupportedInlineInsidePanelAdf,
          viewport: { width: 1040, height: 400 },
        });
      });

      it('displays red border when selected and panel about to be deleted', async () => {
        await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
        await page.click(unsupportedNodeSelectors.unsupportedInline);
        await page.waitForSelector(panelSelectors.removeButton);
        await page.hover(panelSelectors.removeButton);
      });

      it("doesn't display red border when not selected and panel about to be deleted", async () => {
        await page.waitForSelector(unsupportedNodeSelectors.unsupportedInline);
        await page.click(panelSelectors.icon);
        await page.waitForSelector(panelSelectors.removeButton);
        await page.hover(panelSelectors.removeButton);
      });
    });
  });
});
