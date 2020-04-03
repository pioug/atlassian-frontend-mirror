import {
  getExampleUrl,
  navigateToUrl,
  disableAllSideEffects,
  compareScreenshot,
  SideEffectOptions,
} from '@atlaskit/visual-regression/helper';
import { Page } from 'puppeteer';
import { Props } from '../../ui/Renderer';
import { RendererAppearance } from '../../ui/Renderer/types';

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

export async function goToRendererTestingExample(page: Page) {
  const url = getExampleUrl(
    'editor',
    'renderer',
    'testing',
    global.__BASEURL__,
  );

  await navigateToUrl(page, url);
}

export type RendererPropsOverrides = { [T in keyof Props]?: Props[T] } & {
  showSidebar?: boolean;
};

export async function mountRenderer(
  page: Page,
  props?: RendererPropsOverrides,
  adf?: Object,
) {
  await page.$eval(
    '#renderer-container',
    (_e, props, adf) => {
      ((window as unknown) as WindowOverride).__mountRenderer(props, adf);
    },
    props,
    adf,
  );
}

type InitRendererWithADFOptions = {
  appearance: RendererAppearance;
  adf?: Object;
  device?: Device;
  viewport?: { width: number; height: number };
  rendererProps?: RendererPropsOverrides;
  allowSideEffects?: SideEffectOptions;
};

export async function initRendererWithADF(
  page: Page,
  {
    adf,
    appearance,
    device = Device.Default,
    viewport,
    rendererProps,
    allowSideEffects,
  }: InitRendererWithADFOptions,
) {
  await goToRendererTestingExample(page);

  // Set the viewport to the right one
  if (viewport) {
    await page.setViewport(viewport);
  } else {
    await page.setViewport(deviceViewPorts[device]);
  }

  // Mount the renderer with the right attributes
  await mountRenderer(page, { appearance, ...rendererProps }, adf);

  // We disable possible side effects, like animation, transitions and caret cursor,
  // because we cannot control and affect snapshots
  // You can override this disabling if you are sure that you need it in your test
  await disableAllSideEffects(page, allowSideEffects);
}

export async function snapshot(
  page: Page,
  threshold: {
    tolerance?: number;
    useUnsafeThreshold?: boolean;
  } = {},
  selector: string = '#RendererOutput',
) {
  const { tolerance, useUnsafeThreshold } = threshold;
  const renderer = await page.$(selector);

  // Try to take a screenshot of only the renderer.
  // Otherwise take the whole page.
  let image;
  if (renderer) {
    image = await renderer.screenshot();
  } else {
    image = await page.screenshot();
  }

  return compareScreenshot(image, tolerance, { useUnsafeThreshold });
}

export async function animationFrame(page: Page) {
  // Give browser time to render, waitForFunction by default fires on RAF.
  await page.waitForFunction('1 === 1');
}
