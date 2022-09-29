import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { fullpage } from '@atlaskit/editor-test-helpers/integration/helpers';
import panelAdf from '../__fixtures__/custom-panel-adf.json';

// Vertical alignment only works for inline-block elements in Firefox.
BrowserTestCase(
  'panel: should render panel with icon vertically aligned with its content',
  { skip: ['safari', 'chrome'] }, // This issue was only occurring in Firefox browser - CETI-170.
  async (client: WebdriverIO.BrowserObject) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: {
        allowCustomPanel: true,
        allowCustomPanelEdit: true,
      },
      defaultValue: panelAdf,
    });

    const selector = `img[data-emoji-short-name=":check_mark:"]`;
    expect(await page.isExisting(selector)).toBe(true);
    const cssProperties = await page.getCSSProperty(selector, 'display');
    const displayProperty = cssProperties['value'];
    expect(displayProperty).toBe('inline-block');
  },
);
