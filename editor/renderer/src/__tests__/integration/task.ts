import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountRenderer,
  goToRendererTestingExample,
} from '../__helpers/testing-example-helpers';
import { selectors } from '../__helpers/page-objects/_renderer';
import taskDateAdf from './__fixtures__/task-date.adf.json';

// FIXME: This test was automatically skipped due to failure on 31/01/2023: https://product-fabric.atlassian.net/browse/ED-16720
BrowserTestCase(
  `Format date in task item`,
  {
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const selector = `${selectors.document} [type="checkbox"]`;
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, { withRendererActions: true }, taskDateAdf);

    await page.waitForSelector(selector);
    expect(await page.getText('[data-task-local-id]')).toMatch('Today');

    await page.click(selector);
    expect(await page.getText('[data-task-local-id]')).toMatch('Aug 15, 2017');
  },
);
