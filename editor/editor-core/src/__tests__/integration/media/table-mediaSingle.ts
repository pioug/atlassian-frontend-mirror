import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  editable,
  getDocFromElement,
  insertMedia,
  fullpage,
} from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { messages as insertBlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

// FIXME: not entirely sure why firefox is flakey on browserstack
BrowserTestCase(
  'table-mediaSingle.ts: Can insert media single into table',
  { skip: ['edge', 'safari'] },
  async (
    client: Parameters<typeof goToEditorTestingWDExample>[0],
    testName: string,
  ) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
      media: {
        allowMediaSingle: true,
        allowMediaGroup: true,
      },
    });
    await page.click(
      `[aria-label="${insertBlockMessages.table.defaultMessage}"]`,
    );

    // second cell
    await page.keys(['ArrowDown']);

    // now we can insert media as necessary
    await insertMedia(page);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
