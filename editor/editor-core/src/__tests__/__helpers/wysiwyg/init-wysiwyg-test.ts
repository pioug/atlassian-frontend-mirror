import { RendererProps } from '@atlaskit/renderer';
import {
  getExampleUrl,
  navigateToUrl,
  PuppeteerElementHandle,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';
import { EditorProps } from '../../../types/editor-props';
import { mountWysiwygTest, WysiwygMount } from './mount-wysiwyg-test';

export interface WysiwygInitOptions {
  adf: any;
  editorSelector: string;
  rendererSelector: string;
  editorProps?: Partial<EditorProps>;
  rendererProps?: Partial<RendererProps>;
}

export interface WysiwygTest extends WysiwygMount {
  $rendererElement: PuppeteerElementHandle;
  $editorElement: PuppeteerElementHandle;
}

export async function initWysiwygTest(
  page: PuppeteerPage,
  options: WysiwygInitOptions,
): Promise<WysiwygTest> {
  const url = getExampleUrl('editor', 'editor-core', 'wysiwyg-testing');
  await navigateToUrl(page, url);

  const { $editor, $renderer } = await mountWysiwygTest(page, {
    adf: options.adf,
    editorProps: options.editorProps,
    rendererProps: options.rendererProps,
  });

  const [editorId, rendererId] = await Promise.all<string>([
    $editor.getProperty('id').then((p) => p!.jsonValue()),
    $renderer.getProperty('id').then((p) => p!.jsonValue()),
  ]);

  const [$editorElement, $rendererElement] = await Promise.all([
    (await page.waitForSelector(`#${editorId} ${options.editorSelector}`))!,
    (await page.waitForSelector(`#${rendererId} ${options.rendererSelector}`))!,
  ]);

  return {
    $editor,
    $renderer,
    $editorElement,
    $rendererElement,
  };
}
