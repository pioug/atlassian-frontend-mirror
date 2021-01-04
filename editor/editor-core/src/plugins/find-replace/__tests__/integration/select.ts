import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { fullpage, editable } from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import replaceAdf from './__fixtures__/replace-adf.json';
import { findReplaceSelectors } from '../../../../__tests__/__helpers/page-objects/_find-replace';

const trigger = (page: Page): string =>
  page.isWindowsPlatform() ? 'Control' : 'Meta';

const chord = (page: Page, keys: string[]) => [trigger(page), ...keys, 'NULL'];

BrowserTestCase(
  'select.ts: Find on selection should select find input on activation',
  { skip: ['safari', 'edge', 'firefox'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: replaceAdf,
      allowFindReplace: true,
    });

    const editor = await page.$(editable);

    await editor.click();
    await page.keys(chord(page, ['Shift', 'Right Arrow']));
    await page.keys(chord(page, ['f']));

    const input = await page.$(findReplaceSelectors.findInput);
    const value = await input.getValue();
    const selectionStart = await input.getAttribute('selectionStart');
    const selectionEnd = await input.getAttribute('selectionEnd');

    expect(value).toEqual('one two');
    expect(selectionStart).toEqual('0');
    expect(selectionEnd).toEqual('7');
  },
);

BrowserTestCase(
  'select.ts: Find on selection should select find input on update',
  { skip: ['safari', 'edge', 'firefox'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: replaceAdf,
      allowFindReplace: true,
    });

    const editor = await page.$(editable);

    await page.keys(chord(page, ['f']));
    await editor.click();

    await page.keys(chord(page, ['Shift', 'Right Arrow']));
    await page.keys(chord(page, ['f']));

    const input = await page.$(findReplaceSelectors.findInput);
    const value = await input.getValue();
    const selectionStart = await input.getAttribute('selectionStart');
    const selectionEnd = await input.getAttribute('selectionEnd');

    expect(value).toEqual('one two');
    expect(selectionStart).toEqual('0');
    expect(selectionEnd).toEqual('7');
  },
);
