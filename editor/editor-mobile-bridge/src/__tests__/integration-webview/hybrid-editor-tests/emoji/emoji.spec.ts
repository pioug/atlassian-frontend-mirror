import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditor,
  isEmojiAdded,
} from '../../_page-objects/hybrid-editor-page';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/utils/mobile/keyboard/common-osk';
import { ANGRY_EMOJI, SLIGHT_SMILE_EMOJI } from '../../_utils/emoji';

MobileTestCase(
  'Emoji: Users should be able to see emoji if an emoji name is typed in full',
  {},
  async (client: any, testName: string) => {
    const page = await Page.create(client);
    await loadEditor(page);
    await page.tapKeys(':angry:');
    await page.switchToWeb();
    expect(await isEmojiAdded(page, ANGRY_EMOJI, '😠')).toBe(true);
  },
);

MobileTestCase(
  'Emoji: Users should see smile emoji if :) typed',
  {},
  async (client: any, testName: string) => {
    const page = await Page.create(client);
    await loadEditor(page);
    await page.tapKeys(':)');
    await page.tapKeys(SPECIAL_KEYS.SPACE);
    await page.switchToWeb();
    expect(await isEmojiAdded(page, SLIGHT_SMILE_EMOJI, '🙂')).toBe(true);
  },
);
