import adf from './__fixtures__/layout-with-empty-paragraphs.json';
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
// eslint-disable-next-line import/no-extraneous-dependencies
import type { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { breakoutSelector } from '@atlaskit/editor-test-helpers/page-objects/breakout';

describe('breakout button hidden below popups', () => {
  const startEditor = async (client: any, adf: any): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowIndentation: true,
      allowLayouts: true,
      allowBreakout: true,
      defaultValue: adf,
    });

    // Put the selection right after the paragraph with 6 levels of indentation
    await setProseMirrorTextSelection(page, { anchor: 17, head: 17 });
    return page;
  };

  describe('when the typeahead popup is above breakout button', () => {
    // FIXME: This test was automatically skipped due to failure on 10/09/2023: https://product-fabric.atlassian.net/browse/ED-19982
    BrowserTestCase(
      'the breakout button should not be visible',
      {
        skip: ['*'],
      },
      async (client: any, testName: string) => {
        const page = await startEditor(client, adf);

        await page.setWindowSize(1300, 500);

        // Keep the typeahead popup open
        await quickInsert(page, '', false);

        const isLayoutButtonVisible = await page.isClickable(
          breakoutSelector.breakoutButtonGoWide,
        );

        expect(isLayoutButtonVisible).toBeFalsy();
      },
    );
  });

  describe('when the link popup is above breakout button', () => {
    // FIXME: This test was automatically skipped due to failure on 10/09/2023: https://product-fabric.atlassian.net/browse/ED-19982
    BrowserTestCase(
      'the breakout button should not be visible',
      {
        skip: ['*'],
      },
      async (client: any, testName: string) => {
        const page = await startEditor(client, adf);

        await page.setWindowSize(1300, 500);

        await quickInsert(page, 'Link', true);

        const isLayoutButtonVisible = await page.isClickable(
          breakoutSelector.breakoutButtonGoWide,
        );

        expect(isLayoutButtonVisible).toBeFalsy();
      },
    );
  });
});
