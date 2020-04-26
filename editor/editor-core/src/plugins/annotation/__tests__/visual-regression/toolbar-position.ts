import { EditorView } from 'prosemirror-view';
import { Page } from 'puppeteer';
import {
  ExampleCreateInlineCommentComponent,
  ExampleViewInlineCommentComponent,
} from '@atlaskit/editor-test-helpers';
import {
  animationFrame,
  scrollToTop,
  scrollToBottom,
} from '../../../../__tests__/__helpers/page-objects/_editor';
import {
  snapshot,
  initFullPageEditorWithAdf,
} from '../../../../__tests__/visual-regression/_utils';
import adfExperiment from '../__fixtures__/toolbar-position.adf.json';
import { annotationSelectors } from '../_utils';

const evaluateCoordinates = async (page: Page, pos: number) => {
  return await page.evaluate(p => {
    const editor = (window as any).__editorView as EditorView;
    const coords = editor.coordsAtPos(p);

    // returning coords immedaitely causes it to fail
    return {
      top: coords.top,
      left: coords.left,
      right: coords.right,
      bottom: coords.bottom,
    };
  }, pos);
};

const selectAtPos = async (page: Page, startPos: number, endPos: number) => {
  const start = await evaluateCoordinates(page, startPos);
  const end = await evaluateCoordinates(page, endPos);

  await page.mouse.click(start.left, start.top);
  await page.keyboard.down('Shift');
  await page.mouse.click(end.left, end.top);
  await page.keyboard.up('Shift');
};

describe('Annotation toolbar positioning', () => {
  let page: Page;

  beforeAll(async () => {
    page = global.page;
    await initFullPageEditorWithAdf(
      page,
      adfExperiment,
      undefined,
      { width: 1366, height: 768 },
      {
        annotationProvider: {
          createComponent: ExampleCreateInlineCommentComponent,
          viewComponent: ExampleViewInlineCommentComponent,
          providers: {
            inlineComment: {
              pollingInterval: 10000,
              getState: async (annotationsIds: string[]) => {
                return [];
              },
            },
          },
        },
      },
    );

    // wait for page to be ready then enable the editor on title blur
    await page.waitForFunction(() => {
      return (window as any).__editorView !== undefined;
    });
  });

  afterEach(async () => {
    await scrollToTop(page);

    // clear selection after each test
    await page.mouse.click(1, 1);
  });

  describe(`should disable comment button`, () => {
    it(`when selection includes inline nodes`, async () => {
      await scrollToBottom(page);

      await selectAtPos(page, 1654, 1666);
      await snapshot(page);

      // ensure it is disabled
      await page.waitForSelector(
        `${annotationSelectors.floatingToolbarCreate}[disabled]`,
      );
    });
  });

  describe(`should show annotation toolbar`, () => {
    it(`clamp left by top-line left boundary`, async () => {
      await selectAtPos(page, 108, 249);
      await snapshot(page);
    });

    it(`clamp left by left editor boundary`, async () => {
      // select upwards
      await selectAtPos(page, 788, 661);
      await snapshot(page);
    });

    it(`clamp right by top-line right boundary`, async () => {
      await selectAtPos(page, 7, 73);
      await snapshot(page);
    });

    it(`clamp right by right editor boundary`, async () => {
      await selectAtPos(page, 45, 127);
      await snapshot(page);
    });

    it(`no clamp - align to mouse cursor and update as selection changes`, async () => {
      await selectAtPos(page, 142, 281);
      await snapshot(page);

      // update selection
      const lastPosition = await evaluateCoordinates(page, 296);
      await page.keyboard.down('Shift');
      await page.mouse.click(lastPosition.left, lastPosition.top);
      await page.keyboard.up('Shift');
      await snapshot(page);
    });

    it(`across multiple nodes on same line`, async () => {
      await selectAtPos(page, 1018, 1047);
      await snapshot(page);
    });

    it(`across multiple nodes on different lines`, async () => {
      await selectAtPos(page, 1018, 1114);
      await snapshot(page);
    });

    it(`when only whitespace is selected`, async () => {
      await selectAtPos(page, 8, 7);
      await snapshot(page);
    });

    it(`text selection in table cell`, async () => {
      await scrollToBottom(page);

      await selectAtPos(page, 1365, 1390);
      await snapshot(page);
    });
  });

  describe(`should not show annotation toolbar`, () => {
    it(`text selection across table cells`, async () => {
      await scrollToBottom(page);

      await selectAtPos(page, 1365, 1465);
      await animationFrame(page);
      await snapshot(page);
    });
  });
});
