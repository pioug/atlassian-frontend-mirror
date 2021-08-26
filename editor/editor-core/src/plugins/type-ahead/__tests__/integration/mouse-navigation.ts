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
      'initial render should always highlight first item',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);
        await setProseMirrorTextSelection(page, { anchor: 1, head: 1 });

        await quickInsert(page, '', false);

        const selectedItem = await page.$(SELECTED_ITEM_SELECTOR);
        expect(await selectedItem.getAttribute('aria-label')).toEqual(
          'Action item',
        );
      },
    );

    BrowserTestCase(
      'mouse hover should update selected item',
      { skip: [] },
      async (client: any, testName: string) => {
        const page = await startEditor(client, spaceAtEnd);
        await setProseMirrorTextSelection(page, { anchor: 1, head: 1 });

        await quickInsert(page, 'heading', false);

        await page.hover('[aria-label="Heading 1"]');
        const selectedItem = await page.$(SELECTED_ITEM_SELECTOR);
        expect(await selectedItem.getAttribute('aria-label')).toEqual(
          'Heading 1',
        );
      },
    );
  });
});
