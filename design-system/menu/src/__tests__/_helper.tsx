// eslint-disable-next-line import/no-extraneous-dependencies
import type { Page } from 'puppeteer';

import {
  loadPage,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

type Options = {
  viewport: {
    width: number;
    height: number;
  };
};

const verifyElementIn =
  (url: string, options?: Options) =>
  async (selector: string, interact?: () => Promise<void>) => {
    const { page } = global;

    if (options?.viewport) {
      await page.setViewport(options.viewport);
    }

    await loadPage(page, url);
    await page.waitForSelector(selector);

    if (interact) {
      await interact();
    }

    expect(
      await takeElementScreenShot(page, selector),
    ).toMatchProdImageSnapshot();
  };

const hover = (selector: string): (() => Promise<void>) => {
  return async () => {
    const { page } = global;
    await page.hover(selector);
  };
};

const mouseDown = (selector: string): (() => Promise<void>) => {
  return async () => {
    const { page } = global;
    await page.hover(selector);
    await page.mouse.down();
  };
};

const click = (selector: string): (() => Promise<void>) => {
  return async () => {
    const { page } = global;
    await page.click(selector);
  };
};

const focus = (selector: string): (() => Promise<void>) => {
  return async () => {
    const { page } = global;
    await page.focus(selector);
  };
};

/**
 * Will screenshot and check an element at the specified timestamps.
 *
 * Pauses and steps through animations using the Web Animations API,
 * so should avoid flakiness.
 *
 * @param page the `puppeteer` page instance.
 * @param url the example url from `getExampleUrl`.
 * @param selector the selector of the element to screenshot.
 * @param timestampList an array of timestamps in milliseconds.
 * @experimental
 */
const verifyAnimationTimestamps = async (
  page: Page,
  url: string,
  selector: string,
  timestampList: number[],
) => {
  /**
   * We need to explicitly enable animations, which are disabled by default.
   */
  await loadPage(page, url, { allowedSideEffects: { animation: true } });
  await page.waitForSelector(selector);

  const element = await page.$(selector);
  if (element === null) {
    throw new Error(`No element matches the selector '${selector}'.`);
  }

  /**
   * Pausing all animations in the subtree to avoid any timing inconsistencies.
   * Screenshots won't happen exactly after setting the timestamp.
   */
  await page.evaluate((element: HTMLElement) => {
    // @ts-ignore - CI doesn't like the options provided
    const animations = element.getAnimations({ subtree: true });
    animations.forEach((animation) => {
      animation.pause();
    });
  }, element);

  /**
   * Sets all animations in the subtree to the same timestamp,
   * emulating what a user would actually see.
   */
  for (const timestamp of timestampList) {
    await page.evaluate(
      (element: HTMLElement, timestamp: number) => {
        // @ts-ignore - CI doesn't like the options provided
        const animations = element.getAnimations({ subtree: true });
        animations.forEach((animation) => {
          animation.currentTime = timestamp;
        });
      },
      element,
      timestamp,
    );

    const screenshot = await takeElementScreenShot(page, selector);
    expect(screenshot).toMatchProdImageSnapshot();
  }
};

export {
  click,
  focus,
  hover,
  mouseDown,
  verifyElementIn,
  verifyAnimationTimestamps,
};
