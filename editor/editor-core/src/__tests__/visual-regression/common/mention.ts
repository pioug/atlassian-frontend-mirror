import { normalizeHexColor } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mentionSelectors } from '@atlaskit/editor-test-helpers/page-objects/mention';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { getElementComputedStyle } from '@atlaskit/editor-test-helpers/vr-utils/get-computed-style';
import { B50, DN80 } from '@atlaskit/theme/colors';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { getExampleUrl, loadPage } from '@atlaskit/visual-regression/helper';

import mentionAdf from './__fixtures__/mention-adf.json';

describe('Mention', () => {
  let page: PuppeteerPage;

  beforeAll(() => {
    page = global.page;
  });

  it('displays as selected when clicked on', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: mentionAdf,
      viewport: { width: 300, height: 150 },
    });

    await page.click(mentionSelectors.mention);

    const mentionBgColor = await getElementComputedStyle(
      page,
      '.akEditor [data-mention-id="0"] > span',
      'background-color',
    );

    const focusedMentionBgColor = B50;
    expect(normalizeHexColor(mentionBgColor)?.toUpperCase()).toBe(
      focusedMentionBgColor,
    );
  });
  it('Should repaint when theme mode changes', async () => {
    const url = getExampleUrl('editor', 'editor-core', 'kitchen-sink');

    const { page } = global;
    await loadPage(page, url);

    await page.keyboard.type('@carolyn\n');

    const selector = '.legacy-theme-changer';
    await page.waitForSelector(selector);
    await page.click(selector);

    await page.keyboard.type('dark theme');
    await page.keyboard.press('Enter');

    const mentionBgColor = await getElementComputedStyle(
      page,
      '.akEditor [data-mention-id="0"] > span',
      'background-color',
    );

    const darkThemeMentionBgColor = DN80;
    expect(normalizeHexColor(mentionBgColor)?.toUpperCase()).toBe(
      darkThemeMentionBgColor,
    );
  });
});
