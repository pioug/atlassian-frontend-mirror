import URL from 'url';
import Page, {
  BS_LOCAL_PROXY_DOMAIN,
} from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/utils/mobile/wd-utils';
import { ADFEntity } from '@atlaskit/adf-utils';
import { PORT } from '../../../../build/utils';

const EDITOR_WEB_SELECTOR = '#editor .ProseMirror';
const RENDERER_WEB_SELECTOR = '#renderer';

/**
 * Load & start the editor within the WebView
 *
 * The WebView loads the URL entered into the TextInput at the top
 * of the screen. Once loaded, we focus the editor.
 *
 * @useNextGen When true targets the Arch V3 release.
 */
export async function loadEditor(page: Page, useNextGen = false) {
  const url = `editor${useNextGen ? 'archv3' : ''}.html`;
  await loadBridgeInWebview(page, url);
  const [nativeContext, webViewContext] = await page.getContexts();

  // Wait for the editor to load within the WebView
  await page.switchContext(webViewContext);
  await page.waitForSelector(EDITOR_WEB_SELECTOR);

  // tap webview to set focus inside editor and show keyboard
  await page.switchContext(nativeContext);
  await page.tap(page.getAppWebviewSelector());
}

/**
 * Load & start the renderer within the WebView
 *
 * The WebView loads the URL entered into the TextInput at the top
 * of the screen.
 */
export async function loadRenderer(page: Page) {
  await loadBridgeInWebview(page, 'renderer.html');
  const [, webViewContext] = await page.getContexts();

  // Wait for the renderer to load within the WebView
  await page.switchContext(webViewContext);
  await page.waitForSelector(RENDERER_WEB_SELECTOR);
}

async function loadBridgeInWebview(page: Page, filePath: string) {
  const url = URL.resolve(`http://${BS_LOCAL_PROXY_DOMAIN}:${PORT}`, filePath);
  // Type the URL into the native input, and hit enter.
  // This triggers the WebView to load the provided URL.
  await page.addValue(page.getAppInputSelector(), url);
  await page.sendKeys([SPECIAL_KEYS.ENTER]);
}

export async function getADFContent(page: Page): Promise<ADFEntity> {
  return page.execute<ADFEntity>(() =>
    JSON.parse((window as any).bridge.getContent()),
  );
}

export async function setADFContent(page: Page, adf: ADFEntity) {
  return page.execute(_adf => {
    (window as any).bridge.setContent(_adf);
  }, adf);
}
