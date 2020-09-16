import {
  PuppeteerPage,
  PuppeteerElementHandle,
} from '@atlaskit/visual-regression/helper';

export interface WysiwygMount {
  $renderer: PuppeteerElementHandle;
  $editor: PuppeteerElementHandle;
}

export interface WysiwygOptions {
  adf: any;
}

export async function mountWysiwygTest(
  page: PuppeteerPage,
  options: WysiwygOptions,
): Promise<WysiwygMount> {
  await page.evaluate(adf => (window as any).__mount(adf), options.adf);

  const [$renderer, $editor] = await Promise.all([
    page.waitForSelector('#renderer-container'),
    page.waitForSelector('#editor-container'),
  ]);

  return { $renderer, $editor };
}
