import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  fullpage,
  quickInsert,
  setProseMirrorTextSelection,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { WebDriverPage } from '../../../../__tests__/__helpers/page-objects/_types';
import { onlyOneChar } from './__fixtures__/base-adfs';

const TYPE_AHEAD_MENU_LIST = `[aria-label="Popup"] [role="listbox"]`;
describe('type-ahead: multiple handlers', () => {
  const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: adf,
    });

    return page;
  };

  describe('when the mention item is inserted from the quick insert typeahead menu', () => {
    BrowserTestCase(
      'it should re open the type-ahead with the mention list',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await startEditor(client, onlyOneChar);
        await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });

        await page.keys('Enter');

        await quickInsert(page, 'mention', false);
        await page.waitForVisible(TYPE_AHEAD_MENU_LIST);

        await page.keys('Enter');

        // make sure the typeahead for mentions is open after press enter
        const result = await page.waitForVisible(
          `${TYPE_AHEAD_MENU_LIST} [data-mention-name]`,
        );

        expect(result).toBeTruthy();
      },
    );
  });

  describe('when the emoji item is inserted from the quick insert typeahead menu', () => {
    BrowserTestCase(
      'it should re open the type-ahead with the emoji list',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await startEditor(client, onlyOneChar);
        await setProseMirrorTextSelection(page, { anchor: 2, head: 2 });

        await page.keys('Enter');

        await quickInsert(page, 'emoji', false);
        await page.waitForVisible(TYPE_AHEAD_MENU_LIST);
        await page.keys('Enter');

        // make sure the typeahead for mentions is open after press enter
        const result = await page.waitForVisible(
          `${TYPE_AHEAD_MENU_LIST} .ak-emoji-typeahead-item`,
        );

        expect(result).toBeTruthy();
      },
    );
  });
});
