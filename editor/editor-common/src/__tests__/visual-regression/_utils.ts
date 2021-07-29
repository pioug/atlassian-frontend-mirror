import {
  compareScreenshot,
  getExampleUrl,
  loadExampleUrl,
  PuppeteerPage,
} from '@atlaskit/visual-regression/helper';

export const DEFAULT_WIDTH = 800;
export const DEFAULT_HEIGHT = 600;

const adfInputSelector = '#adf-input';
const toggleSelector = '#toggle-adf-input';

export const loadFullPageEditorWithAdf = async (
  page: PuppeteerPage,
  adf: any,
) => {
  const url = getExampleUrl(
    'editor',
    'editor-core',
    'full-page-with-adf-import',
  );
  await loadExampleUrl(page, url);
  const $el = (await page.waitForSelector(adfInputSelector))!;
  await $el.click();
  await $el.evaluate(
    (el: any, content: any) => (el.textContent = content),
    JSON.stringify(adf, null, ' '),
  );
  await $el.type(' ');
  const $button = await page.waitForSelector(toggleSelector);
  await $button?.click();
  await page.waitForTimeout(1000);
};

export const snapshot = async (
  page: PuppeteerPage,
  threshold: {
    tolerance?: number;
    useUnsafeThreshold?: boolean;
  } = {},
  selector: string = '.ProseMirror',
) => {
  const { tolerance, useUnsafeThreshold } = threshold;
  const editor = await page.$(selector);

  // Try to take a screenshot of only the editor.
  // Otherwise take the whole page.
  let image;
  if (editor) {
    image = await editor.screenshot();
  } else {
    image = await page.screenshot();
  }

  return compareScreenshot(image as string, tolerance, { useUnsafeThreshold });
};
