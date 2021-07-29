import {
  compareScreenshot,
  disableAllSideEffects,
  getExampleUrl,
  navigateToUrl,
  PuppeteerPage,
  PuppeteerScreenshotOptions,
  SideEffectOptions,
} from '@atlaskit/visual-regression/helper';
import { ThemeModes } from '@atlaskit/theme/types';
import { RendererAppearance } from '../../ui/Renderer/types';
import { RendererPropsOverrides } from '../__helpers/testing-example-helpers';
export { getBoundingClientRect } from '@atlaskit/editor-test-helpers/vr-utils';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

type WindowOverride = Window & {
  __mountRenderer: (props?: RendererPropsOverrides, adf?: Object) => void;
};

export enum Device {
  Default = 'Default',
  LaptopHiDPI = 'LaptopHiDPI',
  LaptopMDPI = 'LaptopMDPI',
  iPadPro = 'iPadPro',
  iPad = 'iPad',
  iPhonePlus = 'iPhonePlus',
}

export const deviceViewPorts = {
  [Device.Default]: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
  [Device.LaptopHiDPI]: { width: 1440, height: 900 },
  [Device.LaptopMDPI]: { width: 1280, height: 800 },
  [Device.iPadPro]: { width: 1024, height: 1366 },
  [Device.iPad]: { width: 768, height: 1024 },
  [Device.iPhonePlus]: { width: 414, height: 736 },
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
      ((window as unknown) as WindowOverride).__mountRenderer(props, adf);
    },
    props as any,
    adf as any,
  );
  await page.waitForSelector('.ak-renderer-document');
}

export type ViewPortOptions = {
  width: number;
  height: number;
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
  themeMode?: ThemeModes;
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
    themeMode,
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
  await mountRenderer(page, { appearance, themeMode, ...rendererProps }, adf);
}

export async function snapshot(
  page: PuppeteerPage,
  threshold: {
    tolerance?: number;
    useUnsafeThreshold?: boolean;
  } = {},
  selector: string = '#RendererOutput',
  screenshotOptions: PuppeteerScreenshotOptions = {},
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
