import {
  PuppeteerPage,
  waitForElementCount,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  editorSelector,
  initEditorWithAdf,
  Appearance,
} from '../_utils';

async function waitForCollabAvatars(page: PuppeteerPage) {
  // Wait for both editors (and their toolbars)
  const editorToolbarSelector = '.akEditor > div:first-child';
  await waitForElementCount(page, editorToolbarSelector, 2);

  // Wait for avatar image downloads
  const avatarSelector = `span[class$="AvatarImage"][role="img"]`;
  await waitForElementCount(page, avatarSelector, 4); // 2 images x 2 editor instances
  await waitForLoadedBackgroundImages(page, avatarSelector);
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
