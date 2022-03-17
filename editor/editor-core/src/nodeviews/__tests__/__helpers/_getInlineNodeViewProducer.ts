import { getBoundingRect } from '../../../__tests__/__helpers/page-objects/_editor';
import { WebDriverPage } from '../../../__tests__/__helpers/page-objects/_types';
import {
  doc,
  DocBuilder,
  p,
  table,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

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
  const targetY = bounds.top - 10;

  await page.simulateUserDragAndDrop(startX, startY, targetX, targetY);
};

export const buildAdf = async ({
  node,
  trailingSpaces,
  multiLineNode,
}: {
  node: DocBuilder;
  trailingSpaces: boolean;
  multiLineNode: boolean;
}) => {
  if (multiLineNode) {
    return buildMultilineNodeAdf(node);
  }
  return trailingSpaces
    ? doc(p(node, ' ', node, ' ', node, ' '))(sampleSchema)
    : doc(p(node, node, node))(sampleSchema);
};

const buildMultilineNodeAdf = async (node: DocBuilder) => {
  return doc(
    table({ isNumberColumnEnabled: false, layout: 'default' })(
      tr(
        th({ colwidth: [50] })(p(node, node, node)),
        th({ colwidth: [350] })(p()),
        th({ colwidth: [276] })(p()),
      ),
    ),
    p(),
  )(sampleSchema);
};
