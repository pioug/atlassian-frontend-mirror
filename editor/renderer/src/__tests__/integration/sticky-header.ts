//sticky-header.ts
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountRenderer,
  goToRendererTestingExample,
} from '../__helpers/testing-example-helpers';

import simpleTableADF from './__fixtures__/sticky-table.adf.json';

BrowserTestCase(`Sticky Header tables.`, {}, async (client: any) => {
  const page = await goToRendererTestingExample(client);
  await mountRenderer(page, { stickyHeaders: { show: true } }, simpleTableADF);

  page.setWindowSize(1800, 500);

  const sticky = '[data-testid="sticky-table-fixed"]';

  expect(await page.getCSSProperty(sticky, 'display')).toHaveProperty(
    'value',
    'none',
  );

  expect(await page.getAttribute(sticky, 'mode')).toEqual('none');

  await page.execute(() => {
    scrollTo(0, 40);
  });

  expect(await page.getAttribute(sticky, 'mode')).toEqual('stick');

  expect(await page.getCSSProperty(sticky, 'position')).toHaveProperty(
    'value',
    'fixed',
  );

  await page.execute(() => {
    scrollTo(0, 570);
  });

  expect(await page.getCSSProperty(sticky, 'position')).toHaveProperty(
    'value',
    'absolute',
  );

  expect(await page.getAttribute(sticky, 'mode')).toEqual('pin-bottom');
});
