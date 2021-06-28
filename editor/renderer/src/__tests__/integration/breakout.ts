import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountRenderer,
  goToRendererTestingExample,
} from '../__helpers/testing-example-helpers';
import tableLayoutAdf from './__fixtures__/table-layout.adf.json';

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

BrowserTestCase(
  'Addapts full-width table after scrolling to resizing',
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, {}, tableLayoutAdf);

    await page.evaluate(() => (document.body.style.width = '480px'));

    await page.evaluate(() => window.scrollBy(0, 100));
    await page.evaluate(() => (document.body.style.width = '330px'));

    await sleep(1000);

    const fullWidth = await page.evaluate(() => {
      const el = document.querySelector('[data-layout="full-width"]');
      return el ? window.getComputedStyle(el).width : '0';
    });

    expect(fullWidth).toBe('330px');
  },
);
