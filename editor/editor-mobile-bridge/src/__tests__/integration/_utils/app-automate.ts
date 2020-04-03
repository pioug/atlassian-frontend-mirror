import url from 'url';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/utils/mobile';
import { ADFEntity } from '@atlaskit/adf-utils';

const mobileWebviewUrl = process.env.MOBILE_WEBVIEW_URL || '';

/**
 * Sets up editor tests for editor-mobile-bridge
 * We use Android & iOS apps uploaded to Browserstack for testing - these contain
 * an input field and a webview, we need to input the URL the webview should point
 * to and hit enter
 * Once loaded, we set focus inside the editor element
 */
export async function loadEditorBridgeInWebview(page: Page) {
  const [nativeContext, webViewContext] = await page.getContexts();
  const editorSelector = '#editor .ProseMirror';

  await loadBridgeInWebview(page, 'editor.html');

  // now wait for editor to load
  await page.switchContext(webViewContext);
  await page.waitForSelector(editorSelector, { timeout: 60000 });

  // tap webview to set focus inside editor and show keyboard
  await page.switchContext(nativeContext);
  await page.tap(page.getAppWebviewSelector());
}

/**
 * Sets up renderer tests for editor-mobile-bridge
 * We use Android & iOS apps uploaded to Browserstack for testing - these contain
 * an input field and a webview, we need to input the URL the webview should point
 * to and hit enter
 */
export async function loadRendererBridgeInWebview(page: Page) {
  await loadBridgeInWebview(page, 'renderer.html');
}

/**
 * Enter URL in app's text input and hit enter to trigger the webview loading the URL
 */
async function loadBridgeInWebview(page: Page, file: string) {
  await page.addValue(
    page.getAppInputSelector(),
    url.resolve(mobileWebviewUrl, file),
  );
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
