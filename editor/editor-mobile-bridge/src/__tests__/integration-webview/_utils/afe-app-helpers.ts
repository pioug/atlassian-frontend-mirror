import URL from 'url';
import Page, {
  BS_LOCAL_PROXY_DOMAIN,
} from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { ADFEntity } from '@atlaskit/adf-utils';
import { PORT } from '../../../../build/utils';

export const SELECTORS_WEB = {
  EDITOR: '#editor .ProseMirror',
  RENDERER: '#renderer',
};

/**
 * Load & start the editor within the WebView
 *
 * The WebView loads the URL entered into the TextInput at the top
 * of the screen. Once loaded, we focus the editor.
 *
 * This function will leave you in the webview context so that you
 * can immediately interact with the editor bridge methods.
 *
 * @param useNextGen When true targets the Arch V3 release.
 */
export async function loadEditor(page: Page, useNextGen = false) {
  const filename = `editor${useNextGen ? 'archv3' : ''}.html`;
  const url = URL.resolve(`http://${BS_LOCAL_PROXY_DOMAIN}:${PORT}`, filename);
  await page.loadUrl(url, SELECTORS_WEB.EDITOR);

  // Tap the webview to focus the editor and show the onscreen keyboard
  await page.tap(page.getAppWebviewSelector());

  // Leave the context set to web so that immediate editor bridge access is available.
  await page.switchToWeb();
}

/**
 * Load & start the renderer within the WebView
 *
 * The WebView loads the URL entered into the TextInput at the top
 * of the screen.
 *
 * This function will leave you in the webview context so that you
 * can immediately interact with the renderer bridge methods.
 */
export async function loadRenderer(page: Page) {
  const url = URL.resolve(
    `http://${BS_LOCAL_PROXY_DOMAIN}:${PORT}`,
    'renderer.html',
  );
  await page.loadUrl(url, SELECTORS_WEB.RENDERER);
}

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
