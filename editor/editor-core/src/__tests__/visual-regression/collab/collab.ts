import {
  snapshot,
  editorSelector,
  initEditorWithAdf,
  Appearance,
} from '../_utils';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';

async function waitForCollabAvatars(page: any) {
  // Collab user avatars are external CSS background images
  const toolbarSelector = '.akEditor > div:first-child';
  const toolbarRightGroupSelector = `${toolbarSelector} > div:nth-child(2)`;
  await page.waitForSelector(toolbarRightGroupSelector);
  await waitForLoadedBackgroundImages(
    page,
    `${toolbarRightGroupSelector} span[role="img"]`,
  );
}

describe('Collab', () => {
  it('displays default collab UI', async () => {
    const page = global.page;
    const adf = {};

    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 600 },
      // editorProps: { allowFindReplace: true },
      withCollab: true,
    });
    await page.waitForSelector('[data-testid="editor-collab-badge"]');
    await waitForCollabAvatars(page);
    await snapshot(page, undefined, editorSelector);
  });
});
