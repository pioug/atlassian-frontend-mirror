import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { ADFEntity } from '@atlaskit/adf-utils';

import { testMediaFileId, defaultCollectionName } from '../_mocks/utils';
import { mockFiles } from '../_mocks/editorTestSetup';

export const SELECTORS_WEB = {
  EDITOR: '#editor .ProseMirror',
  RENDERER: '#renderer',
};

/**
 * Fetch the ADF document as a JSON object from the editor
 */
export async function getADFContent(page: Page): Promise<ADFEntity> {
  await page.switchToWeb();
  return page.execute<ADFEntity>(() =>
    JSON.parse((window as any).bridge.getContent()),
  );
}

/**
 * Load an ADF document into the editor or renderer.
 *
 * @param adf The JSON representation of the ADF document.
 */
export async function setADFContent(
  page: Page,
  adf: ADFEntity,
  bridge: 'editor' | 'renderer' = 'editor',
) {
  await page.switchToWeb();
  const bridgeKey = bridge === 'renderer' ? 'rendererBridge' : 'bridge';
  return page.execute(
    (_adf, _bridgeKey) => {
      (window as any)[_bridgeKey].setContent(_adf);
    },
    adf,
    bridgeKey,
  );
}

/**
 * Clear all content from the editor back to a blank slate.
 */
export async function clearContent(page: Page) {
  await page.switchToWeb();
  return page.execute<void>(() => (window as any).bridge.clearContent());
}

/**
 * Mimic the flow of bridge calls to upload a media item
 */
export async function uploadMedia(page: Page, id = testMediaFileId) {
  const mediaFile = mockFiles.find((file) => file.id === id);
  if (!mediaFile) {
    throw new Error(`No mock file found with id ${id}`);
  }
  const defaultFileAttrs = {
    id: 'null',
    name: mediaFile.name,
    type: mediaFile.mimeType,
    dimensions: {
      width: 220,
      height: 140,
    },
  };
  await page.switchToWeb();
  await page.execute<void>((defaultFileAttrs) => {
    (window as any).bridge.onMediaPicked(
      'upload-preview-update',
      JSON.stringify({
        file: defaultFileAttrs,
      }),
    );
  }, defaultFileAttrs);

  const uploadEndFile = {
    ...defaultFileAttrs,
    publicId: id,
    collectionName: defaultCollectionName,
  };
  await page.execute<void>((file) => {
    (window as any).bridge.onMediaPicked(
      'upload-end',
      JSON.stringify({
        file,
      }),
    );
  }, uploadEndFile);
}

/**
 * Get the text color assigned to an element
 */
export async function getTextColor(page: Page, selector = 'p > span') {
  return page.execute((selector: any) => {
    return document.querySelectorAll(selector)[0].style.color;
  }, selector);
}

/**
 * Validate font size updates correctly when called.
 */
export async function validateFontSizeOverride(
  page: Page,
  adf: ADFEntity,
  selector: '.ProseMirror' | '.ak-renderer-document',
  updatedFontSize: string,
  bridge: 'editor' | 'renderer' = 'editor',
) {
  const bridgeKey = bridge === 'renderer' ? 'rendererBridge' : 'bridge';
  await page.execute<void>(
    (_bridgeKey, _updatedFontSize) => {
      (window as any)[_bridgeKey].updateSystemFontSize(_updatedFontSize);
    },
    bridgeKey,
    updatedFontSize,
  );
  await setADFContent(page, adf, bridge);
  const fontSize = await page.execute<{ p: string; h1: string }>(
    (_selector) => {
      const paragraph = document.querySelector(`${_selector} > p`);
      let pSize = '0';
      let hSize = '0';
      if (paragraph) {
        pSize = getComputedStyle(paragraph).fontSize;
      }
      const heading =
        document.querySelector(`${_selector} > .heading-wrapper h1`) ||
        document.querySelector(`${_selector} > h1`);
      if (heading) {
        hSize = getComputedStyle(heading).fontSize;
      }
      return { p: pSize, h1: hSize };
    },
    selector,
  );
  if (Number(updatedFontSize) < 34) {
    expect(fontSize.p).toBe(`${updatedFontSize}px`);
    expect(Math.round(parseFloat(fontSize.h1))).toBe(
      Math.round(Number(updatedFontSize) * 1.71428571),
    );
  } else {
    expect(fontSize.p).toBe('34px');
    expect(Math.round(parseFloat(fontSize.h1))).toBe(58);
  }
}
