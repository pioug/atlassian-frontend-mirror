// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { getBoundingRect } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';

export const keyboardSelectLineFromLineEnd = async (page: WebDriverPage) => {
  // The keyboard shortcuts to extend a selection to the start of
  // the current line from the current position vary based on
  // platform.
  // - mac: command + shift + arrow key
  // - windows + linux: shift + home
  // note: at time of util creation, tests only run on windows and mac
  const keys = page.isWindowsPlatform()
    ? ['Shift', 'Home']
    : ['Command', 'Shift', 'ArrowLeft'];

  await page.keys(keys, true);
};

export const keyboardSelectLineFromLineStart = async (page: WebDriverPage) => {
  // The keyboard shortcuts to extend a selection to the end of
  // the current line from the current position vary based on
  // platform.
  // - mac: command + shift + arrow key
  // - windows + linux: shift + end
  // note: at time of util creation, tests only run on windows and mac
  const keys = page.isWindowsPlatform()
    ? ['Shift', 'End']
    : ['Command', 'Shift', 'ArrowRight'];

  await page.keys(keys, true);
};

/** The shift key is held down in Chrome the first time it is passed to page.keys */
export const holdShiftInChrome = async (page: WebDriverPage) => {
  if (page.isBrowser('chrome')) {
    await page.keys(['Shift']);
  }
};

export const clickAndDragSelectLineFromLineEnd = async ({
  page,
  selector,
}: {
  page: WebDriverPage;
  selector: string;
}) => {
  const bounds = await getBoundingRect(page, selector);
  const startX = bounds.left + bounds.width + 20;
  const startY = bounds.top + 10;
  const targetX = 0;
  const targetY = bounds.top - 20;

  await page.simulateUserDragAndDrop(startX, startY, targetX, targetY);
};

export const buildAdfTrailingSpaces = ({
  node,
}: {
  node: { type: string; attrs: { [key: string]: any } };
}) => {
  return {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          node,
          {
            type: 'text',
            text: ' ',
          },
          node,
          {
            type: 'text',
            text: ' ',
          },
          node,
          {
            type: 'text',
            text: ' ',
          },
        ],
      },
    ],
  };
};

export const buildAdfNoTrailingSpaces = ({
  node,
}: {
  node: { type: string; attrs: { [key: string]: any } };
}) => {
  return {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [node, node, node],
      },
    ],
  };
};

export const buildAdfMultipleNodesAcrossLines = ({
  node,
}: {
  node: { type: string; attrs: { [key: string]: any } };
}) => {
  return {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [],
      },
      {
        type: 'paragraph',
        content: [node, node, node],
      },
      {
        type: 'paragraph',
        content: [node, node, node],
      },
      {
        type: 'paragraph',
        content: [node, node, node],
      },
      {
        type: 'paragraph',
        content: [],
      },
    ],
  };
};

export const buildAdfMultiline = ({
  node,
}: {
  node: { type: string; attrs: { [key: string]: any } };
}) => {
  return {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'table',
        attrs: {
          isNumberColumnEnabled: false,
          layout: 'default',
          localId: '704b4aa7-f9a6-49e0-9b14-3c2e010bd4ca',
        },
        content: [
          {
            type: 'tableRow',
            content: [
              {
                type: 'tableHeader',
                attrs: {
                  colwidth: [56],
                },
                content: [
                  {
                    type: 'paragraph',
                    content: [node, node, node],
                  },
                ],
              },
              {
                type: 'tableHeader',
                attrs: {
                  colwidth: [346],
                },
                content: [
                  {
                    type: 'paragraph',
                    content: [],
                  },
                ],
              },
              {
                type: 'tableHeader',
                attrs: {
                  colwidth: [276],
                },
                content: [
                  {
                    type: 'paragraph',
                    content: [],
                  },
                ],
              },
            ],
          },
          {
            type: 'tableRow',
            content: [
              {
                type: 'tableCell',
                attrs: {
                  colwidth: [56],
                },
                content: [
                  {
                    type: 'paragraph',
                    content: [],
                  },
                ],
              },
              {
                type: 'tableCell',
                attrs: {
                  colwidth: [346],
                },
                content: [
                  {
                    type: 'paragraph',
                    content: [],
                  },
                ],
              },
              {
                type: 'tableCell',
                attrs: {
                  colwidth: [276],
                },
                content: [
                  {
                    type: 'paragraph',
                    content: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};
