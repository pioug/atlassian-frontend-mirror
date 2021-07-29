import {
  snapshot,
  initEditorWithAdf,
  Appearance,
} from '../../../../__tests__/visual-regression/_utils';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import adf from '../../../../__tests__/visual-regression/common/__fixtures__/with-content.json';

describe('Avatar Group:', () => {
  let page: PuppeteerPage;

  const initEditor = async (
    adf: any,
    viewport = { width: 1280, height: 600 },
    showAvatarGroup: boolean,
  ) => {
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport,
      editorProps: {
        featureFlags: { showAvatarGroupAsPlugin: showAvatarGroup },
      },
      withCollab: true,
    });
  };

  it('should render avatar-group as plugin when showAvatarGroupAsPlugin feature flag is set true', async () => {
    await initEditor(adf, { width: 1000, height: 300 }, true);
    await page.waitForSelector('[data-testid="avatar-group-in-plugin"]');
    await snapshot(page, undefined, '[data-testid="avatar-group-in-plugin"]');
  });

  it('should not render avatar-group as plugin when showAvatarGroupAsPlugin feature flag is not set true', async () => {
    await initEditor(adf, { width: 1000, height: 300 }, false);
    await page.waitForSelector('[data-testid="avatar-group-outside-plugin"]');
    await snapshot(
      page,
      undefined,
      '[data-testid="avatar-group-outside-plugin"]',
    );
  });
});
