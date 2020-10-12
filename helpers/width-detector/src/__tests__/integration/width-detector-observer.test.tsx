import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';

const width = () => {
  const output = document.querySelector<HTMLOutputElement>(
    'output[name="width"]',
  );
  return output ? output.value : '';
};

BrowserTestCase(
  'width-detector-observer.ts: does not resize when sentinel is offscreen by default',
  { skip: ['safari', 'firefox', 'edge'] },
  async (client: any) => {
    const page = new Page(client);
    await page.goto(getExampleUrl('helpers', 'width-detector', 'scrolling'));

    {
      await page.evaluate(() => (document.body.style.width = '320px'));
      const before = await page.evaluate(width);
      expect(before).toBe('320');
    }

    {
      await page.evaluate(() => window.scrollBy(0, 330));
      await page.evaluate(() => (document.body.style.width = '480px'));
      const after = await page.evaluate(width);
      expect(after).toBe('320');
    }
  },
);

BrowserTestCase(
  'width-detector-observer.ts: resizes when sentinel is offscreen for offscreen=true',
  { skip: ['safari', 'firefox', 'edge'] },
  async (client: any) => {
    const page = new Page(client);
    await page.goto(getExampleUrl('helpers', 'width-detector', 'scrolling'));

    await page.evaluate(() => {
      const input = document.querySelector<HTMLInputElement>(
        'input[name="offscreen"]',
      );
      // We want this to fail loudly if input is null
      (input as HTMLInputElement).click();
    });

    {
      await page.evaluate(() => window.scrollBy(0, 330));
      await page.evaluate(() => (document.body.style.width = '480px'));
      const after = await page.evaluate(width);
      expect(after).toBe('480');
    }
  },
);
