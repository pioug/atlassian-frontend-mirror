import { rendererTestCase as test, expect } from './not-libra';
import {
  helloEmojiAdf,
  helloAdf,
  loremLoremAdf,
  decisionListAdf,
  taskListAdf,
  bigNestedAdf,
  helloMateEmojiAdf,
} from './annotate.spec.ts-fixtures';

const CHAR_WIDTH = 6;
const rendererMountOptions = { withRendererActions: true };

test.describe('annotations', () => {
  test.use({ rendererMountOptions });

  test.describe('when text selection that contains inline nodes', () => {
    test.use({ adf: helloMateEmojiAdf });

    test(`Can't create an annotation on a text selection that contains inline nodes`, async ({
      renderer,
    }) => {
      const paragraphs = renderer.page.locator('p');

      const box = await paragraphs.first().boundingBox();

      const middleBox = box!.y + box!.height / 2;
      await renderer.page.mouse.move(box!.x, middleBox);
      await renderer.page.mouse.down();
      await renderer.page.mouse.move(box!.x + box!.width, middleBox);
      await renderer.page.mouse.up();

      const result = await renderer.annotation.simulateAnnotationAtSelection(
        'fake-id-1',
      );

      await expect(result).toBe(false);
    });
  });

  test.describe('when text selection that falls in the middle of an inline node', () => {
    test.use({ adf: helloEmojiAdf });
    test(`Can't create an annotation`, async ({ renderer }) => {
      const paragraphs = renderer.page.locator('p');

      const box = await paragraphs.first().boundingBox();

      const middleBox = box!.y + box!.height / 2;
      const THREE_CHARS_WIDTH = CHAR_WIDTH * 3;
      await renderer.page.mouse.move(box!.x, middleBox);
      await renderer.page.mouse.down();
      await renderer.page.mouse.move(box!.x + THREE_CHARS_WIDTH, middleBox);
      await renderer.page.mouse.up();

      const result = await renderer.annotation.simulateAnnotationAtSelection(
        'fake-id-1',
      );

      await expect(result).toBe(false);
    });
  });

  test.describe('when selecting basic text', () => {
    test.use({ adf: helloAdf });
    test('Can create an annotation', async ({ renderer }) => {
      const paragraphs = renderer.page.locator('p');

      const box = await paragraphs.first().boundingBox();

      const middleBox = box!.y + box!.height / 2;
      await renderer.page.mouse.move(box!.x, middleBox);
      await renderer.page.mouse.down();
      await renderer.page.mouse.move(box!.x + CHAR_WIDTH, middleBox);
      await renderer.page.mouse.up();

      const result = await renderer.annotation.simulateAnnotationAtSelection(
        'fake-id-1',
      );

      await expect(result).toMatchDocumentSnapshot();
    });
  });

  test.describe('when selecting multiple paragraphs', () => {
    test.use({ adf: loremLoremAdf });

    test('Can create an annotation on a text selection over two paragraphs', async ({
      renderer,
    }) => {
      const paragraphs = renderer.page.locator('p');

      const box = await paragraphs.first().boundingBox();
      const box2 = await paragraphs.last().boundingBox();

      const middleBox = box!.y + box!.height / 2;
      const middleBox2 = box2!.y + box2!.height / 2;

      await renderer.page.mouse.move(box!.x, middleBox);
      await renderer.page.mouse.down();
      await renderer.page.mouse.move(box2!.x + box2!.width, middleBox2);
      await renderer.page.mouse.up();

      const result = await renderer.annotation.simulateAnnotationAtSelection(
        'fake-id-1',
      );

      await expect(result).toMatchDocumentSnapshot();
    });
  });

  test.describe('when selecting a decision item', () => {
    test.use({ adf: decisionListAdf });

    test('Can create an annotation on a text selection over a decision item', async ({
      renderer,
    }) => {
      const paragraphs = renderer.page.locator('p');

      const box = await paragraphs.first().boundingBox();
      const box2 = await paragraphs.last().boundingBox();

      const middleBox = box!.y + box!.height / 2;
      const middleBox2 = box2!.y + box2!.height / 2;

      await renderer.page.mouse.move(box!.x, middleBox);
      await renderer.page.mouse.down();
      await renderer.page.mouse.move(box2!.x + CHAR_WIDTH, middleBox2);
      await renderer.page.mouse.up();

      const result = await renderer.annotation.simulateAnnotationAtSelection(
        'fake-id-1',
      );

      await expect(result).toMatchDocumentSnapshot();
    });
  });

  test.describe('when selecting a task item', () => {
    test.use({ adf: taskListAdf });
    test('Can create an annotation on a text selection over a task item', async ({
      renderer,
    }) => {
      const paragraphs = renderer.page.locator('p');

      const box = await paragraphs.first().boundingBox();
      const box2 = await paragraphs.last().boundingBox();

      const middleBox = box!.y + box!.height / 2;
      const middleBox2 = box2!.y + box2!.height / 2;

      await renderer.page.mouse.move(box!.x, middleBox);
      await renderer.page.mouse.down();
      await renderer.page.mouse.move(box2!.x + CHAR_WIDTH, middleBox2);
      await renderer.page.mouse.up();

      const result = await renderer.annotation.simulateAnnotationAtSelection(
        'fake-id-1',
      );

      await expect(result).toMatchDocumentSnapshot();
    });
  });
});

const PARAGRAPH_INSIDE_TABLE_CONTAINER = '.pm-table-container p';
const PARAGRAPAH_INSIDE_LIST_INSIDE_PANEL_INSIDE_TABLE_CONTAINER =
  '.pm-table-container p';
test.describe('annotations: nested', () => {
  test.use({ adf: bigNestedAdf });
  test.use({ rendererMountOptions });

  test(`Can create an annotation on nested text inside a list inside a table`, async ({
    renderer,
  }) => {
    const firstParagraphInsideTable = renderer.page
      .locator(PARAGRAPH_INSIDE_TABLE_CONTAINER)
      .first();
    const paragraphInsideAListInsidePanelInsideATable = renderer.page
      .locator(PARAGRAPAH_INSIDE_LIST_INSIDE_PANEL_INSIDE_TABLE_CONTAINER)
      .last();

    const box = await firstParagraphInsideTable.boundingBox();
    const box2 =
      await paragraphInsideAListInsidePanelInsideATable.boundingBox();

    const middleBox = box!.y + box!.height / 2;
    const middleBox2 = box2!.y + box2!.height / 2;

    await renderer.page.mouse.move(box!.x, middleBox);
    await renderer.page.mouse.down();
    await renderer.page.mouse.move(box2!.x + CHAR_WIDTH, middleBox2);
    await renderer.page.mouse.up();

    const result = await renderer.annotation.simulateAnnotationAtSelection(
      'fake-id-1',
    );

    await expect(result).toMatchDocumentSnapshot();
  });
});

//BrowserTestCase(
//  `Can create an annotation on nested text inside a layout`,
//  { skip: ['chrome', 'safari', 'firefox'] },
//  async (client: any, testName: string) => {
//    const page = await goToRendererTestingExample(client);
//    await mountRenderer(page, { withRendererActions: true }, nestedAdf);
//
//    const selector = `${selectors.document} [data-layout-column]`;
//    await page.waitForSelector(selector);
//    await page.simulateUserSelection(
//      selector,
//      `${selector}:nth-of-type(2)`,
//      (element) => (element === 'start' ? CHAR_WIDTH * 20 : 0),
//    );
//
//    const result = await annotate(page, '1234');
//    expect(result).toMatchCustomDocSnapshot(testName);
//  },
//);
////BrowserTestCase(
////  `Can create an annotation on a nested heading`,
//  { skip: ['chrome', 'safari', 'firefox'] },
//  async (client: any, testName: string) => {
//    const page = await goToRendererTestingExample(client);
//    await mountRenderer(page, { withRendererActions: true }, nestedAdf);
//
//    const selector = `${selectors.document} h1`;
//    await page.waitForSelector(selector);
//    await page.simulateUserSelection(selector, selector);
//
//    const result = await annotate(page, '1234');
//    expect(result).toMatchCustomDocSnapshot(testName);
//  },
//);
//
//BrowserTestCase(
//  `Can create an annotation on a nested task inside a table with overlapping marks`,
//  { skip: ['chrome', 'safari', 'firefox'] },
//  async (client: any, testName: string) => {
//    const page = await goToRendererTestingExample(client);
//    await mountRenderer(page, { withRendererActions: true }, taskDecisionAdf);
//
//    const selector = `${selectors.document} table [data-task-local-id] [data-renderer-start-pos]`;
//    await page.waitForSelector(selector);
//    await page.simulateUserSelection(selector, selector);
//
//    const result = await annotate(page, '1234');
//    expect(result).toMatchCustomDocSnapshot(testName);
//  },
//);
