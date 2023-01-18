import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import simpleAdf from './__fixtures__/simple.adf.json';
import { addSentinels, selectors } from '../__helpers/page-objects/_renderer';
import {
  mountRenderer,
  goToRendererTestingExample,
  getEvents,
} from '../__helpers/testing-example-helpers';

const props = {
  allowSelectAllTrap: true,
};

BrowserTestCase(
  'select.ts: Mod+a does not select before',
  {},
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);
    await addSentinels(page);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('a', ['Mod']);

    const beforeSelected = await page.evaluate(() => {
      const el = document.querySelector('[data-sentinel="before"]');
      const range = window.getSelection()?.getRangeAt(0);
      return el ? range?.intersectsNode(el) : null;
    });

    expect(beforeSelected).toBe(false);
  },
);

BrowserTestCase(
  'select.ts: Mod+a does not select after',
  {},
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);
    await addSentinels(page);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('a', ['Mod']);

    const afterSelected = await page.evaluate(() => {
      const el = document.querySelector('[data-sentinel="after"]');
      const range = window.getSelection()?.getRangeAt(0);
      return el ? range?.intersectsNode(el) : null;
    });

    expect(afterSelected).toBe(false);
  },
);

BrowserTestCase(
  'select.ts: Mod+a selects renderer',
  {},
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);

    const renderer = await page.$(selectors.document);
    await renderer.click();
    await page.keyboard.type('a', ['Mod']);

    const rendererSelected = await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      return range?.intersectsNode(el);
    }, selectors.document);

    expect(rendererSelected).toBe(true);
  },
);

BrowserTestCase(
  'select.ts: Mod+a fires selectAllCaught event',
  {},
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);

    const renderer = await page.$(selectors.document);
    await renderer.click();
    await page.keyboard.type('a', ['Mod']);

    const events = await getEvents(page);
    expect(events).toContainEqual(
      expect.objectContaining({
        action: 'selectAllCaught',
        actionSubject: 'renderer',
      }),
    );
  },
);

BrowserTestCase(
  'select.ts: Mod+a twice selects before',
  {},
  async (client: any) => {
    const page = await goToRendererTestingExample(client);

    await mountRenderer(page, props, simpleAdf);
    await page.waitForSelector(selectors.document);
    await addSentinels(page);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('a', ['Mod']);
    await page.keyboard.type('a', ['Mod']);

    const beforeSelected = await page.evaluate(() => {
      const el = document.querySelector('[data-sentinel="before"]');
      const range = window.getSelection()?.getRangeAt(0);
      return el ? range?.intersectsNode(el) : null;
    });

    expect(beforeSelected).toBe(true);
  },
);

BrowserTestCase(
  'select.ts: Mod+a twice selects after',
  {},
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);
    await addSentinels(page);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('a', ['Mod']);
    await page.keyboard.type('a', ['Mod']);

    const afterSelected = await page.evaluate(() => {
      const el = document.querySelector('[data-sentinel="after"]');
      const range = window.getSelection()?.getRangeAt(0);
      return el ? range?.intersectsNode(el) : null;
    });

    expect(afterSelected).toBe(true);
  },
);

BrowserTestCase(
  'select.ts: Mod+a twice fires selectAllEscaped event',
  {},
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);

    const renderer = await page.$(selectors.document);
    await renderer.click();
    await page.keyboard.type('a', ['Mod']);
    await page.keyboard.type('a', ['Mod']);

    const events = await getEvents(page);
    expect(events).toContainEqual(
      expect.objectContaining({
        action: 'selectAllEscaped',
        actionSubject: 'renderer',
      }),
    );
  },
);

BrowserTestCase(
  'select.ts: Mod+a twice, click, Mod+a does not select before',
  {},
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);
    await addSentinels(page);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('a', ['Mod']);
    await page.keyboard.type('a', ['Mod']);

    await renderer.click();

    await page.keyboard.type('a', ['Mod']);

    const afterSelected = await page.evaluate(() => {
      const el = document.querySelector('[data-sentinel="before"]');
      const range = window.getSelection()?.getRangeAt(0);
      return el ? range?.intersectsNode(el) : null;
    });

    expect(afterSelected).toBe(false);
  },
);

BrowserTestCase(
  'select.ts: Mod+a twice, click, Mod+a does not select after',
  {},
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);
    await addSentinels(page);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('a', ['Mod']);
    await page.keyboard.type('a', ['Mod']);

    await renderer.click();

    await page.keyboard.type('a', ['Mod']);

    const afterSelected = await page.evaluate(() => {
      const el = document.querySelector('[data-sentinel="after"]');
      const range = window.getSelection()?.getRangeAt(0);
      return el ? range?.intersectsNode(el) : null;
    });

    expect(afterSelected).toBe(false);
  },
);

BrowserTestCase(
  'select.ts: Mod+a twice, click, Mod+a selects renderer',
  {},
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('a', ['Mod']);
    await page.keyboard.type('a', ['Mod']);

    await renderer.click();

    await page.keyboard.type('a', ['Mod']);

    const rendererSelected = await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      return range?.intersectsNode(el);
    }, selectors.document);

    expect(rendererSelected).toBe(true);
  },
);
