import { Appearance, initEditorWithAdf, snapshot } from '../_utils';
import gapcursor from './__fixtures__/gap-cursor-adf.json';
import gapCursorLayout from './__fixtures__/gap-cursor-layout-adf.json';
import paragraph from './__fixtures__/paragraph-of-text.adf.json';
import { selectors } from '../../__helpers/page-objects/_editor';
import { pressKey } from '../../__helpers/page-objects/_keyboard';
import { PuppeteerPage } from '@atlaskit/visual-regression/helper';
import { clickOnStatus } from '../../__helpers/page-objects/_status';

let page: PuppeteerPage;

const initEditor = async (adf?: Object) => {
  await initEditorWithAdf(page, {
    adf,
    viewport: { width: 1040, height: 600 },
    appearance: Appearance.fullPage,
  });
};

describe('Gap cursor:', () => {
  beforeEach(async () => {
    page = global.page;
    await initEditor(gapcursor);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should render gap cursor for code when ArrowRight', async () => {
    await page.click(selectors.codeContent);
    await pressKey(page, 'ArrowRight');
    await pressKey(page, 'ArrowRight');
    await page.waitForSelector(selectors.gapCursor);
  });

  it('should render gap cursor on panel when ArrowLeft', async () => {
    await page.click(selectors.panelContent);
    await pressKey(page, 'ArrowLeft');
    await pressKey(page, 'ArrowLeft');
    await page.waitForSelector(selectors.gapCursor);
  });

  it('should render gap cursor on table on ArrowUp', async () => {
    await page.click(selectors.panelContent);
    await pressKey(page, 'ArrowLeft');
    await pressKey(page, 'ArrowLeft');
    await pressKey(page, 'ArrowUp');
    await page.waitForSelector(selectors.gapCursor);
  });

  it('should render gap cursor on table on ArrowDown', async () => {
    await page.click(selectors.codeContent);
    await pressKey(page, 'ArrowRight');
    await pressKey(page, 'ArrowRight');
    await pressKey(page, 'ArrowDown');
    await page.waitForSelector(selectors.gapCursor);
  });
});

describe('Gap cursor: layout', () => {
  beforeEach(async () => {
    page = global.page;
    await initEditor(gapCursorLayout);
  });

  it('should render gap cursor on action inside a layout on ArrowRight', async () => {
    await clickOnStatus(page);
    await pressKey(page, ['ArrowRight', 'ArrowRight']);
    await page.waitForSelector(selectors.gapCursor);
    await snapshot(page, undefined, '[data-layout-section]');
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
      const {
        x,
        y,
        width,
        height,
      } = element.getBoundingClientRect() as DOMRect;
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
