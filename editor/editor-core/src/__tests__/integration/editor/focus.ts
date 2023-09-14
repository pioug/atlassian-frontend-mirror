import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  editable,
  updateEditorProps,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
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
