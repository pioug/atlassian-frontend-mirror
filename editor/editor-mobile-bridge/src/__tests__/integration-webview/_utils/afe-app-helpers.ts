import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { ADFEntity } from '@atlaskit/adf-utils';

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
