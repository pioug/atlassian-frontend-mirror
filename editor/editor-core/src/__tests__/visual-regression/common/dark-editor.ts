// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { emojiSelectors } from '@atlaskit/editor-test-helpers/page-objects/emoji';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import { waitForAllMedia } from '@atlaskit/renderer/src/__tests__/__helpers/page-objects/_media';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';

import adf from './__fixtures__/with-content.json';

describe('Snapshot Test: Dark Editor', () => {
  let page: PuppeteerPage;
  beforeAll(async () => {
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.mobile,
      viewport: { width: 414, height: 3000 }, // Width iPhone
      mode: 'dark',
    });
  });

  // FIXME: TimeoutError: waiting for function failed: timeout 3000ms exceeded
  // Build: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2427533/steps/%7B6a39d646-d4bc-4e24-ab08-a1969e0dbe6e%7D/test-report
  it.skip('should correctly render dark mode in mobile editor', async () => {
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
    await waitForAllMedia(page, 5);
    await snapshot(page, { tolerance: 0.05, useUnsafeThreshold: true });
  });
});
