import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import { RENDER_BUTTON_TESTID } from '../../components/EmojiButton';
import { RENDER_TRIGGER_BUTTON_TESTID } from '../../components/Trigger/Trigger';
import { PICKER_CONTROL_ID } from '../../components/ReactionPicker/ReactionPicker';
import { RENDER_SHOWMORE_TESTID } from '../../components/ShowMore';
import { RENDER_SELECTOR_TESTID } from '../../components/Selector';

const urlFocus = getExampleUrl(
  'elements',
  'reactions',
  'reaction-picker-focus',
);

/* Css used for the test */
const triggerButton = `[data-testid="${RENDER_TRIGGER_BUTTON_TESTID}"]`;
const emojiPicker = `#${PICKER_CONTROL_ID}`;
const selectorButtons = `[data-testid="${RENDER_BUTTON_TESTID}"]`;
const showMoreButton = `[data-testid="${RENDER_SHOWMORE_TESTID}"]`;
const selectorWrapper = `[data-testid="${RENDER_SELECTOR_TESTID}"]`;

BrowserTestCase('should load example', {}, async (client: any) => {
  const page = new Page(client);

  await page.goto(urlFocus);
  await page.waitForSelector(triggerButton);
  expect(await page.isExisting(triggerButton)).toBe(true);
});

BrowserTestCase(
  'should not auto focus the first emoji',
  {},
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlFocus);
    await page.click(triggerButton);

    await page.waitForSelector(emojiPicker);
    await page.waitForSelector(selectorButtons);
    await page.waitForSelector(showMoreButton);

    expect(await page.hasFocus(selectorButtons)).toBe(false);
  },
);

BrowserTestCase(
  'should focus on trigger button when `ESC` is pressed',
  {},
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlFocus);
    await page.click(triggerButton);

    await page.waitForSelector(emojiPicker);
    await page.waitForSelector(selectorButtons);
    await page.waitForSelector(showMoreButton);

    // esc to close the popup
    await page.keys('Escape');
    await page.waitForSelector(emojiPicker, {}, true);

    // should focus on trigger button when esc
    expect(await page.hasFocus(triggerButton)).toBe(true);
  },
);

BrowserTestCase(
  'should trap focus within reaction picker',
  {},
  async (client: any) => {
    const page = new Page(client);

    await page.goto(urlFocus);
    await page.click(triggerButton);

    await page.waitForSelector(emojiPicker);
    await page.waitForSelector(selectorButtons);
    await page.waitForSelector(showMoreButton);

    // tab to focus on first element
    await page.keys('Tab');
    expect(
      await page.hasFocus(`${selectorWrapper}:first-child ${selectorButtons}`),
    ).toBe(true);

    // shift tab should focus on last element
    await page.keys(['Shift', 'Tab'], true);
    expect(await page.hasFocus(showMoreButton)).toBe(true);
  },
);
