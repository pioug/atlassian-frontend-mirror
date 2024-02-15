/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */
import type {
  PuppeteerPage,
  PuppeteerScreenshotOptions,
  SideEffectOptions,
} from '@atlaskit/visual-regression/helper';
import {
  compareScreenshot,
  disableAllSideEffects,
  getExampleUrl,
  navigateToUrl,
} from '@atlaskit/visual-regression/helper';
import type { RendererAppearance } from '../../ui/Renderer/types';
import type { RendererPropsOverrides } from '../__helpers/testing-example-helpers';
import type { ViewportSize } from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
import {
  deviceViewPorts,
  Device,
} from '@atlaskit/editor-test-helpers/vr-utils/device-viewport';
/* eslint-disable import/no-extraneous-dependencies -- Removed from package.json to fix  circular depdencies */

type WindowOverride = Window & {
  __mountRenderer: (props?: RendererPropsOverrides, adf?: Object) => void;
};

export async function goToRendererTestingExample(
  page: PuppeteerPage,
  enableClickToEdit?: boolean,
) {
  const url = getExampleUrl(
    'editor',
    'renderer',
    enableClickToEdit ? 'testing-with-click-to-edit' : 'testing',
    global.__BASEURL__,
  );
  await navigateToUrl(page, url);
}

export async function mountRenderer(
  page: PuppeteerPage,
  props?: RendererPropsOverrides,
  adf?: Object,
) {
  await page.$eval(
    '#renderer-container',
    (_e, props, adf) => {
      // This will make sure we clean up prev. content of mounting countainer
      // before applying a new one. This to make sure we don't spill previous
      // tests DOM into a current one.
      const el = document.getElementById('#renderer-container');
      if (el) {
        el.innerHTML = '';
      }
      // @ts-ignore
      (window as unknown as WindowOverride).__mountRenderer(props, adf);
    },
    props as any,
    adf as any,
  );
  await page.waitForSelector('.ak-renderer-document');
}

export type ViewPortOptions = ViewportSize & {
  hasTouch?: boolean;
  isMobile?: boolean;
  isLandscape?: boolean;
  deviceScaleFactor?: number;
};

type InitRendererWithADFOptions = {
  appearance: RendererAppearance;
  adf?: Object;
  device?: Device;
  viewport?: ViewPortOptions;
  rendererProps?: RendererPropsOverrides;
  allowSideEffects?: SideEffectOptions;
  /** Swap renderer to 'dummy' editor when when renderer calls onUnhandledClick */
  enableClickToEdit?: boolean;
};

export async function initRendererWithADF(
  page: PuppeteerPage,
  {
    adf,
    appearance,
    device = Device.Default,
    viewport,
    rendererProps,
    allowSideEffects,
    enableClickToEdit,
  }: InitRendererWithADFOptions,
) {
  await goToRendererTestingExample(page, enableClickToEdit);

  // Set the viewport to the right one
  if (viewport) {
    await page.setViewport(viewport);
  } else {
    await page.setViewport(deviceViewPorts[device]);
  }

  // We disable possible side effects, like animation, transitions and caret cursor,
  // because we cannot control and affect snapshots
  // You can override this disabling if you are sure that you need it in your test
  await disableAllSideEffects(page, allowSideEffects);

  // Mount the renderer with the right attributes
  await mountRenderer(page, { appearance, ...rendererProps }, adf);
}

export async function snapshot(
  page: PuppeteerPage,
  threshold: {
    tolerance?: number;
    useUnsafeThreshold?: boolean;
  } = {},
  selector: string = '#RendererOutput',
  screenshotOptions: PuppeteerScreenshotOptions = {
    captureBeyondViewport: false,
  },
) {
  const { tolerance, useUnsafeThreshold } = threshold;
  const renderer = await page.$(selector);

  // Try to take a screenshot of only the renderer.
  // Otherwise take the whole page.
  const image = renderer
    ? await renderer.screenshot(screenshotOptions)
    : await page.screenshot(screenshotOptions);

  return compareScreenshot(image as string, tolerance, { useUnsafeThreshold });
}

export async function animationFrame(page: PuppeteerPage) {
  // Give browser time to render, waitForFunction by default fires on RAF.
  await page.waitForFunction('1 === 1');
}

export const waitForText = async (
  page: PuppeteerPage,
  selector: string,
  text: string,
) =>
  await page.waitForFunction(
    (selector: string, text: string) => {
      const items = Array.from(
        document.querySelectorAll<HTMLElement>(selector),
      );
      if (items) {
        return items.some((item) => {
          return item.innerText && item.innerText.includes(text);
        });
      }
    },
    { timeout: 5000 },
    selector,
    text,
  );

export async function setScrollPosition(
  page: PuppeteerPage,
  scrollContainerSelector: string,
  posX: number,
  posY: number,
  retryCount = 2,
): Promise<void> {
  // limit to 5 retries to avoid get stuck in recursion
  retryCount = retryCount < 1 || retryCount > 5 ? 1 : retryCount;
  await page.evaluate(
    (scrollContainerSelector: string, posX: number, posY: number) => {
      const scrollContainer = document.querySelector(
        scrollContainerSelector,
      ) as HTMLElement;
      if (!scrollContainer) {
        return;
      }
      scrollContainer.scrollTo(posX, posY);
      // wait for the scroll animation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 50);
      });
    },
    scrollContainerSelector,
    posX,
    posY,
  );

  //validate is scrolled is set as expected
  const { left, top } = await page.evaluate(
    (scrollContainerSelector: string) => {
      const scrollContainer = document.querySelector(
        scrollContainerSelector,
      ) as HTMLElement;
      if (!scrollContainer) {
        if (!scrollContainer) {
          return {};
        }
      }

      return {
        left: scrollContainer.scrollLeft,
        top: scrollContainer.scrollTop,
      };
    },
    scrollContainerSelector,
  );

  if (left !== posX || top !== posY) {
    if (retryCount > 1) {
      return await setScrollPosition(
        page,
        scrollContainerSelector,
        posX,
        posY,
        --retryCount,
      );
    }
    throw new Error(
      `failed to scroll element ${scrollContainerSelector},
      expected positions: x: ${posX}, y: ${posY},
      actual: positions: x: ${left}, y: ${top} `,
    );
  }
}

// gets max allowed width to that scroll contsnts can be scrolled (scrollWidth - offsetWidth)
export async function getMaxScrollWidth(
  page: PuppeteerPage,
  scrollContainerSelector: string,
) {
  return page.evaluate((scrollContainerSelector: string) => {
    const scrollContainer = document.querySelector(
      scrollContainerSelector,
    ) as HTMLElement;
    if (!scrollContainer) {
      return 0;
    }
    return scrollContainer.scrollWidth - scrollContainer.offsetWidth;
  }, scrollContainerSelector);
}
