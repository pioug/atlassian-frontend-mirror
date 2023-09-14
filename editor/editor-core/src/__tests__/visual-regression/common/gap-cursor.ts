// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  Appearance,
  initEditorWithAdf,
  snapshot,
} from '@atlaskit/editor-test-helpers/vr-utils/base-utils';
import gapCursorTable from './__fixtures__/gap-cursor-table-adf.json';
import paragraph from './__fixtures__/paragraph-of-text.adf.json';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { pressKey } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
import type { PuppeteerPage } from '@atlaskit/visual-regression/helper';

let page: PuppeteerPage;

const initEditor = async (adf?: Object) => {
  await initEditorWithAdf(page, {
    adf,
    viewport: { width: 1040, height: 600 },
    appearance: Appearance.fullPage,
  });
};

describe('Gap cursor: table', () => {
  beforeEach(async () => {
    page = global.page;
    await initEditor(gapCursorTable);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should the gap-cursor before the top divider element to have zero margin top', async () => {
    await page.click('hr:first-child');
    await pressKey(page, ['ArrowLeft']);
    await page.waitForSelector(selectors.gapCursor);
  });

  it('should the gap-cursor after the top divider element to have zero margin top', async () => {
    await page.click('hr:first-child');
    await pressKey(page, ['ArrowRight']);
    await page.waitForSelector(selectors.gapCursor);
  });

  it('should the gap-cursor before the bottom divider element remains the same margin on both top and bottom', async () => {
    await page.click('hr:last-of-type');
    await pressKey(page, ['ArrowLeft']);
    await page.waitForSelector(selectors.gapCursor);
  });

  it('should the gap-cursor after the bottom divider element remains the same margin on both top and bottom', async () => {
    await page.click('hr:last-of-type');
    await pressKey(page, ['ArrowRight']);
    await page.waitForSelector(selectors.gapCursor);
  });
});

describe('Gap cursor: selection', () => {
  beforeEach(async () => {
    page = global.page;
    await initEditor(paragraph);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should not break selection when the users drag finishes outside the doc', async () => {
    const rect = await page.evaluate((selector: string) => {
      const element = document.querySelector(selector)!;
      const { x, y, width, height } =
        element.getBoundingClientRect() as DOMRect;
      return { left: x, top: y, width, height, id: element.id };
    }, `${selectors.editor} p`);

    // Move cursor to the bottom right of the paragraph
    // Not entirely sure why we need to subtract 2px here, but we need it
    await page.mouse.move(
      rect.left + rect.width - 2,
      rect.top + rect.height - 2,
    );

    // Start of the dragging
    await page.mouse.down();

    // We minus more off left / top here to ensure
    // we let go of the drag outside the editor bounds.
    // We need to provide steps otherwise the mousemova delta is too large.
    await page.mouse.move(rect.left - 50, rect.top - 10, { steps: 100 });

    // Let go, we should have the paragraph selected at this point.
    await page.mouse.up();
  });

  it('should place my cursor inside the editor when clicking outside the boundary', async () => {
    // Remove focus from the editor.
    await page.evaluate(() => {
      // @ts-ignore - Object is possibly 'null' && Property 'blur' does not exist on type 'Element'.
      document.activeElement.blur();
    });

    // Click somewhere in the top left, cursor should return to the editor.
    await page.mouse.click(20, 200);
  });
});
