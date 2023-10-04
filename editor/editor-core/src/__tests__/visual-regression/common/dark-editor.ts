// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import adf from './__fixtures__/with-content.json';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { emojiSelectors } from '@atlaskit/editor-test-helpers/page-objects/emoji';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';
// Below import is temporarily exempted as it predated the introduction of the eslint rule
// Please avoid importing from src or dist directories of platform components
// eslint-disable-next-line no-restricted-imports
import { waitForAllMedia } from '@atlaskit/renderer/src/__tests__/__helpers/page-objects/_media';

describe.skip('Snapshot Test: Dark Editor', () => {
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

  // FIXME These tests were flakey in the Puppeteer v10 Upgrade
  it('should correctly render dark mode in mobile editor', async () => {
    await waitForLoadedBackgroundImages(page, emojiSelectors.standard, 10000);
    await waitForAllMedia(page, 5);
    await snapshot(page, { tolerance: 0.05, useUnsafeThreshold: true });
  });
});
