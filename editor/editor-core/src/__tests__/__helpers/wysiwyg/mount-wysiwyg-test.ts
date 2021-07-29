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
  editorProps: any;
  rendererProps: any;
}

export async function mountWysiwygTest(
  page: PuppeteerPage,
  options: WysiwygOptions,
): Promise<WysiwygMount> {
  const { editorProps, rendererProps } = options;

  await page.evaluate(
    (adf, props) => (window as any).__mount(adf, props),
    options.adf,
    { editorProps, rendererProps },
  );

  const [$renderer, $editor] = (await Promise.all([
    page.waitForSelector('#renderer-container'),
    page.waitForSelector('#editor-container'),
  ])) as PuppeteerElementHandle<Element>[];

  return { $renderer, $editor };
}
