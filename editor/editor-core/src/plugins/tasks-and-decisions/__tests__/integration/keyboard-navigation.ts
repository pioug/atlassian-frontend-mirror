import { BrowserTestCase } from '@atlaskit/webdriver-runner/lib/runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import dateInTaskAdf from '../__fixtures__/date-in-task-adf.json';
import {
  animationFrame,
  expectToMatchSelection,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { clickTaskNth } from '@atlaskit/editor-test-helpers/page-objects/task';

BrowserTestCase(
  'Pressing up arrow key moves cursor to previous taskItem',
  { skip: [] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: dateInTaskAdf,
    });

    await clickTaskNth(page, 3);
    await page.keys(['ArrowUp']);
    await animationFrame(page);
    await expectToMatchSelection(page, {
      type: 'text',
      anchor: 17,
      head: 17,
    });
  },
);
