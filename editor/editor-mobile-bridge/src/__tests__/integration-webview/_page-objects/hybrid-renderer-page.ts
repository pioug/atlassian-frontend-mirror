import URL from 'url';
import Page, {
  BS_LOCAL_PROXY_DOMAIN,
} from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { PORT } from '../../../../build/utils';

export const SELECTORS_WEB = {
  EDITOR: '#editor .ProseMirror',
  RENDERER: '#renderer',
};

/**
 * Load & start the renderer within the WebView
 *
 * The WebView loads the URL entered into the TextInput at the top
 * of the screen.
 *
 * This function will leave you in the webview context so that you
 * can immediately interact with the renderer bridge methods.
 */
export async function loadRenderer(page: Page, params = '') {
  const url = URL.resolve(
    `http://${BS_LOCAL_PROXY_DOMAIN}:${PORT}`,
    `renderer.html?${params}`,
  );
  await page.loadUrl(url, SELECTORS_WEB.RENDERER);
}
