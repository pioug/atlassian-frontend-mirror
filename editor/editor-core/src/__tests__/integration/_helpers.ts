import { Node as PMNode } from 'prosemirror-model';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import sleep from '@atlaskit/editor-test-helpers/sleep';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { ToolbarFeatures } from '../../../example-helpers/ToolsDrawer';
import { EditorAppearance, EditorProps } from '../../types';
import { pluginKey as tableResizingPluginKey } from '../../plugins/table/pm-plugins/table-resizing';
import messages from '../../messages';
import {
  tableSelectors,
  getSelectorForTableCell,
} from '../__helpers/page-objects/_table';
import {
  isPuppeteer,
  PuppeteerPage,
  WebDriverPage,
} from '../__helpers/page-objects/_types';
import { selectors } from '../__helpers/page-objects/_editor';
import { TableCssClassName } from '../../plugins/table/types';
import { messages as insertBlockMessages } from '../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

export { quickInsert } from '../__helpers/page-objects/_extensions';
import { emojiSearch, EMOJI_TRIGGER } from '../__helpers/page-objects/_emoji';
import { mentionSearch } from '../__helpers/page-objects/_mention';

import { getDocFromElement } from '../__helpers/page-objects/_editor';
export { getDocFromElement };

export const expectToMatchDocument = async (page: any, testName: string) => {
  const doc = await page.browser.execute(() => {
    return (window as any).__documentToJSON();
  });

  expect(doc).toMatchCustomDocSnapshot(testName);
};

export const getProsemirrorSelection = async (page: WebDriverPage) => {
  const selection: Selection | undefined = await page.execute(() => {
    var view = (window as any).__editorView;
    if (view) {
      return view.state.selection;
    }
  });
  return selection;
};

export type SelectionMatch = {
  type: string;
  from: number;
  [name: string]: string | boolean | number;
};

export const expectToMatchSelection = async (
  page: WebDriverPage,
  { type, ...opts }: SelectionMatch,
) => {
  const matchesSelection = await page.execute(
    (_type, _opts) => {
      var view = (window as any).__editorView;
      if (view) {
        const { selection } = view.state;
        let isMatch = selection.toJSON().type === _type;
        for (const key in _opts) {
          isMatch = isMatch && selection[key] === _opts[key];
        }
        return isMatch;
      }
      return false;
    },
    type,
    opts,
  );
  if (!matchesSelection) {
    const actual = await getProsemirrorSelection(page);
    // eslint-disable-next-line no-console
    console.error('selections did not match:', {
      actual,
      expected: { type, ...opts },
    });
  }
  expect(matchesSelection).toBe(true);
};

export const editable = selectors.editor;
export const LONG_WAIT_FOR = 5000;
export const typeAheadPicker = '.fabric-editor-typeahead';
export const lozenge = '[data-mention-id="0"]';
export const linkToolbar = '[placeholder="Paste or search for link"]';
export const linkUrlSelector = '[data-testid="link-url"]';
export const linkLabelSelector = '[data-testid="link-label"]';
export const linkRecentList = '.recent-list';

export const insertMention = async (browser: any, query: string) => {
  await mentionSearch(browser, query);
  await browser.keys('Return');
};

export const gotoEditor = async (browser: any) => {
  await browser.goto(fullpage.path);
  await browser.waitForSelector(fullpage.placeholder);
  await browser.click(fullpage.placeholder);
  await browser.waitForSelector(editable);
};

/** Empty title and url fields of link toolbar */
export const manuallyEmptyLinkToolbar = async (page: WebDriverPage) => {
  await page.emptyTextFieldByBackspacing(linkLabelSelector);
  await page.emptyTextFieldByBackspacing(linkUrlSelector);
};

/** Empty url field of link toolbar */
export const clearLinkToolbarUrl = async (page: WebDriverPage) => {
  await page.emptyTextFieldByBackspacing(linkUrlSelector);
};

/** Empty title field of link toolbar */
export const clearLinkToolbarTitle = async (page: WebDriverPage) => {
  await page.emptyTextFieldByBackspacing(linkLabelSelector);
};

export const insertMentionUsingClick = async (
  browser: any,
  mentionId: string,
) => {
  await browser.type(editable, '@');
  await browser.waitForSelector(typeAheadPicker);
  await browser.isVisible(`div[data-mention-id="${mentionId}"`);
  await browser.click(`div[data-mention-id="${mentionId}"`);
};

interface EditorHelper {
  name: string;
  appearance: EditorAppearance;
  path: string;
  placeholder: string;
}

export const comment: EditorHelper = {
  name: 'comment',
  appearance: 'comment',
  path: getExampleUrl('editor', 'editor-core', 'comment'),
  placeholder: '[placeholder="What do you want to say?"]',
};

export const fullpage: EditorHelper = {
  name: 'fullpage',
  appearance: 'full-page',
  path: getExampleUrl('editor', 'editor-core', 'full-page-with-toolbar'),
  placeholder: '.ProseMirror',
};

export const basic: EditorHelper = {
  name: 'basic',
  appearance: 'comment',
  path: getExampleUrl('editor', 'editor-core', 'basic'),
  placeholder: '.ProseMirror',
};

export const fullpageDisabled: EditorHelper = {
  name: 'fullpage-disabled',
  appearance: 'full-page',
  path: getExampleUrl(
    'editor',
    'editor-core',
    'full-page-with-content-disabled-flexi-tables',
  ),
  placeholder: '.ProseMirror',
};

export const fullpageWithImport: EditorHelper = {
  name: 'fullpage-with-import',
  appearance: 'full-page',
  path: getExampleUrl('editor', 'editor-core', 'full-page-with-adf-import'),
  placeholder: '.ProseMirror',
};

export const editors = [comment, fullpage];

export const clipboardHelper = getExampleUrl(
  'editor',
  'editor-core',
  'clipboard-helper',
);

export const clipboardInput = 'textarea';

export const copyAsPlaintextButton = '.copy-as-plaintext';
export const copyAsHTMLButton = '.copy-as-html';

/**
 * Copies plain text or HTML to clipboard for tests that need to paste
 */
export const copyToClipboard = async (
  page: WebDriverPage,
  text: string,
  copyAs: 'plain' | 'html' = 'plain',
) => {
  await page.goto(clipboardHelper);
  await page.isVisible(clipboardInput);
  await page.type(clipboardInput, text);
  await page.click(
    copyAs === 'html' ? copyAsHTMLButton : copyAsPlaintextButton,
  );
};

export async function copyAsPlainText(page: WebDriverPage, data: string) {
  await page.isVisible(clipboardInput);
  await page.clear(clipboardInput);
  await page.type(clipboardInput, data);
  await page.click(copyAsPlaintextButton);
}

export async function copyAsHTML(page: WebDriverPage, data: string) {
  await page.isVisible(clipboardInput);
  await page.clear(clipboardInput);
  await page.type(clipboardInput, data);
  await page.click(copyAsHTMLButton);
}

export const mediaInsertDelay = 1000;

const mediaPickerMock = '.mediaPickerMock';
export const setupMediaMocksProviders = async (page: WebDriverPage) => {
  // enable the media picker mock
  await page.waitForSelector(mediaPickerMock);
  await page.click(mediaPickerMock);

  // since we're mocking and aren't uploading a real endpoint, skip authenticating
  // (this also skips loading from a https endpoint which we can't do from inside the http-only netlify environment)
  await page.click('.mediaProvider-resolved-no-auth-provider');

  // reload the editor so that media provider changes take effect
  await rerenderEditor(page);
};

/**
 * Toggles a given feature on a page with a toolbar.
 */
export const toggleFeature = async (
  page: WebDriverPage,
  name: keyof ToolbarFeatures,
) => {
  const selector = `.toggleFeature-${name}`;
  await page.waitForSelector(selector);
  await page.click(selector);
};

/**
 * Enables or disables a given feature on a page with a toolbar.
 */
export const setFeature = async (
  page: WebDriverPage,
  name: keyof ToolbarFeatures,
  enable: boolean,
) => {
  const enableSelector = `.disableFeature-${name}`;
  const isEnabled = get$$Length(await page.$$(enableSelector));

  // toggle it if it requires enabling
  if ((enable && !isEnabled) || (!enable && isEnabled)) {
    await toggleFeature(page, name);
  }
};

/**
 * Re-renders the current editor on a page with a toolbar.
 */
export const rerenderEditor = async (browser: any) => {
  await browser.click('.reloadEditorButton');
};

// This function assumes the media picker modal is already shown.
export const insertMediaFromMediaPicker = async (
  page: WebDriverPage | PuppeteerPage,
  filenames = ['one.svg'],
  fileSelector = 'div=%s',
) => {
  const insertMediaButton = '[data-testid="media-picker-insert-button"]';
  const mediaCardSelector = `${editable} .img-wrapper`;
  const existingMediaCards = await page.$$(mediaCardSelector);
  // wait for media item, and select it
  await page.waitForSelector(
    '[data-testid="media-picker-popup"] [data-testid="media-file-card-view"][data-test-media-name="one.svg"]',
  );
  if (filenames) {
    for (const filename of filenames) {
      const selector = fileSelector.replace('%s', filename);
      await page.waitFor(selector);
      await page.click(selector);
    }
  }
  // wait for insert button to show up and
  // insert it from the picker dialog
  await page.waitForSelector(insertMediaButton);
  await page.click(insertMediaButton);
  await page.waitFor('.img-wrapper');

  // Wait until we have found media-cards for all inserted items.
  const mediaCardCount = get$$Length(existingMediaCards) + filenames.length;

  if (!isPuppeteer(page)) {
    // Workaround - we need to use different wait methods depending on where we are running.
    if (page.hasCapabilities()) {
      await page.waitUntil(async () => {
        const mediaCards = await page.$$(mediaCardSelector);

        // media picker can still be displayed after inserting an image after some small time
        // wait until it's completely disappeared before continuing
        const insertButtons = await page.$$(insertMediaButton);
        return (
          get$$Length(mediaCards) === mediaCardCount &&
          get$$Length(insertButtons) === 0
        );
      });
    } else {
      await page.execute(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await page.waitUntil(() =>
        page.execute(
          (mediaCardSelector: any, mediaCardCount: any) => {
            const mediaCards = document.querySelectorAll(mediaCardSelector);
            return mediaCards.length === mediaCardCount;
          },
          mediaCardSelector,
          mediaCardCount,
        ),
      );
    }
  }
};

export const insertMedia = async (
  page: WebDriverPage | PuppeteerPage,
  filenames = ['one.svg'],
  fileSelector = 'div=%s',
) => {
  let mediaPickerHasOpened = false;
  const attempts = 3;
  for (let i = 0; i < attempts; i++) {
    const openMediaPopup = `button:enabled  [aria-label="${insertBlockMessages.filesAndImages.defaultMessage}"]`;
    // wait for media button in toolbar and click it
    await page.waitForSelector(openMediaPopup);
    // Potential fix for EDM-486. The theory is media picker is not opening with following click
    // is because click handler hasn't been assigned yet for some reason.
    await sleep(300);
    await page.click(openMediaPopup);
    try {
      await page.waitForSelector('[data-testid="media-picker-popup"]');
      mediaPickerHasOpened = true;
      break;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        `Clicking ${insertBlockMessages.filesAndImages.defaultMessage} toolbar button did not yielded media picker popup.`,
      );
    }
  }
  if (!mediaPickerHasOpened) {
    throw new Error(
      `After ${attempts} clicking ${insertBlockMessages.filesAndImages.defaultMessage} toolbar button did not yielded media picker popup.`,
    );
  }

  await insertMediaFromMediaPicker(page, filenames, fileSelector);
};

export const removeMedia = async (page: WebDriverPage) => {
  await page.waitForSelector('[data-testid="media-card-view"]');
  await page.click('[data-testid="media-card-view"]');
  // The reason we are not using toolbar buttons is problem in Safari successfully clicking on a
  // floating toolbar that is bellow the screen (in case if image is heigher then the viewport)
  // See "Note:" over here https://webdriver.io/docs/api/element/click.html
  await page.keys('Backspace');
  // wait image to be removed
  await page.waitForSelector(
    '[data-testid="media-card-view"]',
    undefined,
    true,
  );
};

/**
 * We use $$ in the context of selenium and puppeteer, which return different results.
 */
const get$$Length = (result: any) => {
  if (Array.isArray(result)) {
    // Puppeteer result
    return result.length;
  } else {
    // Webdriver result
    return result.value.length;
  }
};

/**
 * Insert a block using the menu item
 * @param browser Webdriver browser
 * @param menuTitle Search pattern (placeholder or aria-label)
 * @param tagName Tag to look
 * @param mainToolbar Flag to look the menu in the main toolbar instead of insert menu
 */
export const insertBlockMenuItem = async (
  browser: any,
  menuTitle: string,
  tagName = 'span',
  mainToolbar = false,
) => {
  let menuSelector: string;
  if (mainToolbar) {
    menuSelector = `[aria-label="${menuTitle}"]`;
  } else {
    // Open insert menu and try to look the menu there
    const openInsertBlockMenuSelector = `[aria-label="${insertBlockMessages.insertMenu.defaultMessage}"]`;

    await browser.click(openInsertBlockMenuSelector);

    menuSelector = `${tagName}=${menuTitle}`;
  }

  await browser.waitForSelector(menuSelector);
  await browser.click(menuSelector);
};

export const changeSelectedNodeLayout = async (
  page: any,
  layoutName: string,
) => {
  const buttonSelector = `div[aria-label="Floating Toolbar"] span[aria-label="${layoutName}"]`;
  await page.waitForSelector(buttonSelector, { timeout: 3000 });
  await page.click(buttonSelector);
};

export const toggleBreakout = async (page: any, times: number) => {
  const timesArray = Array.from({ length: times });

  const breakoutSelector = [
    messages.layoutFixedWidth.defaultMessage,
    messages.layoutWide.defaultMessage,
    messages.layoutFullWidth.defaultMessage,
  ]
    .map((label) => `[aria-label="${label}"]`)
    .join();

  for (let _iter of timesArray) {
    await page.waitForSelector(breakoutSelector);
    await page.click(breakoutSelector);
    await animationFrame(page);
  }
};

export const forEach = async (
  array: Array<any>,
  cb: (item: any, index: number) => Promise<void>,
) => {
  let idx = 0;
  for (let item of array) {
    await cb(item, idx++);
  }
};

export const insertMenuItem = async (browser: any, title: string) => {
  await browser.waitForSelector(`button span[aria-label="${title}"]`);
  await browser.click(`button span[aria-label="${title}"]`);
};

export const currentSelectedEmoji = '.emoji-typeahead-selected';
export const typeahead = '[data-type-ahead-query]';

export const insertEmoji = async (browser: any, query: string) => {
  await emojiSearch(browser, query, true);
};

export const insertEmojiBySelect = async (browser: any, select: string) => {
  await emojiSearch(browser, select);

  const fullQuery = EMOJI_TRIGGER.concat(select).concat(EMOJI_TRIGGER);
  await browser.isVisible(`[data-emoji-id="${fullQuery}"]`);
  await browser.click(`[data-emoji-id="${fullQuery}"]`);
};

export const currentSelectedEmojiShortName = async (browser: any) => {
  return await browser.getProperty(currentSelectedEmoji, 'data-emoji-id');
};

export const highlightEmojiInTypeahead = async (
  browser: any,
  emojiShortName: string,
  depth = 5,
) => {
  for (let i = 0; i < depth; i++) {
    let selectedEmojiShortName = await currentSelectedEmojiShortName(browser);
    if (selectedEmojiShortName === `:${emojiShortName}:`) {
      break;
    }
    await browser.keys(['ArrowDown']);
  }
};

export const emojiItem = (emojiShortName: string): string => {
  return `span[shortname=":${emojiShortName}:"]`;
};

interface ResizeOptions {
  cellHandlePos: number;
  // TODO could make this an array, to simulate dragging back and forth.
  resizeWidth: number;
  startX?: number;
}

export const updateEditorProps = async (
  page: any,
  newProps: Partial<EditorProps>,
) => {
  await page.browser.execute((props: EditorProps) => {
    (window as any).__updateEditorProps(props);
  }, newProps);
};

export const setProseMirrorTextSelection = async (
  page: any,
  pos: { anchor: number; head?: number },
) => {
  await page.browser.execute(
    (anchor: number, head: number) => {
      var view = (window as any).__editorView;
      view.dispatch(
        view.state.tr.setSelection(
          // Re-use the current selection (presumed TextSelection) to use our new positions.
          view.state.selection.constructor.create(view.state.doc, anchor, head),
        ),
      );
      view.focus();
    },
    pos.anchor,
    pos.head || pos.anchor,
  );
};

export const getProseMirrorPos = async (page: any): Promise<number> => {
  return await page.browser.execute(() => {
    var view = (window as any).__editorView;
    return view.state.selection.from;
  });
};

export const resizeColumn = async (page: any, resizeOptions: ResizeOptions) => {
  await page.browser.execute(
    (
      tableResizingPluginKey: any,
      resizeWidth: any,
      resizeHandlePos: any,
      startX: any,
    ) => {
      const view = (window as any).__editorView;

      if (!view) {
        return;
      }

      view.dispatch(
        view.state.tr.setMeta(tableResizingPluginKey, {
          type: 'SET_RESIZE_HANDLE_POSITION',
          data: {
            resizeHandlePos,
          },
        }),
      );

      view.dom.dispatchEvent(new MouseEvent('mousedown', { clientX: startX }));

      // Visually resize table
      for (
        let i = Math.min(0, resizeWidth);
        i < Math.max(0, resizeWidth);
        i++
      ) {
        window.dispatchEvent(
          new MouseEvent('mousemove', { clientX: startX + i }),
        );
      }

      // Trigger table resizing finish handlers
      window.dispatchEvent(
        new MouseEvent('mouseup', { clientX: startX + resizeWidth }),
      );
    },
    tableResizingPluginKey,
    resizeOptions.resizeWidth,
    resizeOptions.cellHandlePos,
    resizeOptions.startX || 600,
  );
};

export const animationFrame = async (page: any) => {
  await page.browser.executeAsync((done: (time: number) => void) => {
    window.requestAnimationFrame(done);
  });
};

export const hoverResizeHandler = async (
  page: any,
  row: number,
  column: number,
) => {
  const tableCellSelector = getSelectorForTableCell({ row, cell: column });
  const cell = await page.getBoundingRect(tableCellSelector);

  const x = cell.width - 5;
  await page.moveTo(tableCellSelector, x, cell.height / 2 + 10);
  await animationFrame(page);
  await animationFrame(page);

  await page.waitForSelector(
    `${tableCellSelector} .${TableCssClassName.RESIZE_HANDLE_DECORATION}`,
  );
  await animationFrame(page);
};

export const doubleClickResizeHandle = async (
  page: any,
  row: number,
  column: number,
) => {
  const tableCellSelector = getSelectorForTableCell({ row, cell: column });

  const cell = await page.getBoundingRect(tableCellSelector);

  // We need to move the mouse first, giving time to prosemirror catch the event
  // and add the decorations
  // TODO: fix moveTo for Safari
  await page.moveTo(tableCellSelector, cell.width - 1, 0);
  const selector = `${tableCellSelector} .${TableCssClassName.RESIZE_HANDLE_DECORATION}`;
  await page.waitForSelector(selector);
  const resizeHandler = await page.browser.$(selector);
  await resizeHandler.doubleClick();
};

export const selectColumns = async (page: any, indexes: number[]) => {
  for (let i = 0, count = indexes.length; i < count; i++) {
    const controlSelector = `.${TableCssClassName.COLUMN_CONTROLS_DECORATIONS}[data-start-index="${indexes[i]}"]`;
    await page.waitForSelector(controlSelector);
    if (i > 0) {
      await page.browser.keys(['Shift']);
    }
    await page.click(controlSelector);
    await page.waitForSelector(tableSelectors.selectedCell);
  }
};

export const insertLongText = async (page: WebDriverPage) => {
  await page.type(
    editable,
    [
      'This',
      'is',
      'my',
      'page',
      'with',
      'lots',
      'of',
      'content',
      'because',
      'I',
      'need',
      'to',
      'test',
      'in',
      'an',
      'editor',
      'with',
      'lots',
      'of',
      'content',
    ].reduce((acc, text) => acc.concat([text, 'Enter']), [] as string[]),
  );
};

export const sendKeyNumTimes = async (
  page: WebDriverPage,
  key: string,
  { numTimes = 1 }: { numTimes?: number } = {},
) => {
  for (const _i of Array(numTimes).fill(null)) {
    await page.keys(key);
  }
};

export const getProseMirrorDocument = async (page: WebDriverPage) => {
  const jsonDocument = await page.$eval(selectors.editor, getDocFromElement);
  const pmDocument = PMNode.fromJSON(sampleSchema, jsonDocument);

  // Removing any localId attribute
  pmDocument.descendants((node) => {
    if (node?.attrs?.localId) {
      node.attrs.localId = '';
    }

    return true;
  });

  return pmDocument;
};
