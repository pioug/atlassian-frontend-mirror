import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountRenderer,
  goToRendererTestingExample,
} from '../../../__tests__/__helpers/testing-example-helpers';
import { selectors } from '../../../__tests__/__helpers/page-objects/_renderer';
import { annotate } from '../../../__tests__/__helpers/page-objects/_actions';

const CHAR_WIDTH = 6;

BrowserTestCase(
  `Can't create an annotation on a text selection that contains inline nodes`,
  { skip: ['ie', 'edge', 'firefox'] },
  async (client: any, testName: string) => {
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

    await page.simulateUserSelection(
      `${selectors.document} > p`,
      `${selectors.document} > p`,
      element => (element === 'start' ? CHAR_WIDTH : 0),
    );

    const result = await annotate(page, '1234');
    expect(result).toBeUndefined;
  },
);

BrowserTestCase(
  'Can create an annotation on a basic text selection',
  { skip: ['ie', 'edge', 'firefox'] },
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

    await page.simulateUserSelection(
      `${selectors.document} > p`,
      `${selectors.document} > p`,
      element => (element === 'start' ? CHAR_WIDTH : 0),
    );

    const result = await annotate(page, '1234');
    expect(result).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Can create an annotation on a text selection over two paragraphs',
  { skip: ['ie', 'edge', 'firefox'] },
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

    await page.simulateUserSelection(
      `${selectors.document} > p`,
      `${selectors.document} > p:nth-child(2)`,
      element => (element === 'start' ? CHAR_WIDTH : -(CHAR_WIDTH * 5)),
    );

    const result = await annotate(page, '1234');
    expect(result).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Can create an annotation on a text selection over a decision item',
  { skip: ['ie', 'edge', 'firefox'] },
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
                text: 'text before',
              },
            ],
          },
          {
            type: 'decisionList',
            attrs: {
              localId: 'local-uuid',
            },
            content: [
              {
                type: 'decisionItem',
                attrs: {
                  localId: 'local-uuid',
                  state: 'DECIDED',
                },
                content: [
                  {
                    type: 'text',
                    text: 'hello, mate',
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'text after',
              },
            ],
          },
        ],
      },
    );

    await page.simulateUserSelection(
      `${selectors.document} > p`,
      `${selectors.document} > p:last-child`,
      element => (element === 'start' ? CHAR_WIDTH : 0),
    );

    const result = await annotate(page, '1234');
    expect(result).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Can create an annotation on a text selection over a task item',
  { skip: ['ie', 'edge', 'firefox'] },
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
                text: 'text before',
              },
            ],
          },
          {
            type: 'taskList',
            attrs: {
              localId: 'local-uuid',
            },
            content: [
              {
                type: 'taskItem',
                attrs: {
                  localId: 'local-uuid',
                  state: 'TODO',
                },
                content: [
                  {
                    type: 'text',
                    text: 'hello, mate',
                  },
                ],
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'text after',
              },
            ],
          },
        ],
      },
    );

    await page.simulateUserSelection(
      `${selectors.document} > p`,
      `${selectors.document} > p:last-child`,
      element => (element === 'start' ? CHAR_WIDTH : 0),
    );

    const result = await annotate(page, '1234');
    expect(result).toMatchCustomDocSnapshot(testName);
  },
);
