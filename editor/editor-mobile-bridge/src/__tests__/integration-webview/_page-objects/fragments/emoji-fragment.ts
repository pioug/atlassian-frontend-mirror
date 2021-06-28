import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';

export const EMOJI_BACKGROUND_IMAGE_ELEMENT = '.emoji-common-emoji-sprite';

/**
 * Check whether emoji shortname exists in the DOM
 */
export async function isEmojiShortNamePresent(page: Page, shortName: string) {
  return await page.isExisting(`[shortname="${shortName}"]`);
}

/**
 * Check whether emoji text exists in the DOM
 */
export async function isTextPresent(page: Page, text: string) {
  return await page.isExisting(`[text="${text}"]`);
}

/**
 *
 * Wait for images loaded via the CSS background-image property.
 * Ensure elements using a `background-image` have finished loading their `url`.
 */
export const isEmojiBackgroundImageLoaded = (page: Page, selector: string) =>
  new Promise(async (resolve) => {
    await page.waitForSelector(selector);
    const { loaded } = await page.executeAsync(
      (nodeSelector, done) => {
        const url = (document.querySelector(
          nodeSelector,
        ) as HTMLElement)?.style.backgroundImage
          .replace('url("', '')
          .replace('")', '');

        if (!url) {
          done({ loaded: false });
        }

        const img = new Image();
        img.onload = () => {
          done({ loaded: true });
        };
        img.onerror = () => {
          done({ loaded: false });
        };
        img.src = url;
      },
      5000,
      selector,
    );

    resolve(loaded);
  });
