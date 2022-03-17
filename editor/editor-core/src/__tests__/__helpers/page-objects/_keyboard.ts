import { animationFrame } from './_editor';
import { PuppeteerPage, PuppeteerKeyInput } from './_types';

export enum KEY {
  CONTROL = '\uE051',
  META = '\uE053',
  ALT = '\uE00A',
  SHIFT = '\uE008',
}

type KeyboardKey =
  | 'ArrowRight'
  | 'ArrowLeft'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'Shift'
  | 'Return'
  | 'Enter'
  | 'End'
  | 'Control'
  | 'KeyZ'
  | 'KeyX'
  | 'Alt'
  | 'y'
  | 'Meta'
  | 'Tab'
  | 'Space'
  | 'Backspace';

// https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#keyboardpresskey-options
type KeyPressOptions = {
  // Time to wait between keydown and keyup in milliseconds. Defaults to 0.
  delay?: number;
  // If specified, generates an input event with this text.
  text?: string;
};

// Default 5ms delay between key presses to reduce test flakiness
export async function pressKey(
  page: PuppeteerPage,
  key: KeyboardKey | KeyboardKey[],
  options: KeyPressOptions = { delay: 5 },
) {
  const keys = Array.isArray(key) ? key : [key];

  for (let key of keys) {
    await page.keyboard.press(key as PuppeteerKeyInput, options);
    await animationFrame(page);
  }
}

export async function pressKeyDown(page: PuppeteerPage, key: KeyboardKey) {
  await page.keyboard.down(key as PuppeteerKeyInput);
}

export async function pressKeyUp(page: PuppeteerPage, key: KeyboardKey) {
  await page.keyboard.up(key as PuppeteerKeyInput);
}

// simulate press of keys combination
export async function pressKeyCombo(page: PuppeteerPage, keys: KeyboardKey[]) {
  // dispatch key down events in parallel
  await Promise.all(
    keys.map((key) => page.keyboard.down(key as PuppeteerKeyInput)),
  );
  // dispatch key up events in parallel after short delay
  await page.waitForTimeout(5);
  await Promise.all(
    keys.map((key) => page.keyboard.up(key as PuppeteerKeyInput)),
  );
}

// Pass timeoutRequired if a delay of 100ms is required after every key press (to allow the page to render)
// Discourged to use timeoutRequired
export async function pressWithKeyModifier(
  page: PuppeteerPage,
  {
    modifierKeys,
    keys,
    timeoutRequired = false,
  }: {
    modifierKeys: KeyboardKey[];
    keys: KeyboardKey[];
    timeoutRequired?: boolean;
  },
) {
  for (let key of modifierKeys) {
    await page.keyboard.down(key as PuppeteerKeyInput);
    timeoutRequired && (await page.waitForTimeout(100));
  }

  for (let key of keys) {
    await page.keyboard.press(key as PuppeteerKeyInput);
    timeoutRequired && (await page.waitForTimeout(100));
  }

  for (let key of modifierKeys) {
    await page.keyboard.up(key as PuppeteerKeyInput);
    timeoutRequired && (await page.waitForTimeout(100));
  }
}
