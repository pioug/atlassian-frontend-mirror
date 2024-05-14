import { selectors as decisionSelectors } from '../__helpers/page-objects/_decision';
import { selectors as expandSelectors } from '../__helpers/page-objects/_expand';
import { selectors as statusSelectors } from '../__helpers/page-objects/_status';

import { expect, rendererTestCase as test } from './not-libra';
import adf from '../__fixtures__/table-complex-selections.adf.json';

test.describe('table.ts: triple click selection', () => {
  test.use({
    adf,
  });

  test('on triple-clicking last paragraph (with text,inline nodes) in table cell (row:2,col:1), it should select from last paragraph to last paragraph inside table cell', async ({
    renderer,
  }) => {
    const selector = 'tr:nth-of-type(2) td:nth-of-type(1) p:nth-of-type(2)';
    await renderer.page.locator(selector).click({ clickCount: 3 });
    await renderer.waitForRendererStable();
    const selection = await renderer.page.evaluate(() =>
      window.getSelection()?.toString(),
    );
    expect(selection).toBe(
      'second paragraph   with Jul 26, 2022 inline \nSOME STATUS\n nodes',
    );
  });

  test('on triple-clicking last paragraph (with text,inline nodes,img emoji) in table cell (row:2,col:2), it should select from last paragraph to last paragraph', async ({
    renderer,
  }) => {
    const selector = 'tr:nth-of-type(2) td:nth-of-type(2) p:nth-of-type(2)';
    await renderer.page.locator(selector).click({ clickCount: 3 });
    await renderer.waitForRendererStable();
    const selection = await renderer.page.evaluate(() =>
      window.getSelection()?.toString(),
    );
    expect(selection).toBe('second paragraph  with (img) flag emoji');
  });

  test('on triple-clicking last paragraph (with text) inside opened expand in table cell (row:2,col:3), it should select from last paragraph inside expand to last paragraph inside expand', async ({
    renderer,
  }) => {
    await renderer.page.click(expandSelectors.nestedExpandToggle);
    await renderer.waitForRendererStable();

    const selector = `tr:nth-of-type(2) td:nth-of-type(3) ${expandSelectors.nestedExpandOpen} p:nth-of-type(2)`;
    await renderer.page.locator(selector).click({ clickCount: 3 });
    await renderer.waitForRendererStable();

    const selection = await renderer.page.evaluate(() =>
      window.getSelection()?.toString(),
    );
    expect(selection).toBe('last paragraph in expand');
  });

  test('on triple-clicking status (standalone) in table cell (row:3,col:1), it should select from status to status', async ({
    renderer,
  }) => {
    const selector = `tr:nth-of-type(3) td:nth-of-type(1) ${statusSelectors.status}`;
    await renderer.page.locator(selector).click({ clickCount: 3 });
    await renderer.waitForRendererStable();

    const selection = await renderer.page.evaluate(() =>
      window.getSelection()?.toString(),
    );
    expect(selection).toBe('SOME STATUS');
  });

  test('on triple-clicking last decision item (with text) in table cell (row:3,col:2), it should select from last decision item to last decision item', async ({
    renderer,
  }) => {
    const selector = `tr:nth-of-type(3) td:nth-of-type(2) li:nth-of-type(2) ${decisionSelectors.decisionItem}`;
    await renderer.page.locator(selector).click({ clickCount: 3 });
    await renderer.waitForRendererStable();

    const selection = await renderer.page.evaluate(() =>
      window.getSelection()?.toString(),
    );
    expect(selection).toBe('more decision text');
  });

  test('on triple-clicking first paragraph (with text) above panel in table cell (row:3,col:3), it should select from first paragraph above panel to first paragraph inside panel', async ({
    renderer,
  }) => {
    const selector = `tr:nth-of-type(3) td:nth-of-type(3) > p:nth-of-type(1)`;
    await renderer.page.locator(selector).click({ clickCount: 3 });
    await renderer.waitForRendererStable();

    const selection = await renderer.page.evaluate(() =>
      window.getSelection()?.toString(),
    );
    expect(selection).toBe('first paragraph\n\n');
  });

  test('on triple-clicking last line in codeblock in table cell (row:4,col:1), it should select from codeblock to codeblock', async ({
    renderer,
  }) => {
    // Cannot use selectors from _codeblock.ts as its transitive import (design-system/code) uses pragma
    // And pragma is not supported in playwright
    const selector = `tr:nth-of-type(4) td:nth-of-type(1) .code-block`;
    await renderer.page.locator(selector).click({ clickCount: 3 });
    await renderer.waitForRendererStable();

    const selection = await renderer.page.evaluate(() =>
      window.getSelection()?.toString(),
    );
    expect(selection).toBe('\nfirst code line\nlast code line');
  });

  test('on triple-clicking first line in codeblock in table cell (row: 4, col: 1), it should select from line of codeblock to next line number of codeblock inside table cell', async ({
    renderer,
  }) => {
    // Cannot use selectors from _codeblock.ts as its transitive import (design-system/code) uses pragma
    // And pragma is not supported in playwright
    const selector = `tr:nth-of-type(4) td:nth-of-type(1) .code-block > span code > span:first-child`;
    await renderer.page.locator(selector).click({ clickCount: 3 });
    await renderer.waitForRendererStable();

    const selection = await renderer.page.evaluate(() =>
      window.getSelection()?.toString(),
    );
    expect(selection).toBe('first code line\n');
  });

  test('on triple-clicking nearby (outside) mediaSingle in table cell (row:4,col:2), it should select from table cell to table cell', async ({
    renderer,
  }) => {
    const selector = `tr:nth-of-type(4) td:nth-of-type(2)`;
    await renderer.page.locator(selector).click({ clickCount: 3 });
    await renderer.waitForRendererStable();

    const selection = await renderer.page.evaluate(() =>
      window.getSelection()?.toString(),
    );
    expect(selection).toBe(' ');
  });
});
