import { BrowserTestCase } from '@atlaskit/webdriver-runner/lib/runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import dateInTaskAdf from '../__fixtures__/date-in-task-adf.json';
import {
  animationFrame,
  expectToMatchSelection,
  fullpage,
} from '../../../../__tests__/integration/_helpers';
import { clickTaskNth } from '../../../../__tests__/__helpers/page-objects/_task';

// Safari hangs when default ADF contains tasks and decisions  https://product-fabric.atlassian.net/browse/ED-9974
BrowserTestCase(
  'Pressing up arrow key moves cursor to previous taskItem',
  { skip: ['safari'] },
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
