import { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { goToEditorExampleWDExample } from '@atlaskit/editor-test-helpers/testing-example-page';
import { quickInsert } from '@atlaskit/editor-test-helpers/integration/helpers';
import { toolbarMenuItemsSelectors } from '@atlaskit/editor-test-helpers/page-objects/toolbar';

describe('Sticky Toolbar', () => {
  const startEditor = async (client: any): Promise<WebDriverPage> => {
    const page = await goToEditorExampleWDExample(
      client,
      'editor-core',
      'jira-clone',
    );

    return page;
  };

  BrowserTestCase(
    'Typeahead popup should be above the sticky toolbar',
    {
      skip: [],
    },
    async (client: any) => {
      const page = await startEditor(client);

      await page.setWindowSize(1000, 400);

      await quickInsert(page, ' ', false);

      const isLinkButtonVisible = await page.isClickable(
        toolbarMenuItemsSelectors[13], // Link Button
      );

      expect(isLinkButtonVisible).toBeFalsy();
    },
  );
});
