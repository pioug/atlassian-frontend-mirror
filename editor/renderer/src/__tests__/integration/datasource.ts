import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountRenderer,
  goToRendererTestingExample,
} from '../__helpers/testing-example-helpers';
import datasourceAdf from './__fixtures__/datasource-adf.json';

const selector = '[data-testid="datasource-table-view"]';

BrowserTestCase(
  `Can see a rendered datasource table`,
  { skip: ['firefox', 'safari'] },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, { withRendererActions: true }, datasourceAdf);

    const found = await page.waitForSelector(selector);
    expect(found).toBe(true);
  },
);
