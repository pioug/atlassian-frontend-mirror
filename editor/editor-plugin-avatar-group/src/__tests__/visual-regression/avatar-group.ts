// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

import adf from './fixtures/with-content.json';

describe('Avatar Group:', () => {
  let page: PuppeteerPage;

  const initEditor = async (
    adf: any,
    viewport = { width: 1280, height: 600 },
    showAvatarGroupAsPlugin: boolean,
    hideAvatarGroup: boolean,
  ) => {
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport,
      editorProps: {
        featureFlags: { showAvatarGroupAsPlugin: showAvatarGroupAsPlugin },
        hideAvatarGroup: hideAvatarGroup,
      },
      withCollab: true,
    });
  };

  it('should render avatar-group as plugin when showAvatarGroupAsPlugin feature flag is set true', async () => {
    await initEditor(adf, { width: 1000, height: 300 }, true, false);
    await page.waitForSelector('[data-testid="avatar-group-in-plugin"]');
    await snapshot(page, undefined, '[data-testid="avatar-group-in-plugin"]');
  });

  it('should not render avatar-group as plugin when showAvatarGroupAsPlugin feature flag is not set true', async () => {
    await initEditor(adf, { width: 1000, height: 300 }, false, false);
    await page.waitForSelector('[data-testid="avatar-group-outside-plugin"]');
    await snapshot(
      page,
      undefined,
      '[data-testid="avatar-group-outside-plugin"]',
    );
  });

  it('should not render avatar-group when hideAvatarGroup is true', async () => {
    await initEditor(adf, { width: 1000, height: 300 }, true, true);
    await page.waitForSelector('[data-testid="avatar-group-outside-plugin"]');
    await snapshot(
      page,
      undefined,
      '[data-testid="avatar-group-outside-plugin"]',
    );
  });

  it('should not render avatar-group when showAvatarGroupAsPlugin feature flag is false and hideAvatarGroup is true', async () => {
    await initEditor(adf, { width: 1000, height: 300 }, false, true);
    await page.waitForSelector('[data-testid="avatar-group-outside-plugin"]');
    await snapshot(
      page,
      undefined,
      '[data-testid="avatar-group-outside-plugin"]',
    );
  });
});
