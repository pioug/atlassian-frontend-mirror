// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { goToEditorExampleWDExample } from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { quickInsert } from '@atlaskit/editor-test-helpers/integration/helpers';

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
        '[aria-label*="Link"]',
      );

      expect(isLinkButtonVisible).toBeFalsy();
    },
  );
});
