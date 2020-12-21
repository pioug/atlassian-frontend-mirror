import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { fullpage, editable, updateEditorProps } from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  'Should focus the editor when shouldFocus is true',
  { skip: ['edge'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      shouldFocus: true,
    });

    expect(await page.hasFocus(editable)).toBeTruthy();
  },
);

BrowserTestCase(
  'Should focus the editor when shouldFocus is true and disabled changes to false',
  { skip: ['edge'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
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
