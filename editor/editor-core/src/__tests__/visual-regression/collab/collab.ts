// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mainToolbarSelector } from '@atlaskit/editor-test-helpers/page-objects/toolbar';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  editorSelector,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { waitForElementCount } from '@atlaskit/visual-regression/helper';

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

// FIXME: This is failing in master-publish pipeline: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2440494/steps/%7B7c2a0f37-ea6f-4ffc-8a60-a5a7868dac4c%7D
describe.skip('Collab', () => {
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
