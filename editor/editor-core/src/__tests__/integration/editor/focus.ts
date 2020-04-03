import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { fullpage, editable, updateEditorProps } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  'Should focus the editor when shouldFocus is true',
  {},
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      shouldFocus: true,
    });

    expect(await page.hasFocus(editable)).toBeTruthy();
  },
);

BrowserTestCase(
  'Should focus the editor when shouldFocus is true and disabled changes to false',
  {},
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      shouldFocus: true,
      disabled: true,
    });

    expect(await page.hasFocus(editable)).toBeFalsy();

    await updateEditorProps(page, { disabled: false });

    expect(await page.hasFocus(editable)).toBeTruthy();
  },
);
