import type { BrowserObject } from '@atlaskit/webdriver-runner/lib/wrapper/wd-wrapper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { WebDriverPage } from '@atlaskit/editor-test-helpers/integration/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { fullpage } from '@atlaskit/editor-test-helpers/integration/helpers';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/lib/runner/runner';
import mentionDoc from './__fixtures__/mention.json';

describe('Mention assistive text', async () => {
  const initEditor = async ({
    client,
    adf,
  }: {
    client: BrowserObject;
    adf: string;
  }): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(client);
    // Multiline node tests results in an ADF with a table with a narrow
    // cell to ensure nodes are broken across multiple lines
    const props = {
      appearance: fullpage.appearance,
      defaultValue: adf,
      allowTextAlignment: true,
      allowTables: {
        advanced: true,
        allowColumnResizing: true,
      },
      allowMention: true,
    };

    await mountEditor(page, props, undefined, { clickInEditor: false });
    // clear any modifier keys in chrome
    if (page.isBrowser('chrome')) {
      await page.keys(['NULL']);
    }
    return page;
  };

  BrowserTestCase(
    'Mention assistive text should contain user name',
    {},
    async (client: BrowserObject) => {
      const page = await initEditor({
        client,
        adf: JSON.stringify(mentionDoc),
      });
      const assistiveText = await page.getHTML('.assistive');
      expect(assistiveText).toBe('Tagged user @Kaitlyn Prouty');
    },
  );
});
