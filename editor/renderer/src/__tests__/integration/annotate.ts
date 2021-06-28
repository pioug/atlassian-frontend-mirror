import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountRenderer,
  goToRendererTestingExample,
} from '../__helpers/testing-example-helpers';
import { selectors } from '../__helpers/page-objects/_renderer';
import { annotate } from '../__helpers/page-objects/_actions';
import taskDecisionAdf from './__fixtures__/task-decision.adf.json';

const CHAR_WIDTH = 6;
// TODO: https://product-fabric.atlassian.net/browse/ED-9831
// Selection in Catalina Safari isn't working properly.
BrowserTestCase(
  `Can't create an annotation on a text selection that contains inline nodes`,
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      { withRendererActions: true },
      {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'hello ',
              },
              {
                type: 'emoji',
                attrs: {
                  shortName: ':cactus:',
                  id: '1f335',
                  text: '🌵',
                },
              },
              {
                type: 'text',
                text: ' mate',
              },
            ],
          },
        ],
      },
    );

    const selector = `${selectors.document} > p`;
    await page.waitForSelector(selector);
    await page.simulateUserSelection(selector, selector, (element) =>
      element === 'start' ? CHAR_WIDTH : 0,
    );

    const result = await annotate(page, '1234');
    expect(result).toEqual(false);
  },
);

BrowserTestCase(
  `Can't create an annotation on a text selection that falls in the middle of an inline node`,
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      { withRendererActions: true },
      {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'emoji',
                attrs: {
                  shortName: ':not-an-emoji:',
                  id: '',
                  text: '',
                },
              },
              {
                type: 'text',
                text: 'hello ',
              },
            ],
          },
        ],
      },
    );

    const selector = `${selectors.document} > p`;
    await page.waitForSelector(selector);
    await page.simulateUserSelection(selector, selector, (element) =>
      element === 'start' ? CHAR_WIDTH * 3 : 0,
    );

    const result = await annotate(page, '1234');
    expect(result).toEqual(false);
  },
);

BrowserTestCase(
  'Can create an annotation on a basic text selection',
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      { withRendererActions: true },
      {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello, World',
              },
            ],
          },
        ],
      },
    );

    const selector = `${selectors.document} > p`;

    await page.waitForSelector(selector);
    await page.simulateUserSelection(selector, selector, (element) =>
      element === 'start' ? CHAR_WIDTH : 0,
    );

    const result = await annotate(page, '1234');
    expect(result).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Can create an annotation on a text selection over two paragraphs',
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(
      page,
      { withRendererActions: true },
      {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
              },
            ],
          },
        ],
      },
    );

    const selector = `${selectors.document} > p`;

    await page.waitForSelector(selector);
    await page.simulateUserSelection(
      selector,
      `${selector}:nth-child(2)`,
      (element) => (element === 'start' ? CHAR_WIDTH : -(CHAR_WIDTH * 5)),
    );

    const result = await annotate(page, '1234');
    expect(result).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Can create an annotation on a text selection over a decision item',
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, { withRendererActions: true }, taskDecisionAdf);

    const selector = `${selectors.document} [data-decision-local-id] [data-renderer-start-pos]`;

    await page.waitForSelector(selector);
    await page.simulateUserSelection(selector, selector, (element) =>
      element === 'start' ? CHAR_WIDTH : 0,
    );

    const result = await annotate(page, '1234');
    expect(result).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Can create an annotation on a text selection over a task item',
  { skip: ['edge', 'firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToRendererTestingExample(client);
    await mountRenderer(page, { withRendererActions: true }, taskDecisionAdf);

    const selector = `${selectors.document} [data-task-local-id] [data-renderer-start-pos]`;

    await page.waitForSelector(selector);
    await page.simulateUserSelection(selector, selector, (element) =>
      element === 'start' ? CHAR_WIDTH : 0,
    );

    const result = await annotate(page, '1234');
    expect(result).toMatchCustomDocSnapshot(testName);
  },
);
