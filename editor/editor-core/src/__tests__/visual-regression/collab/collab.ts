import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForElementCount } from '@atlaskit/visual-regression/helper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mainToolbarSelector } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  snapshot,
  editorSelector,
  initEditorWithAdf,
  Appearance,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';

async function waitForCollabAvatars(page: PuppeteerPage) {
  // Wait for both editors (and their toolbars)
  await waitForElementCount(page, mainToolbarSelector, 2);

  // Wait for avatar image downloads
  const avatarSelectors = [
    `img[alt="Rick Sanchez"]`,
    `img[alt="Morty Smith"]`,
    `img[alt="Summer Smith"]`,
  ];

  for (const selector of avatarSelectors) {
    await waitForElementCount(page, selector, 2);
  }
}

describe('Collab', () => {
  it('displays default collab UI', async () => {
    const page = global.page;
    const adf = {};

    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 600 },
      withCollab: true,
    });

    // Wait for avatars within each instance
    await waitForCollabAvatars(page);
    await snapshot(page, undefined, editorSelector);
  });
});
