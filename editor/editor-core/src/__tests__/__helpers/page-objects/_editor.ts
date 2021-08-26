import { EditorView } from 'prosemirror-view';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import type { default as WebDriverPage } from '@atlaskit/webdriver-runner/wd-wrapper';
import { annotationSelectors } from '../../../plugins/annotation/__tests__/_utils';

export const selectors = {
  editor: '.ProseMirror',
  lastEditorElement: '.ProseMirror > *:last-child',
  firstEditorParagraph: '.ProseMirror > p:first-of-type',
  firstEditorChildParagraph: '.ProseMirror > p:first-child',
  lastEditorChildParagraph: '.ProseMirror > p:last-child',
  selectedNode: '.ProseMirror-selectednode',
  scrollContainer: '.fabric-editor-popup-scroll-parent',
  dropList: 'div[data-role="droplistContent"]',
  emojiPicker: 'div[data-emoji-picker-container="true"]',
  mentionQuery: '[data-trigger="@"][data-type-ahead-query]',
  quickInsert: '[data-trigger="/"][data-type-ahead-query]',
  typeaheadPopup: '.fabric-editor-typeahead [role="listbox"]',
  emojiQuery: '[data-trigger=":"][data-type-ahead-query]',
  gapCursor: '.ProseMirror-gapcursor',
  layoutDataSection: '[data-layout-section="true"]',
  panelContent: '.ak-editor-panel__content',
  codeContent: '.code-content',
  actionList: '[data-node-type="actionList"]',
  undoButton: '[data-testid="ak-editor-toolbar-button-undo"]',
  redoButton: '[data-testid="ak-editor-toolbar-button-redo"]',
};

export enum timeouts {
  SHORT = 1000,
  DEFAULT = 5000,
}

export async function clickEditableContent(page: PuppeteerPage) {
  await page.waitForSelector(selectors.editor);
  await page.click(selectors.editor);
}

export async function clickFirstParagraph(page: PuppeteerPage | WebDriverPage) {
  await page.waitForSelector(selectors.firstEditorParagraph);
  await page.click(selectors.firstEditorParagraph);
}

/**
 * This function needs to be called in the browser context.
 * Make sure you call `toJSON` otherwise you will get:
 *   Unknown error: Maximum call stack size exceeded
 *
 * Don't get too fancy with it ;)
 */
export const getDocFromElement = (el: any) => el.pmViewDesc.node.toJSON();

const replaceInputStr = (str: string) => {
  return `concat('${str.replace(/'/g, `', "'", '`)}', '')`;
};

const getElementPathWithText = (text: string, htmlTag: string = 'span') =>
  `//${htmlTag}[contains(text(), ${replaceInputStr(text)})]`;

export const waitForElementWithText = async (
  page: PuppeteerPage,
  text: string,
  htmlTag = 'span',
) => {
  const elementPath = getElementPathWithText(text, htmlTag);
  return await page.waitForXPath(elementPath, { timeout: timeouts.DEFAULT });
};

export const clickElementWithText = async ({
  page,
  tag,
  text,
}: {
  page: PuppeteerPage;
  tag: string;
  text: string;
}) => {
  const elementPath = getElementPathWithText(text, tag);
  const target = await page.waitForXPath(elementPath, {
    timeout: timeouts.DEFAULT,
  });
  await target?.click();
};

export const selectElementWithText = async ({
  page,
  tag,
  text,
}: {
  page: PuppeteerPage;
  tag: string;
  text: string;
}) => {
  const elementPath = getElementPathWithText(text, tag);
  const target = await page.waitForXPath(elementPath, {
    timeout: timeouts.DEFAULT,
  });

  const box = await target?.boundingBox();
  if (box) {
    const { x, y, width, height } = box;
    await setSelection(
      page,
      { x: x, y: y + height / 2 },
      { x: x + width, y: y + height / 2 },
    );
  }
};

export const setSelection = async (
  page: PuppeteerPage,
  from: { x: number; y: number },
  to: { x: number; y: number },
) => {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await animationFrame(page);
  await page.mouse.move(to.x, to.y);
  await animationFrame(page);
  await page.mouse.up();
  await animationFrame(page);
};

export const hoverElementWithText = async ({
  page,
  tag,
  text,
}: {
  page: PuppeteerPage;
  tag: string;
  text: string;
}) => {
  const elementPath = getElementPathWithText(text, tag);
  await page.waitForXPath(elementPath, { timeout: timeouts.DEFAULT });
  const target = await page.$x(elementPath);
  expect(target.length).toBeGreaterThan(0);
  await target[0].hover();
};

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
}
export const getBoundingRect = async (
  page: any,
  selector: string,
): Promise<Rect> => {
  await page.waitForSelector(selector, { visible: true });
  return await page.evaluate((selector: string) => {
    const element = document.querySelector(selector);

    if (!element) {
      return { left: 0, top: 0, width: 0, height: 0, id: undefined };
    }

    const { x, y, width, height } = element.getBoundingClientRect() as DOMRect;
    return { left: x, top: y, width, height, id: element.id };
  }, selector);
};

// Execute the click using page.evaluate
// There appears to be a bug in Puppeteer which causes the
// "Node is either not visible or not an HTMLElement" error.
// https://product-fabric.atlassian.net/browse/ED-5688
export const evaluateClick = (page: any, selector: string) => {
  return page.evaluate((selector: string) => {
    (document.querySelector(selector)! as HTMLElement).click();
  }, selector);
};

export async function animationFrame(page: any) {
  // Give browser time to render, waitForFunction by default fires on RAF.
  await page.waitForFunction('1 === 1');
}

export async function typeInEditor(page: PuppeteerPage, text: string) {
  await page.click(selectors.editor);
  await page.type(selectors.editor, text);
}

export async function setCaretInNewParagraphAtTheEnd(page: PuppeteerPage) {
  // To find the end of the document in a content agnostic way we click beneath
  // the last content node to insert a new paragaph prior to typing.
  // Complex node structures which support nesting (e.g. tables) make standard
  // clicking, focusing, and key pressing not suitable in an agnostic way.
  await scrollToElement(page, selectors.lastEditorElement);
  const bounds = await getBoundingRect(page, selectors.lastEditorElement);

  await page.mouse.click(bounds.left, bounds.top + bounds.height - 5);
}

export async function typeInEditorAtEndOfDocument(
  page: PuppeteerPage,
  text: string,
  options?: any,
) {
  await setCaretInNewParagraphAtTheEnd(page);
  await scrollToElement(page, selectors.lastEditorChildParagraph);

  await page.type(selectors.lastEditorChildParagraph, text, options);
}

export async function getEditorWidth(page: PuppeteerPage) {
  return page.$eval(selectors.editor, (el: Element) => el.clientWidth);
}

export async function scrollToElement(
  page: PuppeteerPage,
  elementSelector: string,
  padding: number = 0,
) {
  return page.evaluate(
    (editorScrollSelector: string, elementSelector: string) => {
      const editorScroll = document.querySelector(
        editorScrollSelector,
      ) as HTMLElement;
      const element = document.querySelector(elementSelector);
      if (!editorScroll || !element) {
        return;
      }

      element.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'auto',
      });
    },
    selectors.scrollContainer,
    elementSelector,
    padding,
  );
}

export async function scrollToTop(page: PuppeteerPage) {
  return await scrollToTopBottom(page, 'top');
}

export async function scrollToBottom(page: PuppeteerPage) {
  return await scrollToTopBottom(page, 'bottom');
}

async function scrollToTopBottom(
  page: PuppeteerPage,
  position: 'top' | 'bottom',
) {
  return page.evaluate(
    (editorScrollSelector: string, position: 'top' | 'bottom') => {
      const editorScroll = document.querySelector(
        editorScrollSelector,
      ) as HTMLElement;
      if (!editorScroll) {
        return;
      }

      const yPos = position === 'bottom' ? editorScroll.scrollHeight : 0;
      editorScroll.scrollTo(0, yPos);
    },
    selectors.scrollContainer,
    position,
  );
}

/**
 * Use `evaluateCoordinates` to compute the DOM coordinates (top, left,
 * right, bottom) of a specific editor position.
 */
export const evaluateCoordinates = async (page: PuppeteerPage, pos: number) => {
  return await page.evaluate((p) => {
    const editor = (window as any).__editorView as EditorView;
    const coords = editor.coordsAtPos(p);

    /**
     * Returning coords immediately causes it to fail
     * If the position contains a DOM element, `coordsAtPos` return `DOMRect`
     * DOMRect - { bottom, height, left, right, top, width, x, y }
     */
    return {
      top: coords.top,
      left: coords.left,
      right: coords.right,
      bottom: coords.bottom,
    };
  }, pos);
};

/**
 * Use `selectAtPos` to manually select content across
 * an editor position range, by passing the `startPos`
 * and `endPos` parameters.
 */
export const selectAtPos = async (
  page: PuppeteerPage,
  startPos: number,
  endPos: number,
  waitForCreateCommentButton = true,
) => {
  const start = await evaluateCoordinates(page, startPos);
  const end = await evaluateCoordinates(page, endPos);

  await page.mouse.move(
    (start.left + start.right) / 2,
    (start.top + start.bottom) / 2,
  );
  await page.mouse.down();
  await page.mouse.move((end.left + end.right) / 2, (end.top + end.bottom) / 2);
  await page.mouse.up();

  if (waitForCreateCommentButton) {
    await page.waitForSelector(`${annotationSelectors.floatingToolbarCreate}`);
  }
};

export const selectAtPosWithProseMirror = async (
  page: PuppeteerPage,
  startPos: number,
  endPos: number,
) => {
  return await page.evaluate(
    (startPos, endPos) => {
      const view = (window as any).__editorView as any;
      view.dispatch(
        view.state.tr.setSelection(
          // Re-use the current selection (presumed TextSelection) to use our new positions.
          view.state.selection.constructor.create(
            view.state.doc,
            startPos,
            endPos,
          ),
        ),
      );
      view.focus();
    },
    startPos,
    endPos,
  );
};
