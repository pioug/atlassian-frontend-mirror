import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import taskDateAdf from './__fixtures__/task-item-date.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';

BrowserTestCase(
  `Format date in task item`,
  // Unblock prosemirror bump
  // TODO: ED-19392
  { skip: ['*'] },
  async (client: any) => {
    const selector = `${selectors.editor} .taskItemView-content-wrap [type="checkbox"]`;
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      defaultValue: taskDateAdf,
      allowDate: true,
    });

    await page.waitForSelector(selector);
    expect(await page.getText('.taskItemView-content-wrap')).toMatch('Today');

    await page.click(selector);
    expect(await page.getText('.taskItemView-content-wrap')).toMatch(
      'Aug 15, 2017',
    );
  },
);
