//TODO: [ED-15027] remove and relocate this test once the behaviour has been corrected.\
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { BrowserObject } from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  fullpage,
  expectToMatchSelection,
  setProseMirrorTextSelection,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import type { WebDriverPage } from '@atlaskit/editor-test-helpers/integration/types';
import adf from './__fixtures__/table-with-multiline-date.adf.json';

describe('table with multiline date', () => {
  const initEditor = async ({
    client,
    selection,
    adf,
  }: {
    client: BrowserObject;
    selection: { anchor: number; head: number };
    adf: string;
  }): Promise<WebDriverPage> => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    const props = {
      appearance: fullpage.appearance,
      defaultValue: adf,
      allowTextAlignment: true,
      allowTables: {
        advanced: true,
        allowColumnResizing: true,
      },
      allowDate: true,
    };

    await mountEditor(page, props, undefined, { clickInEditor: false });

    await page.waitForSelector('.inlineNodeView');

    await setProseMirrorTextSelection(page, selection);

    return page;
  };
  BrowserTestCase(
    'Does not select table corner controls when navigating up from a multiline node inside a table',
    {
      skip: ['firefox', 'safari'],
    },
    async (client: BrowserObject) => {
      const page = await initEditor({
        client,
        selection: { anchor: 27, head: 27 },
        adf,
      });

      await page.keys('ArrowUp');

      await expectToMatchSelection(page, {
        type: 'text',
        anchor: 27,
        head: 27,
      });
    },
  );
});
