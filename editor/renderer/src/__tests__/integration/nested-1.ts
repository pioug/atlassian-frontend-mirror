import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountRenderer,
  goToRendererTestingExample,
} from '../__helpers/testing-example-helpers';
import { selectors } from '../__helpers/page-objects/_renderer';
import { annotate } from '../__helpers/page-objects/_actions';

import nestedAdf from './__fixtures__/nested-nodes.adf.json';
import taskDecisionAdf from './__fixtures__/task-decision.adf.json';

const CHAR_WIDTH = 6;

// Skipped safari tests that were causing Chrome tests so show as
// failed. Possibly related to: https://product-fabric.atlassian.net/browse/ED-9831

BrowserTestCase(
  `Can create an annotation on nested text inside a list inside a table`,
  { skip: ['chrome', 'safari', 'edge', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, { withRendererActions: true }, nestedAdf);

    const selector = `${selectors.document} ol > li > p`;
    await page.waitForSelector(selector);
    await page.simulateUserSelection(selector, selector);
    await page.simulateUserSelection(selector, selector);

    const result = await annotate(page, '1234');
    expect(result).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `Can create an annotation on nested text inside a layout`,
  { skip: ['chrome', 'safari', 'edge', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, { withRendererActions: true }, nestedAdf);

    const selector = `${selectors.document} [data-layout-column]`;
    await page.waitForSelector(selector);
    await page.simulateUserSelection(
      selector,
      `${selector}:nth-of-type(2)`,
      (element) => (element === 'start' ? CHAR_WIDTH * 20 : 0),
    );

    const result = await annotate(page, '1234');
    expect(result).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `Can create an annotation on a nested heading`,
  { skip: ['chrome', 'safari', 'edge', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, { withRendererActions: true }, nestedAdf);

    const selector = `${selectors.document} h1`;
    await page.waitForSelector(selector);
    await page.simulateUserSelection(selector, selector);

    const result = await annotate(page, '1234');
    expect(result).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `Can create an annotation on a nested task inside a table with overlapping marks`,
  { skip: ['chrome', 'safari', 'edge', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, { withRendererActions: true }, taskDecisionAdf);

    const selector = `${selectors.document} table [data-task-local-id] [data-renderer-start-pos]`;
    await page.waitForSelector(selector);
    await page.simulateUserSelection(selector, selector);

    const result = await annotate(page, '1234');
    expect(result).toMatchCustomDocSnapshot(testName);
  },
);
