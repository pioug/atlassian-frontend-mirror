import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import { SPECIAL_KEYS } from '@atlaskit/webdriver-runner/utils/mobile';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import {
  loadEditorBridgeInWebview,
  getADFContent,
} from './_utils/app-automate';

MobileTestCase(
  'Composition: Typing on native keyboard',
  {},
  async (client, testName) => {
    const page = new Page(client);
    const [nativeContext, webViewContext] = await page.getContexts();
    await loadEditorBridgeInWebview(page);

    // type on native keyboard
    // each letter sends composition start/update event, space key sends composition end
    await page.switchContext(nativeContext);
    if (page.isIOS()) {
      // iOS auto-capitalises start of the line, so turn that off
      // todo: make this not needed ED-8409
      await page.sendKeys([SPECIAL_KEYS.SHIFT]);
    }
    await page.sendKeys(['d', 'o', 'g', SPECIAL_KEYS.SPACE]);

    await page.switchContext(webViewContext);
    const adfContent = await getADFContent(page);

    expect(adfContent).toMatchCustomDocSnapshot(testName);
  },
);
