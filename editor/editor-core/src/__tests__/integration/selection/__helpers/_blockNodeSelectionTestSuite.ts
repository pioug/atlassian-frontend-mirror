import { WebDriverPage } from '@atlaskit/editor-test-helpers/page-objects/types';
import { ADFEntity } from '@atlaskit/adf-utils/types';

export const keyboardSelectDocFromStart = async (page: WebDriverPage) => {
  // The keyboard shortcuts to extend a selection to the end of
  // document from the current position vary based on platform.
  // - mac: command + shift + arrow key
  // - windows + linux: control + shift + end
  // note: at time of util creation, tests only run on windows and mac
  const keys = page.isWindowsPlatform()
    ? ['Control', 'Shift', 'End']
    : ['Command', 'Shift', 'ArrowDown'];

  await page.keys(keys, true);
};

export const keyboardSelectDocFromEnd = async (page: WebDriverPage) => {
  // The keyboard shortcuts to extend a selection to the start of
  // the document from the current position vary based on platform.
  // - mac: command + shift + arrow key
  // - windows + linux: control + shift + end
  // note: at time of util creation, tests only run on windows and mac
  const keys = page.isWindowsPlatform()
    ? ['Control', 'Shift', 'Home']
    : ['Command', 'Shift', 'ArrowUp'];

  await page.keys(keys, true);
};

export const keyboardShiftSelect = async ({
  page,
  direction,
  numberOfTimes = 1,
}: {
  page: WebDriverPage;
  direction: 'Up' | 'Down' | 'Left' | 'Right';
  numberOfTimes: number;
}) => {
  // The keyboard shortcuts to extend a selection with shift and arrow keys are as follows:
  // shift + left/right: extend selection by one character (mac + windows)
  // shift + up/down: extend selection to same position on line above/below (mac + windows)
  // note: at time of util creation, tests only run on windows and mac
  const keys = ['Shift', `Arrow${direction}`];

  // Browserstack holds the shift key from the first time it is pressed in Chrome
  // so we only loop to press the given arrow key
  if (page.isBrowser('chrome')) {
    await page.keys('Shift');
    for (let i = 0; i < numberOfTimes; i++) {
      await page.keys(`Arrow${direction}`);
    }
    // Browserstack doesn't hold down the shift key in other browsers
  } else {
    for (let i = 0; i < numberOfTimes; i++) {
      await page.keys(keys, true);
    }
  }
};

export const clickAndDragSelect = async ({
  page,
  startSelector,
  targetSelector,
  dragDirection,
}: {
  page: WebDriverPage;
  startSelector: string;
  targetSelector: string;
  dragDirection: 'Up' | 'Down';
}) => {
  const startBounds = await page.getBoundingRect(startSelector);

  const { top, height } = await page.getBoundingRect(targetSelector);
  const offset = 10;

  const startX = startBounds.left;
  const startY =
    dragDirection === 'Up'
      ? startBounds.top + startBounds.height
      : startBounds.top;
  const targetX = startBounds.left;
  const targetY = dragDirection === 'Up' ? top - offset : top + height + offset;

  await page.simulateUserDragAndDrop(startX, startY, targetX, targetY);
};

export const buildAdfSingleNodeWithParagraphs = ({
  adfNode,
}: {
  adfNode: ADFEntity;
}) => {
  return {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [],
      },
      adfNode,
      {
        type: 'paragraph',
        content: [],
      },
    ],
  };
};

export const buildAdfBlockIsFirstNode = ({
  adfNode,
}: {
  adfNode: ADFEntity;
}) => {
  return {
    version: 1,
    type: 'doc',
    content: [
      adfNode,
      {
        type: 'paragraph',
        content: [],
      },
    ],
  };
};

export const buildAdfBlockIsLastNode = ({
  adfNode,
}: {
  adfNode: ADFEntity;
}) => {
  return {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [],
      },
      adfNode,
    ],
  };
};

export const buildAdfMultipleNodesWithParagraphs = ({
  adfNode,
}: {
  adfNode: ADFEntity;
}) => {
  return {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [],
      },
      adfNode,
      adfNode,
      adfNode,
      {
        type: 'paragraph',
        content: [],
      },
    ],
  };
};
