import { Page } from './_types';
import { ElementHandle } from 'puppeteer';

export const selectors = {
  editor: '.ProseMirror',
  lastEditorElement: '.ProseMirror > *:last-child',
  firstEditorParagraph: '.ProseMirror > p:first-child',
  lastEditorParagraph: '.ProseMirror > p:last-child',
  selectedNode: '.ProseMirror-selectednode',
  scrollContainer: '.fabric-editor-popup-scroll-parent',
  dropList: 'div[data-role="droplistContent"]',
  emojiPicker: 'div[data-emoji-picker-container="true"]',
  mentionQuery: 'span[data-type-ahead-query]',
  gapCursor: '.ProseMirror-gapcursor',
  layoutDataSection: '[data-layout-section="true"]',
  panelContent: '.ak-editor-panel__content',
  codeContent: '.code-content',
  actionList: '[data-node-type="actionList"]',
};

export async function clickEditableContent(page: Page) {
  await page.waitForSelector(selectors.editor);
  await page.click(selectors.editor);
}

const replaceInputStr = (str: string) => {
  return `concat('${str.replace(/'/g, `', "'", '`)}', '')`;
};

const getElementPathWithText = (text: string, htmlTag: string = 'span') =>
  `//${htmlTag}[contains(text(), ${replaceInputStr(text)})]`;

export const waitForElementWithText = async (
  page: Page,
  text: string,
  htmlTag = 'span',
) => {
  const elementPath = getElementPathWithText(text, htmlTag);
  await page.waitForXPath(elementPath, { timeout: 5000 });
};

export const clickElementWithText = async ({
  page,
  tag,
  text,
}: {
  page: Page;
  tag: string;
  text: string;
}) => {
  const elementPath = getElementPathWithText(text, tag);
  const target: ElementHandle = await page.waitForXPath(elementPath, {
    timeout: 5000,
  });
  await target.click();
};

export const hoverElementWithText = async ({
  page,
  tag,
  text,
}: {
  page: Page;
  tag: string;
  text: string;
}) => {
  const elementPath = getElementPathWithText(text, tag);
  await page.waitForXPath(elementPath, { timeout: 5000 });
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

export async function typeInEditor(page: Page, text: string) {
  await page.click(selectors.editor);
  await page.type(selectors.editor, text);
}

export async function setCaretInNewParagraphAtTheEnd(page: Page) {
  // To find the end of the document in a content agnostic way we click beneath
  // the last content node to insert a new paragaph prior to typing.
  // Complex node structures which support nesting (e.g. tables) make standard
  // clicking, focusing, and key pressing not suitable in an agnostic way.
  await scrollToElement(page, selectors.lastEditorElement);
  const bounds = await getBoundingRect(page, selectors.lastEditorElement);

  await page.mouse.click(bounds.left, bounds.top + bounds.height - 5);
}

export async function typeInEditorAtEndOfDocument(
  page: Page,
  text: string,
  options?: any,
) {
  await setCaretInNewParagraphAtTheEnd(page);
  await scrollToElement(page, selectors.lastEditorParagraph);

  await page.type(selectors.lastEditorParagraph, text, options);
}

export async function getEditorWidth(page: Page) {
  return page.$eval(selectors.editor, (el: Element) => el.clientWidth);
}

export async function scrollToElement(
  page: Page,
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

export async function scrollToTop(page: Page) {
  return await scrollToTopBottom(page, 'top');
}

export async function scrollToBottom(page: Page) {
  return await scrollToTopBottom(page, 'bottom');
}

async function scrollToTopBottom(page: Page, position: 'top' | 'bottom') {
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
