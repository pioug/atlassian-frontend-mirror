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

// FIXME: This test was automatically skipped due to failure on 18/12/2022: https://product-fabric.atlassian.net/browse/ED-16390
BrowserTestCase(
  'select.ts: Mod+A does not select before',
  {
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);
    await addSentinels(page);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('A', ['Mod']);

    const beforeSelected = await page.evaluate(() => {
      const el = document.querySelector('[data-sentinel="before"]');
      const range = window.getSelection()?.getRangeAt(0);
      return el ? range?.intersectsNode(el) : null;
    });

    expect(beforeSelected).toBe(false);
  },
);

// FIXME: This test was automatically skipped due to failure on 18/12/2022: https://product-fabric.atlassian.net/browse/ED-16391
BrowserTestCase(
  'select.ts: Mod+A does not select after',
  {
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);
    await addSentinels(page);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('A', ['Mod']);

    const afterSelected = await page.evaluate(() => {
      const el = document.querySelector('[data-sentinel="after"]');
      const range = window.getSelection()?.getRangeAt(0);
      return el ? range?.intersectsNode(el) : null;
    });

    expect(afterSelected).toBe(false);
  },
);

// FIXME: This test was automatically skipped due to failure on 18/12/2022: https://product-fabric.atlassian.net/browse/ED-16392
BrowserTestCase(
  'select.ts: Mod+A selects renderer',
  {
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);

    const renderer = await page.$(selectors.document);
    await renderer.click();
    await page.keyboard.type('A', ['Mod']);

    const rendererSelected = await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      return range?.intersectsNode(el);
    }, selectors.document);

    expect(rendererSelected).toBe(true);
  },
);

// FIXME: This test was automatically skipped due to failure on 18/12/2022: https://product-fabric.atlassian.net/browse/ED-16393
BrowserTestCase(
  'select.ts: Mod+A fires selectAllCaught event',
  {
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);

    const renderer = await page.$(selectors.document);
    await renderer.click();
    await page.keyboard.type('A', ['Mod']);

    const events = await getEvents(page);
    expect(events).toContainEqual(
      expect.objectContaining({
        action: 'selectAllCaught',
        actionSubject: 'renderer',
      }),
    );
  },
);

// FIXME: This test was automatically skipped due to failure on 18/12/2022: https://product-fabric.atlassian.net/browse/ED-16394
BrowserTestCase(
  'select.ts: Mod+A twice selects before',
  {
    // skip: ['safari'],
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);
    await addSentinels(page);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('A', ['Mod']);
    await page.keyboard.type('A', ['Mod']);

    const beforeSelected = await page.evaluate(() => {
      const el = document.querySelector('[data-sentinel="before"]');
      const range = window.getSelection()?.getRangeAt(0);
      return el ? range?.intersectsNode(el) : null;
    });

    expect(beforeSelected).toBe(true);
  },
);

// FIXME: This test was automatically skipped due to failure on 18/12/2022: https://product-fabric.atlassian.net/browse/ED-16395
BrowserTestCase(
  'select.ts: Mod+A twice selects after',
  {
    // skip: ['safari'],
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);
    await addSentinels(page);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('A', ['Mod']);
    await page.keyboard.type('A', ['Mod']);

    const afterSelected = await page.evaluate(() => {
      const el = document.querySelector('[data-sentinel="after"]');
      const range = window.getSelection()?.getRangeAt(0);
      return el ? range?.intersectsNode(el) : null;
    });

    expect(afterSelected).toBe(true);
  },
);

// FIXME: This test was automatically skipped due to failure on 18/12/2022: https://product-fabric.atlassian.net/browse/ED-16396
BrowserTestCase(
  'select.ts: Mod+A twice fires selectAllEscaped event',
  {
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);

    const renderer = await page.$(selectors.document);
    await renderer.click();
    await page.keyboard.type('A', ['Mod']);
    await page.keyboard.type('A', ['Mod']);

    const events = await getEvents(page);
    expect(events).toContainEqual(
      expect.objectContaining({
        action: 'selectAllEscaped',
        actionSubject: 'renderer',
      }),
    );
  },
);

// FIXME: This test was automatically skipped due to failure on 18/12/2022: https://product-fabric.atlassian.net/browse/ED-16397
BrowserTestCase(
  'select.ts: Mod+A twice, click, Mod+A does not select before',
  {
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);
    await addSentinels(page);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('A', ['Mod']);
    await page.keyboard.type('A', ['Mod']);

    await renderer.click();

    await page.keyboard.type('A', ['Mod']);

    const afterSelected = await page.evaluate(() => {
      const el = document.querySelector('[data-sentinel="before"]');
      const range = window.getSelection()?.getRangeAt(0);
      return el ? range?.intersectsNode(el) : null;
    });

    expect(afterSelected).toBe(false);
  },
);

// FIXME: This test was automatically skipped due to failure on 18/12/2022: https://product-fabric.atlassian.net/browse/ED-16398
BrowserTestCase(
  'select.ts: Mod+A twice, click, Mod+A does not select after',
  {
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);
    await addSentinels(page);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('A', ['Mod']);
    await page.keyboard.type('A', ['Mod']);

    await renderer.click();

    await page.keyboard.type('A', ['Mod']);

    const afterSelected = await page.evaluate(() => {
      const el = document.querySelector('[data-sentinel="after"]');
      const range = window.getSelection()?.getRangeAt(0);
      return el ? range?.intersectsNode(el) : null;
    });

    expect(afterSelected).toBe(false);
  },
);

// FIXME: This test was automatically skipped due to failure on 18/12/2022: https://product-fabric.atlassian.net/browse/ED-16399
BrowserTestCase(
  'select.ts: Mod+A twice, click, Mod+A selects renderer',
  {
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, props, simpleAdf);

    const renderer = await page.$(selectors.document);
    await renderer.click();

    await page.keyboard.type('A', ['Mod']);
    await page.keyboard.type('A', ['Mod']);

    await renderer.click();

    await page.keyboard.type('A', ['Mod']);

    const rendererSelected = await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      return range?.intersectsNode(el);
    }, selectors.document);

    expect(rendererSelected).toBe(true);
  },
);
