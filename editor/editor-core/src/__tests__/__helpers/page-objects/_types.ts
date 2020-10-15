import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';
import { isVisualRegression } from '../utils';

// Puppeteer and WebDriver share some common APIs but not all.
// If a helper method uses this TestPage type then ensure it
// correctly works for both platforms. If the implementation
// only works for a single platform, then cast it explictly
// to that platform's Page type.
export type TestPage = WebDriverPage | PuppeteerPage;

export type { PuppeteerPage } from '@atlaskit/visual-regression/helper';
export { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';

export function isPuppeteer(page: TestPage): page is PuppeteerPage {
  return isVisualRegression();
}
