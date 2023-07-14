import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountRenderer,
  goToRendererTestingExample,
} from '../__helpers/testing-example-helpers';
import datasourceAdf from './__fixtures__/datasource-adf.json';

const selector = '[data-testid="inline-card-icon-and-title"]';

BrowserTestCase(
  `Can see a datasource falling back to inline smart card on mobile`,
  { skip: ['firefox', 'safari'] },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      { appearance: 'mobile', withRendererActions: true },
      datasourceAdf,
    );

    await page.waitUntilContainsText(selector, '0 Issues');
  },
);
