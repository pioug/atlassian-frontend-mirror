// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  initFullPageEditorWithAdf,
  snapshot,
  waitForStablePositionThenSnapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import mediaInlineAdf from './__fixtures__/mediaInline.adf.json';

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Media Inline Toolbar:', () => {
  let page: PuppeteerPage;

  const mediaInlineLoadedViewSelector =
    '[data-testid="media-inline-card-loaded-view"]';

  const initEditor = async (
    adf: any,
    viewport: { width: number; height: number } = {
      width: 1280,
      height: 720,
    },
  ) => {
    await initFullPageEditorWithAdf(page, adf, undefined, viewport, {
      media: {
        allowMediaGroup: true,
        featureFlags: {
          mediaInline: true,
        },
      },
    });

    await page.waitForSelector(mediaInlineLoadedViewSelector, {
      visible: true,
    });
  };

  beforeEach(async () => {
    page = global.page;
    await initEditor(mediaInlineAdf);
    await page.click(mediaInlineLoadedViewSelector);
    await page.mouse.move(0, 0);
  });

  it('should display buttons in the correct order', async () => {
    const selector = '[aria-label="Media floating controls"]';
    await page.waitForSelector(selector);
    await waitForStablePositionThenSnapshot(page, selector);
  });

  it('should display view switcher dropdown correctly', async () => {
    await page.click('span[aria-label="Expand dropdown menu"]');
    const selector = '[aria-label="Media floating controls"]';
    await page.waitForSelector(
      '[aria-label="Popup"][data-editor-popup="true"]',
    );
    await waitForStablePositionThenSnapshot(page, selector);
  });

  it('should open media viewer when preview button clicked', async () => {
    await page.click('[data-testid="file-preview-toolbar-button"]');
    await page.waitForSelector('[data-testid="media-viewer-error"]');
    await snapshot(page);
  });

  it('should show red border while hovering over the delete button', async () => {
    const selector = '[aria-label="Media floating controls"]';
    await page.hover('[data-testid="media-toolbar-remove-button"]');
    await waitForStablePositionThenSnapshot(page, selector);
  });
});
