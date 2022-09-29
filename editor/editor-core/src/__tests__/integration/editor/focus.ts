import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  editable,
  updateEditorProps,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';

BrowserTestCase(
  'Should focus the editor when shouldFocus is true',
  {},
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
  {},
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
