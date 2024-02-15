import { rendererTestCase as test, expect } from './not-libra';
import {
  paragraphsWithMedia,
  paragraphWithInlineNodes,
  paragraphWithoutInlineNodes,
} from './validate-range.spec.ts-fixtures';

const CHAR_WIDTH = 6;
const PARAGRAPH = 'p';

test.use({ rendererMountOptions: { withRendererActions: true } });

test.describe('validate-range: paragraphsWithMedia', () => {
  test.use({ adf: paragraphsWithMedia });
  test(`A selection containing text and media validates false`, async ({
    renderer,
  }) => {
    const paragraphs = renderer.page.locator(PARAGRAPH);

    const box = await paragraphs.first().boundingBox();
    const box2 = await paragraphs.last().boundingBox();

    const middleBox = box!.y + box!.height / 2;
    const middleBox2 = box2!.y + box2!.height / 2;

    await renderer.page.mouse.move(box!.x, middleBox);
    await renderer.page.mouse.down();
    await renderer.page.mouse.move(box2!.x + CHAR_WIDTH, middleBox2);
    await renderer.page.mouse.up();

    expect(await renderer.annotation.validateRange()).toBeFalsy();
  });
});

test.describe('validate-range: paragraphWithInlineNodes', () => {
  test.use({ adf: paragraphWithInlineNodes });

  test(`A selection containing text and mention validates false`, async ({
    renderer,
  }) => {
    const paragraphs = renderer.page.locator(PARAGRAPH);

    const box = await paragraphs.first().boundingBox();

    const middleBox = box!.y + box!.height / 2;

    await renderer.page.mouse.move(box!.x, middleBox);
    await renderer.page.mouse.down();
    await renderer.page.mouse.move(box!.x + box!.width, middleBox);
    await renderer.page.mouse.up();

    expect(await renderer.annotation.validateRange()).toBeFalsy();
  });

  test(`A selection containing text and emoji validates false`, async ({
    renderer,
  }) => {
    const paragraphs = renderer.page.locator(PARAGRAPH);

    const box = await paragraphs.nth(1).boundingBox();

    const middleBox = box!.y + box!.height / 2;

    await renderer.page.mouse.move(box!.x, middleBox);
    await renderer.page.mouse.down();
    await renderer.page.mouse.move(box!.x + box!.width, middleBox);
    await renderer.page.mouse.up();

    expect(await renderer.annotation.validateRange()).toBeFalsy();
  });

  test(`A selection containing text and status validates false`, async ({
    renderer,
  }) => {
    const paragraphs = renderer.page.locator(PARAGRAPH);

    const box = await paragraphs.nth(2).boundingBox();

    const middleBox = box!.y + box!.height / 2;

    await renderer.page.mouse.move(box!.x, middleBox);
    await renderer.page.mouse.down();
    await renderer.page.mouse.move(box!.x + box!.width, middleBox);
    await renderer.page.mouse.up();

    expect(await renderer.annotation.validateRange()).toBeFalsy();
  });

  test(`A full line selection with inline nodes validates false`, async ({
    renderer,
  }) => {
    const paragraphs = renderer.page.locator(PARAGRAPH);

    const box = await paragraphs.first().boundingBox();

    const middleBox = box!.y + box!.height / 2;

    await renderer.page.mouse.move(box!.x, middleBox);
    await renderer.page.mouse.down();
    await renderer.page.mouse.move(box!.x + box!.width, middleBox);
    await renderer.page.mouse.up();

    expect(await renderer.annotation.validateRange()).toBeFalsy();
  });
});

test.describe('validate-range: paragraphWithoutInlineNodes', () => {
  test.use({ adf: paragraphWithoutInlineNodes });

  test(`A full line selection without inline nodes validates true`, async ({
    renderer,
  }) => {
    const paragraphs = renderer.page.locator(PARAGRAPH);

    const box = await paragraphs.first().boundingBox();

    const middleBox = box!.y + box!.height / 2;

    await renderer.page.mouse.move(box!.x, middleBox);
    await renderer.page.mouse.down();
    await renderer.page.mouse.move(box!.x + box!.width, middleBox);
    await renderer.page.mouse.up();

    expect(await renderer.annotation.validateRange()).toBeTruthy();
  });
});
