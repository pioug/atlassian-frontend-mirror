import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  quickInsert,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import { spaceAtEnd } from './__fixtures__/base-adfs';

describe('typeahead: mouse navigation', () => {
  const SELECTED_ITEM_SELECTOR = '[aria-selected="true"]';

  const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: adf,
    });

    return page;
  };

  describe('typeahead: mouse navigation', () => {
    BrowserTestCase(
      'initial render and then Arrow Down should always highlight the second item',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);
        await setProseMirrorTextSelection(page, { anchor: 1, head: 1 });

        await quickInsert(page, '', false);
        await page.keys('ArrowDown');
        const selectedItem = await page.$(SELECTED_ITEM_SELECTOR);
        expect(await selectedItem.getAttribute('aria-label')).toEqual(
          'Mention',
        );
      },
    );
  });
});
