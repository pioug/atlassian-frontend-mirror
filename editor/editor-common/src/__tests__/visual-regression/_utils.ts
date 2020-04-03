import {
  compareScreenshot,
  getExampleUrl,
  loadExampleUrl,
} from '@atlaskit/visual-regression/helper';

export const DEFAULT_WIDTH = 800;
export const DEFAULT_HEIGHT = 600;

const adfInputSelector = '#adf-input';
const importAdfBtnSelector = '#import-adf';

export const loadFullPageEditorWithAdf = async (page: any, adf: any) => {
  const url = getExampleUrl(
    'editor',
    'editor-core',
    'full-page-with-adf-import',
  );
  await loadExampleUrl(page, url);
  await page.waitForSelector(adfInputSelector);
  await page.evaluate(
    (adfInputSelector: string, adf: object) => {
      (document as any).querySelector(adfInputSelector).value = JSON.stringify(
        adf,
      );
    },
    adfInputSelector,
    adf,
  );
  await page.click(importAdfBtnSelector);
};

export const snapshot = async (
  page: any,
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

  return compareScreenshot(image, tolerance, { useUnsafeThreshold });
};
